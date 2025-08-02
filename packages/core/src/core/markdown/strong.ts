import { syntaxTree } from '@codemirror/language';
import { EditorState, Extension, type Range } from '@codemirror/state';
import { StateField } from '@codemirror/state';
import { Decoration, DecorationSet, EditorView } from '@codemirror/view';

import { isSelectRange, setSubNodeHideDecorations } from '../utils';

function updateStrongDecorations(state: EditorState): DecorationSet {
  const decorations: Range<Decoration>[] = [];
  syntaxTree(state).iterate({
    enter(node) {
      if (isSelectRange(state, node)) return;
      if (node.type.name === 'StrongEmphasis') {
        setSubNodeHideDecorations(node.node, decorations, 'EmphasisMark', false);
      }
    },
  });
  return Decoration.set(decorations, true);
}

const strongPlugin = StateField.define<DecorationSet>({
  create(state) {
    return updateStrongDecorations(state);
  },

  update(deco, tr) {
    if (tr.docChanged || tr.selection) {
      return updateStrongDecorations(tr.state);
    }
    return deco.map(tr.changes);
  },

  provide: (f) => [EditorView.decorations.from(f)],
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function strong(config?: StrongConfig): Extension {
  return strongPlugin;
}

export interface StrongConfig {}
