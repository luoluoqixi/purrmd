import { syntaxTree } from '@codemirror/language';
import { EditorState, Extension, type Range } from '@codemirror/state';
import { StateField } from '@codemirror/state';
import { Decoration, DecorationSet, EditorView } from '@codemirror/view';

import { isFocusEvent } from '../state';
import { FormattingDisplayMode } from '../types';
import { deviceIsDesktop, findNodeURL, isSelectRange, setSubNodeHideDecorations } from '../utils';

export const linkClass = {
  link: 'purrmd-cm-link',
  linkURL: 'purrmd-cm-link-url',
  linkTitle: 'purrmd-cm-link-title',
  linkFormatting: 'purrmd-cm-formatting-link',
  linkHideFormatting: 'purrmd-cm-formatting-link-hide',
  linkHover: 'purrmd-cm-link-hover',
};

const linkDecoration = Decoration.mark({
  class: linkClass.linkFormatting,
});

const linkHideDecoration = Decoration.mark({
  class: linkClass.linkHideFormatting,
});

const linkTitleDecoration = Decoration.mark({
  class: linkClass.linkTitle,
});

function updateLinkDecorations(
  mode: FormattingDisplayMode,
  config: LinkConfig | undefined,
  state: EditorState,
): DecorationSet {
  const decorations: Range<Decoration>[] = [];
  syntaxTree(state).iterate({
    enter(node) {
      if (node.type.name === 'Link') {
        if (mode === 'show' || isSelectRange(state, node)) {
          decorations.push(linkDecoration.range(node.from, node.to));
          setSubNodeHideDecorations(node.node, decorations, ['LinkTitle'], false, null, (node) => {
            if (node.name === 'LinkTitle') {
              return linkTitleDecoration.range(node.from - 1, node.to);
            }
          });
        } else {
          decorations.push(linkHideDecoration.range(node.from, node.to));
          setSubNodeHideDecorations(
            node.node,
            decorations,
            ['LinkMark', 'URL', 'LinkTitle'],
            false,
            null,
            (node, decoration) => {
              if (node.name === 'LinkTitle') {
                return decoration.range(node.from - 1, node.to);
              }
              return decoration.range(node.from, node.to);
            },
          );
        }
      }
    },
  });
  return Decoration.set(decorations, true);
}

function getLinkUrl(state: EditorState, pos: number): string | undefined {
  let url: string | undefined;
  syntaxTree(state).iterate({
    from: pos,
    to: pos,
    enter(node) {
      if (node.name === 'URL') {
        url = state.doc.sliceString(node.from, node.to);
        return true;
      }
      if (node.name === 'Link') {
        url = findNodeURL(state, node);
        if (url) return true;
      }
    },
  });
  return url;
}

function getLinkIsHidden(state: EditorState, pos: number, view: EditorView): boolean {
  const dom = view.domAtPos(pos);
  if (!dom.node) return false;
  const linkElement = dom.node.parentElement?.closest(`.${linkClass.linkHideFormatting}`);
  if (linkElement) return true;
  return false;
}

export function link(mode: FormattingDisplayMode, config?: LinkConfig): Extension {
  const clickToOpenInSource = config?.clickToOpenInSource ?? 'controlOrCommand';
  const clickToOpenInPreview = config?.clickToOpenInPreview ?? 'controlOrCommand';
  const isNeedOpenSource = clickToOpenInSource !== 'none';
  const isNeedOpenPreview = clickToOpenInPreview !== 'none';
  const isCtrlClickSource = clickToOpenInSource === 'controlOrCommand';
  const isCtrlClickPreview = clickToOpenInPreview === 'controlOrCommand';
  const isDesktop = deviceIsDesktop();
  const isNeedEventHandler =
    isNeedOpenSource ||
    isNeedOpenPreview ||
    config?.onLinkClickPreview != null ||
    config?.onLinkClickSource != null;

  const hoverMap: Map<Element, boolean> = new Map();
  const clearHover = () => {
    if (hoverMap.size > 0) {
      for (const [e] of hoverMap) {
        e.classList.remove(linkClass.linkHover);
      }
      hoverMap.clear();
    }
  };
  const addHoverClass = (element: Element) => {
    const classList = element.classList;
    if (!classList.contains(linkClass.linkHover)) {
      classList.add(linkClass.linkHover);
    }
  };
  const removeHoverClass = (element: Element) => {
    const classList = element.classList;
    if (classList.contains(linkClass.linkHover)) {
      classList.remove(linkClass.linkHover);
    }
  };
  const updateHover = (isCtrlPressed: boolean) => {
    if (hoverMap.size > 0) {
      for (const [e, isHide] of hoverMap) {
        const clickConfig = isHide ? clickToOpenInPreview : clickToOpenInSource;
        if (clickConfig === 'click') {
          addHoverClass(e);
        } else {
          if (isCtrlPressed) {
            addHoverClass(e);
          } else {
            removeHoverClass(e);
          }
        }
      }
    }
  };

  const eventIsLink = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (!target) return false;
    if (
      target.closest(`.${linkClass.linkURL}`) ||
      target.closest(`.${linkClass.linkFormatting}`) ||
      target.closest(`.${linkClass.linkHideFormatting}`)
    ) {
      return true;
    }
    return false;
  };

  const getLinkElement = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (!target) return null;
    let element: HTMLElement | null = null;
    element = target.closest(`.${linkClass.linkFormatting}`);
    if (element) {
      return {
        isHide: false,
        element,
      };
    }
    element = target.closest(`.${linkClass.linkHideFormatting}`);
    if (element) {
      return {
        isHide: true,
        element,
      };
    }
    return null;
  };

  const linkPlugin = StateField.define<DecorationSet>({
    create(state) {
      return updateLinkDecorations(mode, config, state);
    },

    update(deco, tr) {
      if (tr.docChanged || tr.selection || isFocusEvent(tr)) {
        return updateLinkDecorations(mode, config, tr.state);
      }
      return deco.map(tr.changes);
    },

    provide: (f) => [EditorView.decorations.from(f)],
  });

  const eventHandler = EditorView.domEventHandlers({
    mousedown: (event, view) => {
      if (!isNeedEventHandler) return;
      if (eventIsLink(event)) {
        const pos = view.posAtCoords({ x: event.clientX, y: event.clientY });
        if (pos === null) return;

        const url = getLinkUrl(view.state, pos);
        if (!url) return;

        const isHidden = getLinkIsHidden(view.state, pos, view);
        if (isHidden) {
          // Preview mode
          if (config?.onLinkClickPreview) {
            config.onLinkClickPreview(url, event);
          } else {
            if (isNeedOpenPreview) {
              if (!isCtrlClickPreview || (isCtrlClickPreview && (event.ctrlKey || event.metaKey))) {
                window.open(url, '_blank');
              }
            }
          }
        } else {
          // Source mode
          if (config?.onLinkClickSource) {
            config.onLinkClickSource(url, event);
          } else {
            if (isNeedOpenSource) {
              if (!isCtrlClickSource || (isCtrlClickSource && (event.ctrlKey || event.metaKey))) {
                window.open(url, '_blank');
              }
            }
          }
        }
      }
    },
    mousemove: (event) => {
      if (!isDesktop || !isNeedEventHandler) return;
      if (!isNeedOpenSource && !isNeedOpenSource) return;
      const isCtrlPressed = event.ctrlKey || event.metaKey;
      const link = getLinkElement(event);
      if (link != null) {
        if (!hoverMap.has(link.element)) {
          clearHover();
          hoverMap.set(link.element, link.isHide);
          updateHover(isCtrlPressed);
        }
      } else {
        clearHover();
      }
    },
    mouseleave: () => {
      if (!isDesktop || !isNeedEventHandler) return;
      if (!isNeedOpenSource && !isNeedOpenSource) return;
      clearHover();
    },
    keydown: (event) => {
      if (!isDesktop || !isNeedEventHandler) return;
      if (!isNeedOpenSource && !isNeedOpenSource) return;
      if (event.key === 'Control' || event.key === 'Meta') {
        updateHover(true);
      }
    },
    keyup: (event) => {
      if (!isDesktop || !isNeedEventHandler) return;
      if (!isNeedOpenSource && !isNeedOpenSource) return;
      if (event.key === 'Control' || event.key === 'Meta') {
        updateHover(false);
      }
    },
  });

  return [linkPlugin, eventHandler];
}

export interface LinkConfig {
  /** Click Open in source mode @default 'controlOrCommand'  */
  clickToOpenInSource?: 'controlOrCommand' | 'click' | 'none';
  /** Click Open in preview mode @default 'controlOrCommand' */
  clickToOpenInPreview?: 'controlOrCommand' | 'click' | 'none';
  onLinkClickSource?: (url: string, event: MouseEvent) => void;
  onLinkClickPreview?: (url: string, event: MouseEvent) => void;
}
