import { syntaxTree } from '@codemirror/language';
import { EditorState, Extension, type Range } from '@codemirror/state';
import { StateField } from '@codemirror/state';
import { Decoration, DecorationSet, EditorView } from '@codemirror/view';

import { isFocusEvent, isForceUpdateEvent } from '../state';
import { FormattingDisplayMode } from '../types';
import { isSelectRange, setSubNodeHideDecorations } from '../utils';

function updateEmphasisDecorations(
  mode: FormattingDisplayMode,
  config: EmphasisConfig | undefined,
  state: EditorState,
): DecorationSet {
  const decorations: Range<Decoration>[] = [];
  syntaxTree(state).iterate({
    enter(node) {
      if (mode === 'show' || isSelectRange(state, node)) return;
      if (node.type.name === 'Emphasis') {
        setSubNodeHideDecorations(node.node, decorations, 'EmphasisMark', false);
      }
    },
  });
  return Decoration.set(decorations, true);
}

export function emphasis(mode: FormattingDisplayMode, config?: EmphasisConfig): Extension {
  const emphasisPlugin = StateField.define<DecorationSet>({
    create(state) {
      return updateEmphasisDecorations(mode, config, state);
    },

    update(deco, tr) {
      if (tr.docChanged || tr.selection || isFocusEvent(tr) || isForceUpdateEvent(tr)) {
        return updateEmphasisDecorations(mode, config, tr.state);
      }
      return deco.map(tr.changes);
    },

    provide: (f) => [EditorView.decorations.from(f)],
  });
  return emphasisPlugin;
}

export interface EmphasisConfig {}
