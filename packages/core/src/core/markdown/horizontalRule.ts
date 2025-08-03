import { syntaxTree } from '@codemirror/language';
import { EditorState, Extension, type Range, StateField } from '@codemirror/state';
import { Decoration, DecorationSet, EditorView, WidgetType } from '@codemirror/view';

import { FormattingDisplayMode } from '../types';
import { isSelectRange } from '../utils';

export const horizontalRuleClass = {
  horizontalRule: 'purrmd-cm-horizontal-rule',
  horizontalRuleFormatting: 'purrmd-cm-formatting-horizontal-rule',
};

class HorizontalRuleWidget extends WidgetType {
  toDOM() {
    const div = document.createElement('div');
    div.className = `cm-line ${horizontalRuleClass.horizontalRule}`;
    const hr = document.createElement('hr');
    div.appendChild(hr);
    return div;
  }
  ignoreEvent() {
    return false;
  }
  destroy(dom: HTMLElement): void {
    dom.remove();
  }
}

function updateHorizontalRuleDecorations(
  mode: FormattingDisplayMode,
  config: HorizontalRuleConfig | undefined,
  state: EditorState,
): DecorationSet {
  const decorations: Range<Decoration>[] = [];
  syntaxTree(state).iterate({
    enter(node) {
      if (mode === 'show' || isSelectRange(state, node)) return;
      if (node.type.name === 'HorizontalRule') {
        const decoration = Decoration.replace({
          widget: new HorizontalRuleWidget(),
          block: false,
        }).range(node.from, node.to);
        decorations.push(decoration);
      }
    },
  });
  return Decoration.set(decorations, true);
}

export function horizontalRule(
  mode: FormattingDisplayMode,
  config?: HorizontalRuleConfig,
): Extension {
  const horizontalRulePlugin = StateField.define<DecorationSet>({
    create(state) {
      return updateHorizontalRuleDecorations(mode, config, state);
    },

    update(deco, tr) {
      if (tr.docChanged || tr.selection) {
        return updateHorizontalRuleDecorations(mode, config, tr.state);
      }
      return deco.map(tr.changes);
    },

    provide: (f) => [EditorView.decorations.from(f)],
  });
  return horizontalRulePlugin;
}

export interface HorizontalRuleConfig {}
