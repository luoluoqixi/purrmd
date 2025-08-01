import { syntaxTree } from '@codemirror/language';
import { EditorState, Extension, type Range } from '@codemirror/state';
import { StateField } from '@codemirror/state';
import { Decoration, DecorationSet, EditorView } from '@codemirror/view';

import { setSubNodeDecorations } from '../utils';

export const emphasisFormattingClass = 'purrmd-cm-formatting-emphasis';

const emphasisDecoration = Decoration.mark({ class: emphasisFormattingClass });

function updateItalicDecorations(state: EditorState): DecorationSet {
  const decorations: Range<Decoration>[] = [];
  syntaxTree(state).iterate({
    enter(node) {
      if (node.type.name === 'Emphasis') {
        setSubNodeDecorations(
          state,
          node.node,
          decorations,
          'EmphasisMark',
          emphasisDecoration,
          false,
        );
      }
    },
  });
  return Decoration.set(decorations, true);
}

const emphasisPlugin = StateField.define<DecorationSet>({
  create(state) {
    return updateItalicDecorations(state);
  },

  update(deco, tr) {
    if (tr.docChanged || tr.selection) {
      return updateItalicDecorations(tr.state);
    }
    return deco.map(tr.changes);
  },

  provide: (f) => [EditorView.decorations.from(f)],
});

export function emphasis(): Extension {
  return emphasisPlugin;
}
