import { syntaxTree } from '@codemirror/language';
import { EditorState, Extension, type Range } from '@codemirror/state';
import { StateField } from '@codemirror/state';
import { Decoration, DecorationSet, EditorView } from '@codemirror/view';

import { isSelectRange, setSubNodeHideDecorations } from '../utils';

function updateInlineCodeDecorations(state: EditorState): DecorationSet {
  const decorations: Range<Decoration>[] = [];
  syntaxTree(state).iterate({
    enter(node) {
      if (isSelectRange(state, node)) return;
      if (node.type.name === 'InlineCode') {
        setSubNodeHideDecorations(node.node, decorations, 'CodeMark', false);
      }
    },
  });
  return Decoration.set(decorations, true);
}

const inlineCodePlugin = StateField.define<DecorationSet>({
  create(state) {
    return updateInlineCodeDecorations(state);
  },

  update(deco, tr) {
    if (tr.docChanged || tr.selection) {
      return updateInlineCodeDecorations(tr.state);
    }
    return deco.map(tr.changes);
  },

  provide: (f) => [EditorView.decorations.from(f)],
});

export function inlineCode(): Extension {
  return inlineCodePlugin;
}
