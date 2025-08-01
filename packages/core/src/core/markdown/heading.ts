import { syntaxTree } from '@codemirror/language';
import { EditorState, Extension, type Range } from '@codemirror/state';
import { StateField } from '@codemirror/state';
import { Decoration, DecorationSet, EditorView } from '@codemirror/view';

import { hiddenInlineDecoration } from '../common/decorations';
import { isSelectRange, setSubNodeDecorations } from '../utils';

export const headingFormattingClass = 'purrmd-cm-formatting-heading';

const headingDecoration = Decoration.mark({ class: headingFormattingClass });

function updateHeadingDecorations(state: EditorState): DecorationSet {
  const decorations: Range<Decoration>[] = [];
  syntaxTree(state).iterate({
    enter(node) {
      if (node.type.name.startsWith('ATXHeading')) {
        const isSelect = isSelectRange(state, node);
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
        setSubNodeDecorations(state, node.node, decorations, 'HeaderMark', headingDecoration, true);
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
