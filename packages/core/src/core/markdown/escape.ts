import { syntaxTree } from '@codemirror/language';
import { EditorState, Extension, type Range } from '@codemirror/state';
import { StateField } from '@codemirror/state';
import { Decoration, DecorationSet, EditorView } from '@codemirror/view';

import { isFocusEvent, isForceUpdateEvent } from '../state';
import { FormattingDisplayMode } from '../types';
import { isSelectRange, setSubNodeHideDecorations } from '../utils';

function updateEscapeDecorations(
  mode: FormattingDisplayMode,
  config: EscapeConfig | undefined,
  state: EditorState,
): DecorationSet {
  const decorations: Range<Decoration>[] = [];
  syntaxTree(state).iterate({
    enter(node) {
      if (node.type.name === 'Escape') {
        if (mode === 'show' || isSelectRange(state, node)) {
          // 显示转义符反斜杠
        } else {
          // 隐藏转义符反斜杠
          setSubNodeHideDecorations(node.node, decorations, 'EscapeMark', false);
        }
      }
    },
  });
  return Decoration.set(decorations, true);
}

export function escape(mode: FormattingDisplayMode, config?: EscapeConfig): Extension {
  const escapePlugin = StateField.define<DecorationSet>({
    create(state) {
      return updateEscapeDecorations(mode, config, state);
    },

    update(deco, tr) {
      if (tr.docChanged || tr.selection || isFocusEvent(tr) || isForceUpdateEvent(tr)) {
        return updateEscapeDecorations(mode, config, tr.state);
      }
      return deco.map(tr.changes);
    },

    provide: (f) => [EditorView.decorations.from(f)],
  });
  return escapePlugin;
}

export interface EscapeConfig {}
