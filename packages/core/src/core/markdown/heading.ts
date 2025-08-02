import { syntaxTree } from '@codemirror/language';
import { EditorState, Extension, type Range } from '@codemirror/state';
import { StateField } from '@codemirror/state';
import { Decoration, DecorationSet, EditorView } from '@codemirror/view';

import { hiddenInlineDecoration } from '../common/decorations';
import { FormattingDisplayMode } from '../types';
import { isSelectRange, setSubNodeHideDecorations } from '../utils';

function updateHeadingDecorations(
  mode: FormattingDisplayMode,
  config: HeadingConfig | undefined,
  state: EditorState,
): DecorationSet {
  const decorations: Range<Decoration>[] = [];
  syntaxTree(state).iterate({
    enter(node) {
      if (mode === 'show' || isSelectRange(state, node)) {
        return;
      }
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

export function heading(mode: FormattingDisplayMode, config?: HeadingConfig): Extension {
  const headingPlugin = StateField.define<DecorationSet>({
    create(state) {
      return updateHeadingDecorations(mode, config, state);
    },

    update(deco, tr) {
      if (tr.docChanged || tr.selection) {
        return updateHeadingDecorations(mode, config, tr.state);
      }
      return deco.map(tr.changes);
    },

    provide: (f) => [EditorView.decorations.from(f)],
  });
  return headingPlugin;
}

export interface HeadingConfig {}
