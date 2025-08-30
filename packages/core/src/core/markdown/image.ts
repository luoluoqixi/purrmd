import { syntaxTree } from '@codemirror/language';
import { Extension, type Range } from '@codemirror/state';
import {
  Decoration,
  DecorationSet,
  EditorView,
  ViewPlugin,
  ViewUpdate,
  WidgetType,
} from '@codemirror/view';

import { isFocusEventState } from '../state';
import { FormattingDisplayMode } from '../types';
import { findNodeURL, isSelectRange, selectRange } from '../utils';

export const imageClass = {
  image: 'purrmd-cm-image',
  imageLinkWrap: 'purrmd-cm-image-link-wrap',
  imageWrap: 'purrmd-cm-image-wrap',
  imageDom: 'purrmd-cm-image-dom',
  imageFallback: 'purrmd-cm-image-fallback',
};

class Image extends WidgetType {
  constructor(
    readonly url: string | null | undefined,
    readonly alt: string | null | undefined,
    readonly isImageLink: boolean,
    readonly onImageDown: ((e: MouseEvent) => void) | null,
  ) {
    super();
  }

  toDOM() {
    const el = document.createElement('span');
    el.className = this.isImageLink ? imageClass.imageLinkWrap : imageClass.imageWrap;
    if (this.url) {
      const img = document.createElement('img');
      img.className = imageClass.imageDom;
      img.src = this.url;

      if (this.alt) {
        img.alt = this.alt;
      }

      img.onerror = () => {
        img.style.display = 'none';

        const fallbackText = document.createElement('span');
        fallbackText.className = imageClass.imageFallback;
        fallbackText.textContent = this.alt || 'Image failed to load';
        fallbackText.title = `Failed to load: ${this.url}`;

        el.appendChild(fallbackText);
      };

      el.appendChild(img);
    } else {
      const fallbackText = document.createElement('span');
      fallbackText.className = imageClass.imageFallback;
      fallbackText.textContent = this.alt || 'No image available';
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
        let rawUrl = findNodeURL(state, node);
        const from = node.from;
        const to = node.to;
        let url = rawUrl;
        if (config?.proxyURL) {
          url = config.proxyURL(rawUrl || '');
        }
        const image = new Image(url, null, isImageLink, (e) => {
          selectRange(view, { from, to });
          config?.onImageDown?.(e, url, rawUrl);
        });
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
  const imagePlugin: Extension = ViewPlugin.fromClass(
    class {
      decorations: DecorationSet;
      constructor(view: EditorView) {
        this.decorations = imageDecorations(mode, config, view);
      }
      update(update: ViewUpdate) {
        if (
          update.docChanged ||
          update.viewportChanged ||
          update.selectionSet ||
          isFocusEventState(update.startState, update.state)
        )
          this.decorations = imageDecorations(mode, config, update.view);
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
  /** on image down */
  onImageDown?: (
    e: MouseEvent,
    url: string | null | undefined,
    rawUrl: string | null | undefined,
  ) => void;
}
