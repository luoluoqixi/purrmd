import { syntaxTree } from '@codemirror/language';
import { EditorState, Extension, type Range, RangeSetBuilder } from '@codemirror/state';
import { StateField } from '@codemirror/state';
import {
  Decoration,
  DecorationSet,
  EditorView,
  ViewPlugin,
  ViewUpdate,
  WidgetType,
} from '@codemirror/view';

import { isSelectRange, setSubNodeHideDecorations, syntaxTreeInVisible } from '../utils';

function updateFencedCodeHiddenDecorations(state: EditorState): DecorationSet {
  const decorations: Range<Decoration>[] = [];
  syntaxTree(state).iterate({
    enter(node) {
      if (isSelectRange(state, node)) return;
      if (node.type.name === 'FencedCode') {
        setSubNodeHideDecorations(node.node, decorations, ['CodeMark', 'CodeInfo'], false);
      }
    },
  });
  return Decoration.set(decorations, true);
}

const fencedCodeHiddenPlugin = StateField.define<DecorationSet>({
  create(state) {
    return updateFencedCodeHiddenDecorations(state);
  },

  update(deco, tr) {
    if (tr.docChanged || tr.selection) {
      return updateFencedCodeHiddenDecorations(tr.state);
    }
    return deco.map(tr.changes);
  },

  provide: (f) => [EditorView.decorations.from(f)],
});

function decorateFencedCode(view: EditorView) {
  const builder = new RangeSetBuilder<Decoration>();
  const visited = new Set<string>();

  syntaxTreeInVisible(view, {
    enter: ({ type, from, to, node }) => {
      if (type.name !== 'FencedCode') return;

      const key = `${from},${to}`;
      if (visited.has(key)) return;
      visited.add(key);

      // 提取语言信息
      const codeInfoNode = node.getChild('CodeInfo');
      const lang = codeInfoNode
        ? view.state.doc.sliceString(codeInfoNode.from, codeInfoNode.to).trim()
        : '';

      let pos = from;
      while (pos <= to) {
        const line = view.state.doc.lineAt(pos);
        const isFirstLine = line.from === from;
        const isLastLine = line.to >= to;

        // 添加 line 类名装饰
        builder.add(
          line.from,
          line.from,
          Decoration.line({
            class:
              `purrmd-code-line ${isFirstLine ? 'purrmd-code-line-first' : ''} ${isLastLine ? 'purrmd-code-line-last' : ''}`.trim(),
          }),
        );

        // 添加首行 widget
        if (isFirstLine) {
          builder.add(
            line.from,
            line.from,
            Decoration.widget({
              widget: new CodeBlockInfoWidget(lang),
              side: -1, // 添加在行前
            }),
          );
        }

        pos = line.to + 1;
      }
    },
  });

  return builder.finish();
}

class CodeBlockInfoWidget extends WidgetType {
  constructor(readonly lang: string) {
    super();
  }
  toDOM() {
    const dom = document.createElement('div');
    dom.className = 'purrmd-codeblock-widget';
    dom.textContent = this.lang;
    return dom;
  }
}

const fencedCodeExtension: Extension = ViewPlugin.fromClass(
  class {
    decorations: DecorationSet;
    constructor(view: EditorView) {
      this.decorations = decorateFencedCode(view);
    }
    update(update: ViewUpdate) {
      if (update.docChanged || update.viewportChanged || update.selectionSet)
        this.decorations = decorateFencedCode(update.view);
    }
  },
  { decorations: (v) => v.decorations },
);

export function fencedCode(): Extension {
  return [fencedCodeHiddenPlugin, fencedCodeExtension];
}
