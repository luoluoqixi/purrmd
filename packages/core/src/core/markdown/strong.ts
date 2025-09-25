import { syntaxTree } from '@codemirror/language';
import { EditorState, Extension, type Range } from '@codemirror/state';
import { StateField } from '@codemirror/state';
import { Decoration, DecorationSet, EditorView } from '@codemirror/view';

import { isFocusEvent, isForceUpdateEvent } from '../state';
import { FormattingDisplayMode } from '../types';
import { isSelectRange, setSubNodeHideDecorations } from '../utils';

function updateStrongDecorations(
  mode: FormattingDisplayMode,
  config: StrongConfig | undefined,
  state: EditorState,
): DecorationSet {
  const decorations: Range<Decoration>[] = [];
  syntaxTree(state).iterate({
    enter(node) {
      if (mode === 'show' || isSelectRange(state, node)) return;
      if (node.type.name === 'StrongEmphasis') {
        setSubNodeHideDecorations(node.node, decorations, 'EmphasisMark', false);
      }
    },
  });
  return Decoration.set(decorations, true);
}

export function strong(mode: FormattingDisplayMode, config?: StrongConfig): Extension {
  const strongPlugin = StateField.define<DecorationSet>({
    create(state) {
      return updateStrongDecorations(mode, config, state);
    },

    update(deco, tr) {
      if (tr.docChanged || tr.selection || isFocusEvent(tr) || isForceUpdateEvent(tr)) {
        return updateStrongDecorations(mode, config, tr.state);
      }
      return deco.map(tr.changes);
    },

    provide: (f) => [EditorView.decorations.from(f)],
  });
  return strongPlugin;
}

export interface StrongConfig {}
