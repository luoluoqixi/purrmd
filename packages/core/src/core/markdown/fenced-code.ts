import { syntaxTree } from '@codemirror/language';
import { EditorState, Extension, type Range } from '@codemirror/state';
import { StateField } from '@codemirror/state';
import { Decoration, DecorationSet, EditorView } from '@codemirror/view';

import { isSelectRange, setSubNodeHideDecorations } from '../utils';

function updateFencedCodeDecorations(state: EditorState): DecorationSet {
  const decorations: Range<Decoration>[] = [];
  syntaxTree(state).iterate({
    enter(node) {
      if (isSelectRange(state, node)) return;
      if (node.type.name === 'FencedCode') {
        setSubNodeHideDecorations(node.node, decorations, ['CodeMark', 'CodeInfo'], false);
      }
    },
  });
  return Decoration.set(decorations, true);
}

const fencedCodePlugin = StateField.define<DecorationSet>({
  create(state) {
    return updateFencedCodeDecorations(state);
  },

  update(deco, tr) {
    if (tr.docChanged || tr.selection) {
      return updateFencedCodeDecorations(tr.state);
    }
    return deco.map(tr.changes);
  },

  provide: (f) => [EditorView.decorations.from(f)],
});

export function fencedCode(): Extension {
  return fencedCodePlugin;
}
