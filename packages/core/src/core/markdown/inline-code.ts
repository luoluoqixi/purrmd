import { syntaxTree } from '@codemirror/language';
import { EditorState, Extension, type Range } from '@codemirror/state';
import { StateField } from '@codemirror/state';
import { Decoration, DecorationSet, EditorView } from '@codemirror/view';

import { FormattingDisplayMode } from '../types';
import { isInsideFencedCode, isSelectRange, setSubNodeHideDecorations } from '../utils';

export const inlineCodeClass = {
  inlineCode: 'purrmd-cm-inline-code',
  inlineCodeFormatting: 'purrmd-cm-inline-code-mark',
};

const inlineCodeDecoration = Decoration.mark({ class: inlineCodeClass.inlineCode });

const inlineCodeMarkDecoration = Decoration.mark({ class: inlineCodeClass.inlineCodeFormatting });

function updateInlineCodeDecorations(
  mode: FormattingDisplayMode,
  config: InlineCodeConfig | undefined,
  state: EditorState,
): DecorationSet {
  const decorations: Range<Decoration>[] = [];
  syntaxTree(state).iterate({
    enter(node) {
      if (node.type.name === 'InlineCode') {
        if (!isInsideFencedCode(state, node.from)) {
          decorations.push(inlineCodeDecoration.range(node.from, node.to));
          if (mode === 'show' || isSelectRange(state, node)) {
            setSubNodeHideDecorations(
              node.node,
              decorations,
              'CodeMark',
              false,
              inlineCodeMarkDecoration,
            );
          } else {
            setSubNodeHideDecorations(node.node, decorations, 'CodeMark', false);
          }
        }
      }
    },
  });
  return Decoration.set(decorations, true);
}

export function inlineCode(mode: FormattingDisplayMode, config?: InlineCodeConfig): Extension {
  const inlineCodePlugin = StateField.define<DecorationSet>({
    create(state) {
      return updateInlineCodeDecorations(mode, config, state);
    },

    update(deco, tr) {
      if (tr.docChanged || tr.selection) {
        return updateInlineCodeDecorations(mode, config, tr.state);
      }
      return deco.map(tr.changes);
    },

    provide: (f) => [EditorView.decorations.from(f)],
  });
  return inlineCodePlugin;
}

export interface InlineCodeConfig {}
