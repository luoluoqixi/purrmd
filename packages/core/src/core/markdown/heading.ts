import { syntaxTree } from '@codemirror/language';
import { EditorState, Extension, type Range } from '@codemirror/state';
import { StateField } from '@codemirror/state';
import { Decoration, DecorationSet, EditorView } from '@codemirror/view';

import { hiddenBlockDecoration, hiddenInlineDecoration } from '../common/decorations';
import { isSelectRange } from '../utils';

const headingFormattingClass = 'purrmd-cm-formatting-heading';

const headingDecoration = Decoration.mark({ class: headingFormattingClass });

function updateHeadingDecorations(state: EditorState): DecorationSet {
  const decorations: Range<Decoration>[] = [];
  syntaxTree(state).iterate({
    enter(node) {
      const isSelect = isSelectRange(state, node);
      if (node.type.name.startsWith('ATXHeading')) {
        const header = node.node.firstChild;
        if (header) {
          const from = header.from;
          const to = Math.min(header.to + 1, node.to);
          if (isSelect) {
            const decoration = headingDecoration.range(from, to);
            decorations.push(decoration);
          } else {
            const decoration = hiddenInlineDecoration.range(from, to);
            decorations.push(decoration);
          }
        }
      } else if (node.type.name.startsWith('SetextHeading')) {
        const cursor = node.node.cursor();
        cursor.iterate((node) => {
          if (node.type.name === 'HeaderMark') {
            if (isSelect) {
              decorations.push(headingDecoration.range(node.from, node.to));
            } else {
              decorations.push(hiddenBlockDecoration.range(node.from, node.to));
            }
          }
        });
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
