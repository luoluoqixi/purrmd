import { syntaxTree } from '@codemirror/language';
import { EditorState, Extension, type Range } from '@codemirror/state';
import { StateField } from '@codemirror/state';
import { Decoration, DecorationSet, EditorView } from '@codemirror/view';

import { isInsideFencedCode, isSelectRange, setSubNodeHideDecorations } from '../utils';

export const inlineCodeClass = {
  inlineCode: 'purrmd-cm-inline-code',
  inlineCodeFormatting: 'purrmd-cm-inline-code-mark',
};

const inlineCodeDecoration = Decoration.mark({ class: inlineCodeClass.inlineCode });

const inlineCodeMarkDecoration = Decoration.mark({ class: inlineCodeClass.inlineCodeFormatting });

function updateInlineCodeDecorations(state: EditorState): DecorationSet {
  const decorations: Range<Decoration>[] = [];
  syntaxTree(state).iterate({
    enter(node) {
      if (node.type.name === 'InlineCode') {
        if (!isInsideFencedCode(state, node.from)) {
          decorations.push(inlineCodeDecoration.range(node.from, node.to));
          if (!isSelectRange(state, node)) {
            setSubNodeHideDecorations(node.node, decorations, 'CodeMark', false);
          } else {
            setSubNodeHideDecorations(
              node.node,
              decorations,
              'CodeMark',
              false,
              inlineCodeMarkDecoration,
            );
          }
        }
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function inlineCode(config?: InlineCodeConfig): Extension {
  return inlineCodePlugin;
}

export interface InlineCodeConfig {}
