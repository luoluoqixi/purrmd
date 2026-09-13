import { syntaxTree } from '@codemirror/language';
import { Extension, type Range, StateEffect } from '@codemirror/state';
import {
  Decoration,
  DecorationSet,
  EditorView,
  ViewPlugin,
  ViewUpdate,
  WidgetType,
} from '@codemirror/view';

import { isFocusEventState, isForceUpdateEventState, isScrollEndUpdateEventState } from '../state';
import { FormattingDisplayMode } from '../types';
import { findNodeURL, isSelectRange, selectRange } from '../utils';

const defaultImageRetryDelay = 800;
const retryFailedImagesEffect = StateEffect.define<readonly string[] | null>();

/** 请求图片插件重新加载当前失败的图片；不传 URLs 时重试全部失败图片。 */
export const retryFailedImages = (view: EditorView, urls?: readonly string[]) => {
  view.dispatch({ effects: [retryFailedImagesEffect.of(urls ?? null)] });
  return true;
};

export const imageClass = {
  image: 'purrmd-cm-image',
  imageLinkWrap: 'purrmd-cm-image-link-wrap',
  imageWrap: 'purrmd-cm-image-wrap',
  imageDom: 'purrmd-cm-image-dom',
  imageFallback: 'purrmd-cm-image-fallback',
};

class Image extends WidgetType {
  constructor(
    readonly failedImageUrls: Set<string>,
    readonly url: string | null | undefined,
    readonly alt: string | null | undefined,
    readonly isImageLink: boolean,
    readonly onImageDown: ((e: MouseEvent) => void) | null,
    readonly onImageLoad: ((url: string) => void) | null,
    readonly onImageLoadFailed: ((url: string) => void) | null,
    readonly noImageAvailableLabel?: string,
    readonly imageLoadFailedLabel?: (url: string) => string,
  ) {
    super();
  }

  toDOM() {
    const el = document.createElement('span');
    el.className = this.isImageLink ? imageClass.imageLinkWrap : imageClass.imageWrap;
    if (this.url) {
      const url = this.url;
      const hasFailed = this.failedImageUrls.has(url);

      const appendError = () => {
        const fallbackText = document.createElement('span');
        fallbackText.className = imageClass.imageFallback;
        fallbackText.textContent =
          this.imageLoadFailedLabel?.(url) || `Image failed to load: ${url}`;

        el.appendChild(fallbackText);
      };

      if (hasFailed) {
        appendError();
      } else {
        const img = document.createElement('img');
        img.className = imageClass.imageDom;
        img.src = url;

        if (this.alt) {
          img.alt = this.alt;
        }

        img.onload = () => this.onImageLoad?.(url);
        img.onerror = () => {
          this.failedImageUrls.add(url);
          img.style.display = 'none';
          appendError();
          this.onImageLoadFailed?.(url);
        };

        el.appendChild(img);
      }
    } else {
      const fallbackText = document.createElement('span');
      fallbackText.className = imageClass.imageFallback;
      fallbackText.textContent = this.noImageAvailableLabel || 'No image available';
      el.appendChild(fallbackText);
    }

    el.onmousedown = this.onImageDown;

    return el;
  }

  ignoreEvent() {
    return false;
  }
}

function imageDecorations(
  mode: FormattingDisplayMode,
  config: ImageConfig | undefined,
  view: EditorView,
  failedImageUrls: Set<string>,
  onImageLoad: (url: string, rawUrl: string | null | undefined) => void,
  onImageLoadFailed: (url: string, rawUrl: string | null | undefined) => void,
  onImageUrl: (url: string) => void,
): DecorationSet {
  const state = view.state;
  const decorations: Range<Decoration>[] = [];
  syntaxTree(state).iterate({
    enter(node) {
      if (mode === 'show') return;
      if (node.type.name === 'Image') {
        const isSelect = isSelectRange(state, node);
        if (!config?.imageAlwaysShow && isSelect) {
          return;
        }
        const parent = node.node.parent;
        const isImageLink = parent != null && parent.type.name === 'Link';
        const rawUrl = findNodeURL(state, node);
        const from = node.from;
        const to = node.to;
        let url = rawUrl;
        if (config?.proxyURL) {
          url = config.proxyURL(rawUrl || '');
        }
        if (url) {
          onImageUrl(url);
        }
        const image = new Image(
          failedImageUrls,
          url,
          null,
          isImageLink,
          (e) => {
            selectRange(view, { from, to });
            config?.onImageDown?.(e, url, rawUrl);
          },
          (loadedUrl) => onImageLoad(loadedUrl, rawUrl),
          (failedUrl) => onImageLoadFailed(failedUrl, rawUrl),
          config?.NoImageAvailableLabel,
          config?.ImageLoadFailedLabel,
        );
        if (isSelect) {
          const decoration = Decoration.widget({
            widget: image,
            side: 1,
          }).range(node.to);
          decorations.push(decoration);
        } else {
          const decoration = Decoration.replace({
            widget: image,
            side: -1,
          }).range(node.from, node.to);
          decorations.push(decoration);
        }
      }
    },
  });
  return Decoration.set(decorations, true);
}

export function image(mode: FormattingDisplayMode, config?: ImageConfig): Extension {
  if (config == null) config = {};
  config.imageAlwaysShow ??= true;
  const loadRetryConfig =
    config.loadRetry === true ? {} : config.loadRetry === false ? undefined : config.loadRetry;
  const retryDelay = Math.max(loadRetryConfig?.delayMs ?? defaultImageRetryDelay, 0);
  const maxAutomaticRetries = Math.max(Math.floor(loadRetryConfig?.maxRetries ?? 1), 0);
  const imagePlugin: Extension = ViewPlugin.fromClass(
    class {
      private readonly failedImageUrls = new Set<string>();
      private readonly automaticRetryCounts = new Map<string, number>();
      private readonly activeImageUrls = new Set<string>();
      private automaticRetryTimeout: number | null = null;
      private destroyed = false;
      private updateCount = 0;
      decorations: DecorationSet;
      constructor(view: EditorView) {
        this.decorations = this.createDecorations(view);
      }
      private createDecorations(view: EditorView) {
        const nextActiveImageUrls = new Set<string>();
        const decorations = imageDecorations(
          mode,
          config,
          view,
          this.failedImageUrls,
          (url, rawUrl) => config.onImageLoad?.({ url, rawUrl }),
          (url, rawUrl) => {
            const retry = () => {
              if (this.destroyed || !this.activeImageUrls.has(url)) return false;
              return retryFailedImages(view, [url]);
            };
            config.onImageLoadError?.({ url, rawUrl, retry });

            if (loadRetryConfig == null) return;
            if ((this.automaticRetryCounts.get(url) ?? 0) >= maxAutomaticRetries) return;
            if (this.automaticRetryTimeout !== null) {
              clearTimeout(this.automaticRetryTimeout);
            }

            // 连续编辑链接时重置等待，只重试用户停顿后仍在文档中的最终 URL。
            this.automaticRetryTimeout = window.setTimeout(() => {
              this.automaticRetryTimeout = null;
              const retryUrls = [...this.failedImageUrls].filter(
                (failedUrl) =>
                  this.activeImageUrls.has(failedUrl) &&
                  (this.automaticRetryCounts.get(failedUrl) ?? 0) < maxAutomaticRetries,
              );
              if (retryUrls.length === 0) return;

              for (const failedUrl of retryUrls) {
                const retryCount = this.automaticRetryCounts.get(failedUrl) ?? 0;
                this.automaticRetryCounts.set(failedUrl, retryCount + 1);
              }
              view.dispatch({ effects: [retryFailedImagesEffect.of(retryUrls)] });
            }, retryDelay);
          },
          (url) => nextActiveImageUrls.add(url),
        );

        this.activeImageUrls.clear();
        for (const url of nextActiveImageUrls) {
          this.activeImageUrls.add(url);
        }
        for (const url of this.automaticRetryCounts.keys()) {
          if (!this.activeImageUrls.has(url)) {
            this.automaticRetryCounts.delete(url);
            this.failedImageUrls.delete(url);
          }
        }
        return decorations;
      }
      update(update: ViewUpdate) {
        const forceUpdate = isForceUpdateEventState(update.startState, update.state);
        const scrollEndUpdate = isScrollEndUpdateEventState(update.startState, update.state);
        let retryRequested = false;
        for (const transaction of update.transactions) {
          for (const effect of transaction.effects) {
            if (!effect.is(retryFailedImagesEffect)) continue;
            retryRequested = true;
            if (effect.value == null) {
              this.failedImageUrls.clear();
            } else {
              for (const url of effect.value) {
                if (this.activeImageUrls.has(url)) this.failedImageUrls.delete(url);
              }
            }
          }
        }
        if (scrollEndUpdate && loadRetryConfig?.retryOnScrollEnd) {
          // 滚动结束等显式刷新需要重新请求失败图片，而不是永久保留 fallback。
          this.failedImageUrls.clear();
        }
        if (
          update.docChanged ||
          update.viewportChanged ||
          update.selectionSet ||
          isFocusEventState(update.startState, update.state) ||
          forceUpdate ||
          retryRequested
        ) {
          this.decorations = this.createDecorations(update.view);
          this.updateCount++;
          if (this.updateCount > 1000) {
            // 每 1000 次更新清理一次失败的图片 URL
            this.updateCount = 0;
            this.failedImageUrls.clear();
          }
        }
      }
      destroy() {
        this.destroyed = true;
        if (this.automaticRetryTimeout !== null) {
          clearTimeout(this.automaticRetryTimeout);
          this.automaticRetryTimeout = null;
        }
      }
    },
    { decorations: (v) => v.decorations },
  );
  return imagePlugin;
}

export interface ImageConfig {
  /** Proxy URL, if provided, will be used to transform the URL */
  proxyURL?: (url: string) => string;
  /** image alway show, @default true */
  imageAlwaysShow?: boolean;
  /** Label when no image available, @default 'No image available' */
  NoImageAvailableLabel?: string;
  /** Label when image load failed, @default (url) => `Image failed to load: ${url}` */
  ImageLoadFailedLabel?: (url: string) => string;
  /** 图片加载成功事件。 */
  onImageLoad?: (event: ImageLoadEvent) => void;
  /** 图片加载失败事件，可保存并在合适时机调用 retry。 */
  onImageLoadError?: (event: ImageLoadErrorEvent) => void;
  /** 内置重试策略；默认关闭，设为 true 使用默认策略。 */
  loadRetry?: boolean | ImageLoadRetryConfig;
  /** on image down */
  onImageDown?: (
    e: MouseEvent,
    url: string | null | undefined,
    rawUrl: string | null | undefined,
  ) => void;
}

export interface ImageLoadEvent {
  /** 经过 proxyURL 转换、实际用于加载的 URL。 */
  url: string;
  /** Markdown 中的原始 URL。 */
  rawUrl: string | null | undefined;
}

export interface ImageLoadErrorEvent {
  /** 加载失败的实际 URL。 */
  url: string;
  /** Markdown 中的原始 URL。 */
  rawUrl: string | null | undefined;
  /** 仅当该 URL 仍在当前文档中时发起一次定向重试。 */
  retry: () => boolean;
}

export interface ImageLoadRetryConfig {
  /** 用户停止输入后等待多久再重试，单位 ms。@default 800 */
  delayMs?: number;
  /** 每个 URL 的最大自动重试次数。@default 1 */
  maxRetries?: number;
  /** 是否在滚动结束触发装饰刷新时重试失败图片。@default false */
  retryOnScrollEnd?: boolean;
}
