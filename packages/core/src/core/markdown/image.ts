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

import { FormattingDisplayMode } from '../types';
import { findNodeURL, isSelectRange, selectRange } from '../utils';

export const imageClass = {
  imageLinkWrap: 'purrmd-cm-image-link-wrap',
  imageWrap: 'purrmd-cm-image-wrap',
  image: 'purrmd-cm-image',
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
      const alt = this.alt ? `alt="${this.alt}"` : '';
      el.innerHTML = `<img class="${imageClass.image}" src="${this.url}" ${alt} />`;
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
      if (mode === 'show' || isSelectRange(state, node)) return;
      if (node.type.name === 'Image') {
        const parent = node.node.parent;
        const isImageLink = parent != null && parent.type.name === 'Link';
        let url = findNodeURL(state, node);
        const from = node.from;
        const to = node.to;
        if (config?.proxyURL) {
          url = config.proxyURL(url || '');
        }
        const image = new Image(url, null, isImageLink, () => {
          selectRange(view, { from, to });
        });
        const decoration = Decoration.replace({
          widget: image,
          side: -1,
        }).range(node.from, node.to);
        decorations.push(decoration);
      }
    },
  });
  return Decoration.set(decorations, true);
}

export function image(mode: FormattingDisplayMode, config?: ImageConfig): Extension {
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
          update.focusChanged
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
}
