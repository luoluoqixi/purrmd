import { syntaxTree } from '@codemirror/language';
import { EditorState, Extension, type Range } from '@codemirror/state';
import { StateField } from '@codemirror/state';
import { Decoration, DecorationSet, EditorView } from '@codemirror/view';

import { isFocusEvent, isForceUpdateEvent } from '../state';
import { FormattingDisplayMode } from '../types';
import { isSelectRange, setSubNodeHideDecorations } from '../utils';

function updateStrikeThroughDecorations(
  mode: FormattingDisplayMode,
  config: StrikethroughConfig | undefined,
  state: EditorState,
): DecorationSet {
  const decorations: Range<Decoration>[] = [];
  syntaxTree(state).iterate({
    enter(node) {
      if (mode === 'show' || isSelectRange(state, node)) return;
      if (node.type.name === 'Strikethrough') {
        setSubNodeHideDecorations(node.node, decorations, 'StrikethroughMark', false);
      }
    },
  });
  return Decoration.set(decorations, true);
}

export function strikethrough(
  mode: FormattingDisplayMode,
  config?: StrikethroughConfig,
): Extension {
  const strikethroughPlugin = StateField.define<DecorationSet>({
    create(state) {
      return updateStrikeThroughDecorations(mode, config, state);
    },

    update(deco, tr) {
      if (tr.docChanged || tr.selection || isFocusEvent(tr) || isForceUpdateEvent(tr)) {
        return updateStrikeThroughDecorations(mode, config, tr.state);
      }
      return deco.map(tr.changes);
    },

    provide: (f) => [EditorView.decorations.from(f)],
  });
  return strikethroughPlugin;
}

export interface StrikethroughConfig {}
