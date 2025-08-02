import { syntaxTree } from '@codemirror/language';
import { EditorState, Extension, type Range } from '@codemirror/state';
import { StateField } from '@codemirror/state';
import { Decoration, DecorationSet, EditorView } from '@codemirror/view';

import { FormattingDisplayMode } from '../types';
import { setSubNodeHideDecorationsLine } from '../utils';

export const blockquoteClass = {
  blockquote: 'purrmd-cm-blockquote',
  blockquoteFormatting: 'purrmd-cm-formatting-blockquote',
  blockquoteHideFormatting: 'purrmd-cm-formatting-blockquote-hide',
};

const blockquoteDecoration = Decoration.mark({ class: blockquoteClass.blockquote });
const blockquoteHideMarkDecoration = Decoration.mark({
  class: blockquoteClass.blockquoteHideFormatting,
});

function updateBlockquoteDecorations(
  mode: FormattingDisplayMode,
  config: BlockquoteConfig | undefined,
  state: EditorState,
): DecorationSet {
  const decorations: Range<Decoration>[] = [];
  syntaxTree(state).iterate({
    enter(node) {
      if (node.type.name === 'Blockquote') {
        decorations.push(blockquoteDecoration.range(node.from, node.to));
        if (mode !== 'show') {
          setSubNodeHideDecorationsLine(
            state,
            node.node,
            decorations,
            'QuoteMark',
            false,
            blockquoteHideMarkDecoration,
          );
        }
      }
    },
  });
  return Decoration.set(decorations, true);
}

export function blockquote(mode: FormattingDisplayMode, config?: BlockquoteConfig): Extension {
  const blockquotePlugin = StateField.define<DecorationSet>({
    create(state) {
      return updateBlockquoteDecorations(mode, config, state);
    },

    update(deco, tr) {
      if (tr.docChanged || tr.selection) {
        return updateBlockquoteDecorations(mode, config, tr.state);
      }
      return deco.map(tr.changes);
    },

    provide: (f) => [EditorView.decorations.from(f)],
  });
  return blockquotePlugin;
}

export interface BlockquoteConfig {}
