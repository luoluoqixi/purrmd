import { syntaxTree } from '@codemirror/language';
import { EditorState, Extension, type Range, StateField } from '@codemirror/state';
import { Decoration, DecorationSet, EditorView } from '@codemirror/view';

import { isFocusEvent } from '../state';
import { FormattingDisplayMode } from '../types';
import { isSelectRange, setSubNodeHideDecorations } from '../utils';

function updateHighlightDecorations(
  mode: FormattingDisplayMode,
  config: HighlightConfig | undefined,
  state: EditorState,
): DecorationSet {
  const decorations: Range<Decoration>[] = [];
  syntaxTree(state).iterate({
    enter(node) {
      if (mode === 'show' || isSelectRange(state, node)) return;
      if (node.type.name === 'Highlight') {
        setSubNodeHideDecorations(node.node, decorations, 'HighlightMark', false);
      }
    },
  });
  return Decoration.set(decorations, true);
}

export function highlight(mode: FormattingDisplayMode, config?: HighlightConfig): Extension {
  const highlightPlugin = StateField.define<DecorationSet>({
    create(state) {
      return updateHighlightDecorations(mode, config, state);
    },

    update(deco, tr) {
      if (tr.docChanged || tr.selection || isFocusEvent(tr)) {
        return updateHighlightDecorations(mode, config, tr.state);
      }
      return deco.map(tr.changes);
    },

    provide: (f) => [EditorView.decorations.from(f)],
  });
  return highlightPlugin;
}

export interface HighlightConfig {}
