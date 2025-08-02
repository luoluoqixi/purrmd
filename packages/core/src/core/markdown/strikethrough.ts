import { syntaxTree } from '@codemirror/language';
import { EditorState, Extension, type Range } from '@codemirror/state';
import { StateField } from '@codemirror/state';
import { Decoration, DecorationSet, EditorView } from '@codemirror/view';

import { setSubNodeDecorations } from '../utils';

export const strikethroughFormattingClass = 'purrmd-cm-formatting-strikethrough';

const strikethroughDecoration = Decoration.mark({ class: strikethroughFormattingClass });

function updateStrikeThroughDecorations(state: EditorState): DecorationSet {
  const decorations: Range<Decoration>[] = [];
  syntaxTree(state).iterate({
    enter(node) {
      if (node.type.name === 'Strikethrough') {
        setSubNodeDecorations(
          state,
          node.node,
          decorations,
          'StrikethroughMark',
          strikethroughDecoration,
          false,
        );
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

export function strikethrough(): Extension {
  return strikethroughPlugin;
}
