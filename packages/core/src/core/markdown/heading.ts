import { syntaxTree } from '@codemirror/language';
import { EditorState, Extension, type Range } from '@codemirror/state';
import { StateField } from '@codemirror/state';
import { Decoration, DecorationSet, EditorView } from '@codemirror/view';

import { hiddenInlineDecoration } from '../common/decorations';
import { isSelectRange } from '../utils';

function updateHeadingDecorations(state: EditorState): DecorationSet {
  const decorations: Range<Decoration>[] = [];
  syntaxTree(state).iterate({
    enter(node) {
      if (isSelectRange(state, node)) {
        return;
      }
      if (node.type.name.startsWith('ATXHeading')) {
        const header = node.node.firstChild;
        if (header) {
          const decoration = hiddenInlineDecoration.range(
            header.from,
            Math.min(header.to + 1, node.to),
          );
          decorations.push(decoration);
        }
      }
    },
  });
  return Decoration.set(decorations, true);
}

const headingPlugin = StateField.define<DecorationSet>({
  create(state) {
    return updateHeadingDecorations(state);
  },

  update(deco, tr) {
    if (tr.docChanged || tr.selection) {
      return updateHeadingDecorations(tr.state);
    }
    return deco.map(tr.changes);
  },

  provide: (f) => [EditorView.decorations.from(f)],
});

export function heading(): Extension {
  return headingPlugin;
}
