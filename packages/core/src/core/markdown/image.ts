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
const imageTapMaxMovement = 12;
const retryFailedImagesEffect = StateEffect.define<ImageRetryRequest>();

type ImageRetryRequest = {
  urls: readonly string[] | null;
  reason: ImageRetryReason;
};

/** 请求图片插件重新加载当前失败的图片；不传 URLs 时重试全部失败图片。 */
export const retryFailedImages = (view: EditorView, urls?: readonly string[]) => {
  view.dispatch({
    effects: [retryFailedImagesEffect.of({ urls: urls ?? null, reason: 'manual' })],
  });
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
  private activeTouch: { identifier: number; x: number; y: number; moved: boolean } | null = null;

  constructor(
    readonly failedImageUrls: Set<string>,
    readonly url: string | null | undefined,
    readonly requestUrl: string | null | undefined,
    readonly alt: string | null | undefined,
    readonly isImageLink: boolean,
    readonly onImageDown: ((e: MouseEvent) => void) | null,
    readonly onImageTouchEnd: ((e: TouchEvent) => void) | null,
    readonly onImageLoad: ((url: string, requestUrl: string) => void) | null,
    readonly onImageLoadFailed: ((url: string, requestUrl: string) => void) | null,
    readonly noImageAvailableLabel?: string,
    readonly imageLoadFailedLabel?: (url: string) => string,
  ) {
    super();
  }

  toDOM() {
    const el = document.createElement('span');
    el.className = this.isImageLink ? imageClass.imageLinkWrap : imageClass.imageWrap;
    if (this.url && this.requestUrl) {
      const url = this.url;
      const requestUrl = this.requestUrl;
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
        img.src = requestUrl;

        if (this.alt) {
          img.alt = this.alt;
        }

        img.onload = () => this.onImageLoad?.(url, requestUrl);
        img.onerror = () => {
          this.failedImageUrls.add(url);
          img.style.display = 'none';
          appendError();
          this.onImageLoadFailed?.(url, requestUrl);
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
    el.ontouchstart = (event) => {
      if (event.touches.length !== 1 || event.changedTouches.length !== 1) {
        this.activeTouch = null;
        return;
      }
      const touch = event.changedTouches[0];
      this.activeTouch = {
        identifier: touch.identifier,
        x: touch.clientX,
        y: touch.clientY,
        moved: false,
      };
    };
    el.ontouchmove = (event) => {
      if (!this.activeTouch) return;
      const touch = Array.from(event.changedTouches).find(
        (candidate) => candidate.identifier === this.activeTouch?.identifier,
      );
      if (!touch) return;
      if (
        Math.hypot(touch.clientX - this.activeTouch.x, touch.clientY - this.activeTouch.y) >
        imageTapMaxMovement
      ) {
        this.activeTouch.moved = true;
      }
    };
    el.ontouchend = (event) => {
      const touch = event.changedTouches[0];
      const isTap =
        event.changedTouches.length === 1 &&
        event.touches.length === 0 &&
        this.activeTouch?.identifier === touch?.identifier &&
        !this.activeTouch.moved;
      this.activeTouch = null;
      if (!isTap) return;
      this.onImageTouchEnd?.(event);
      event.stopPropagation();
    };
    el.ontouchcancel = () => {
      this.activeTouch = null;
    };

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
  getImageRequestUrl: (url: string) => string,
  onImageLoad: (url: string, requestUrl: string, rawUrl: string | null | undefined) => void,
  onImageLoadFailed: (url: string, requestUrl: string, rawUrl: string | null | undefined) => void,
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
        const requestUrl = url ? getImageRequestUrl(url) : url;
        const image = new Image(
          failedImageUrls,
          url,
          requestUrl,
          null,
          isImageLink,
          (e) => {
            selectRange(view, { from, to });
            config?.onImageDown?.(e, url, rawUrl);
          },
          (e) => {
            view.dispatch({ selection: { anchor: to, head: from } });
            config?.onImageTouchEnd?.(e, url, rawUrl);
          },
          (loadedUrl, loadedRequestUrl) => onImageLoad(loadedUrl, loadedRequestUrl, rawUrl),
          (failedUrl, failedRequestUrl) => onImageLoadFailed(failedUrl, failedRequestUrl, rawUrl),
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
      private readonly retryCounts = new Map<string, number>();
      private readonly retryReasons = new Map<string, ImageRetryReason>();
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
          (url) => {
            const retryCount = this.retryCounts.get(url) ?? 0;
            if (retryCount === 0 || loadRetryConfig?.getRetryUrl == null) return url;
            try {
              return loadRetryConfig.getRetryUrl(url, {
                retryCount,
                reason: this.retryReasons.get(url) ?? 'manual',
              });
            } catch {
              return url;
            }
          },
          (url, requestUrl, rawUrl) => config.onImageLoad?.({ url, requestUrl, rawUrl }),
          (url, requestUrl, rawUrl) => {
            const retry = () => {
              if (this.destroyed || !this.activeImageUrls.has(url)) return false;
              return retryFailedImages(view, [url]);
            };
            config.onImageLoadError?.({ url, requestUrl, rawUrl, retry });

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

              view.dispatch({
                effects: [retryFailedImagesEffect.of({ urls: retryUrls, reason: 'automatic' })],
              });
            }, retryDelay);
          },
          (url) => nextActiveImageUrls.add(url),
        );

        this.activeImageUrls.clear();
        for (const url of nextActiveImageUrls) {
          this.activeImageUrls.add(url);
        }
        const trackedUrls = new Set([
          ...this.failedImageUrls,
          ...this.automaticRetryCounts.keys(),
          ...this.retryCounts.keys(),
          ...this.retryReasons.keys(),
        ]);
        for (const url of trackedUrls) {
          if (!this.activeImageUrls.has(url)) {
            this.automaticRetryCounts.delete(url);
            this.failedImageUrls.delete(url);
            this.retryCounts.delete(url);
            this.retryReasons.delete(url);
          }
        }
        return decorations;
      }
      update(update: ViewUpdate) {
        const forceUpdate = isForceUpdateEventState(update.startState, update.state);
        const scrollEndUpdate = isScrollEndUpdateEventState(update.startState, update.state);
        let retryRequested = false;
        const prepareRetry = (url: string, reason: ImageRetryReason) => {
          if (!this.activeImageUrls.has(url) || !this.failedImageUrls.has(url)) return;
          this.failedImageUrls.delete(url);
          this.retryCounts.set(url, (this.retryCounts.get(url) ?? 0) + 1);
          this.retryReasons.set(url, reason);
          if (reason === 'automatic') {
            this.automaticRetryCounts.set(url, (this.automaticRetryCounts.get(url) ?? 0) + 1);
          }
          retryRequested = true;
        };
        for (const transaction of update.transactions) {
          for (const effect of transaction.effects) {
            if (!effect.is(retryFailedImagesEffect)) continue;
            if (effect.value.urls == null) {
              for (const url of [...this.failedImageUrls]) {
                prepareRetry(url, effect.value.reason);
              }
            } else {
              for (const url of effect.value.urls) {
                prepareRetry(url, effect.value.reason);
              }
            }
          }
        }
        if (scrollEndUpdate && loadRetryConfig?.retryOnScrollEnd) {
          for (const url of [...this.failedImageUrls]) {
            prepareRetry(url, 'scroll-end');
          }
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
  /** 触摸点击图片事件。在原始 touchend 中同步选中图片 Markdown，滚动手势不会触发。 */
  onImageTouchEnd?: (
    e: TouchEvent,
    url: string | null | undefined,
    rawUrl: string | null | undefined,
  ) => void;
}

export interface ImageLoadEvent {
  /** 经过 proxyURL 转换后的稳定 URL，用于识别同一图片。 */
  url: string;
  /** 本次实际赋给 img.src 的 URL；重试策略可能对它做额外转换。 */
  requestUrl: string;
  /** Markdown 中的原始 URL。 */
  rawUrl: string | null | undefined;
}

export interface ImageLoadErrorEvent {
  /** 经过 proxyURL 转换后的稳定 URL，用于识别同一图片。 */
  url: string;
  /** 本次加载失败时实际赋给 img.src 的 URL。 */
  requestUrl: string;
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
  /**
   * 为一次重试生成实际请求 URL。默认继续使用稳定 URL。
   * 可用于给存在失败缓存的平台添加 cache-busting query。
   */
  getRetryUrl?: (url: string, context: ImageRetryContext) => string;
}

export type ImageRetryReason = 'automatic' | 'manual' | 'scroll-end';

export interface ImageRetryContext {
  /** 当前稳定 URL 在本次编辑器会话中的累计重试次数，从 1 开始。 */
  retryCount: number;
  reason: ImageRetryReason;
}
