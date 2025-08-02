import { syntaxTree } from '@codemirror/language';
import { EditorState, Extension, type Range } from '@codemirror/state';
import { StateField } from '@codemirror/state';
import { Decoration, DecorationSet, EditorView } from '@codemirror/view';

import { hiddenInlineDecoration } from '../common/decorations';
import { isSelectRange, setSubNodeHideDecorations } from '../utils';

function updateHeadingDecorations(state: EditorState): DecorationSet {
  const decorations: Range<Decoration>[] = [];
  syntaxTree(state).iterate({
    enter(node) {
      if (isSelectRange(state, node)) return;
      if (node.type.name.startsWith('ATXHeading')) {
        const header = node.node.firstChild;
        if (header) {
          const from = header.from;
          const to = Math.min(header.to + 1, node.to);
          const decoration = hiddenInlineDecoration.range(from, to);
          decorations.push(decoration);
        }
      } else if (node.type.name.startsWith('SetextHeading')) {
        setSubNodeHideDecorations(node.node, decorations, 'HeaderMark', true);
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function heading(config?: HeadingConfig): Extension {
  return headingPlugin;
}

export interface HeadingConfig {}
