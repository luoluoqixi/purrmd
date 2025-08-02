import { syntaxTree } from '@codemirror/language';
import { EditorState, Extension, type Range } from '@codemirror/state';
import { StateField } from '@codemirror/state';
import { Decoration, DecorationSet, EditorView } from '@codemirror/view';

import { isSelectRange, setSubNodeHideDecorations } from '../utils';

function updateEmphasisDecorations(state: EditorState): DecorationSet {
  const decorations: Range<Decoration>[] = [];
  syntaxTree(state).iterate({
    enter(node) {
      if (isSelectRange(state, node)) return;
      if (node.type.name === 'Emphasis') {
        setSubNodeHideDecorations(node.node, decorations, 'EmphasisMark', false);
      }
    },
  });
  return Decoration.set(decorations, true);
}

const emphasisPlugin = StateField.define<DecorationSet>({
  create(state) {
    return updateEmphasisDecorations(state);
  },

  update(deco, tr) {
    if (tr.docChanged || tr.selection) {
      return updateEmphasisDecorations(tr.state);
    }
    return deco.map(tr.changes);
  },

  provide: (f) => [EditorView.decorations.from(f)],
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function emphasis(config?: EmphasisConfig): Extension {
  return emphasisPlugin;
}

export interface EmphasisConfig {}
