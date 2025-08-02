import { syntaxTree } from '@codemirror/language';
import { EditorState, Extension, type Range } from '@codemirror/state';
import { StateField } from '@codemirror/state';
import { Decoration, DecorationSet, EditorView } from '@codemirror/view';

import { isSelectRange, setSubNodeHideDecorations } from '../utils';

function updateStrikeThroughDecorations(state: EditorState): DecorationSet {
  const decorations: Range<Decoration>[] = [];
  syntaxTree(state).iterate({
    enter(node) {
      if (isSelectRange(state, node)) return;
      if (node.type.name === 'Strikethrough') {
        setSubNodeHideDecorations(node.node, decorations, 'StrikethroughMark', false);
      }
    },
  });
  return Decoration.set(decorations, true);
}

const strikethroughPlugin = StateField.define<DecorationSet>({
  create(state) {
    return updateStrikeThroughDecorations(state);
  },

  update(deco, tr) {
    if (tr.docChanged || tr.selection) {
      return updateStrikeThroughDecorations(tr.state);
    }
    return deco.map(tr.changes);
  },

  provide: (f) => [EditorView.decorations.from(f)],
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function strikethrough(config?: StrikethroughConfig): Extension {
  return strikethroughPlugin;
}

export interface StrikethroughConfig {}
