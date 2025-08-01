import { syntaxTree } from '@codemirror/language';
import { EditorState, Extension, type Range } from '@codemirror/state';
import { StateField } from '@codemirror/state';
import { Decoration, DecorationSet, EditorView } from '@codemirror/view';

import { setSubNodeDecorations } from '../utils';

export const strongFormattingClass = 'purrmd-cm-formatting-strong';

const strongDecoration = Decoration.mark({ class: strongFormattingClass });

function updateStrongDecorations(state: EditorState): DecorationSet {
  const decorations: Range<Decoration>[] = [];
  syntaxTree(state).iterate({
    enter(node) {
      if (node.type.name === 'StrongEmphasis') {
        setSubNodeDecorations(
          state,
          node.node,
          decorations,
          'EmphasisMark',
          strongDecoration,
          false,
        );
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

export function strong(): Extension {
  return strongPlugin;
}
