import { syntaxTree } from '@codemirror/language';
import { EditorState, Extension, type Range, StateField } from '@codemirror/state';
import { Decoration, DecorationSet, EditorView } from '@codemirror/view';
import { SyntaxNodeRef } from '@lezer/common';

import { isFocusEvent, isForceUpdateEvent } from '../state';
import { FormattingDisplayMode } from '../types';
import { findNodeFromLine, isSelectRange, selectRange } from '../utils';

export const horizontalRuleClass = {
  horizontalRule: 'purrmd-cm-horizontal-rule',
  horizontalRuleFormatting: 'purrmd-cm-formatting-horizontal-rule',
  contentSeparator: 'purrmd-cm-content-separator',
};

function updateHorizontalRuleDecorations(
  mode: FormattingDisplayMode,
  config: HorizontalRuleConfig | undefined,
  state: EditorState,
): DecorationSet {
  const decorations: Range<Decoration>[] = [];
  syntaxTree(state).iterate({
    enter(node) {
      if (node.type.name === 'HorizontalRule') {
        if (mode === 'show' || isSelectRange(state, node)) {
          const decoration = Decoration.mark({
            class: horizontalRuleClass.horizontalRuleFormatting,
          }).range(node.from, node.to);
          decorations.push(decoration);
        } else {
          const decoration = Decoration.mark({
            class: horizontalRuleClass.horizontalRule,
          }).range(node.from, node.to);
          decorations.push(decoration);
        }
      }
    },
  });
  return Decoration.set(decorations, true);
}

export function horizontalRule(
  mode: FormattingDisplayMode,
  config?: HorizontalRuleConfig,
): Extension {
  const horizontalRulePlugin = StateField.define<DecorationSet>({
    create(state) {
      return updateHorizontalRuleDecorations(mode, config, state);
    },

    update(deco, tr) {
      if (tr.docChanged || tr.selection || isFocusEvent(tr) || isForceUpdateEvent(tr)) {
        return updateHorizontalRuleDecorations(mode, config, tr.state);
      }
      return deco.map(tr.changes);
    },

    provide: (f) => [EditorView.decorations.from(f)],
  });
  const clickHandler = EditorView.domEventHandlers({
    mousedown: (event: MouseEvent, view: EditorView) => {
      const target = event.target as HTMLElement;
      const hrElement = target.closest(`.${horizontalRuleClass.horizontalRule}`);
      if (hrElement) {
        const pos = view.posAtDOM(hrElement);
        if (pos === null) return;
        const line = view.state.doc.lineAt(pos);
        const foundNode = findNodeFromLine(view.state, line, 'HorizontalRule');
        if (foundNode) {
          const from = foundNode.from;
          const to = foundNode.to;
          selectRange(view, { from, to });
          if (config?.onClick) {
            config.onClick(event, view, foundNode);
          }
        }
      }
    },
  });
  return [horizontalRulePlugin, clickHandler];
}

export interface HorizontalRuleConfig {
  onClick?: (event: MouseEvent, view: EditorView, node: SyntaxNodeRef) => void;
}
