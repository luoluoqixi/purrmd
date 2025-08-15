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

import { isFocusEvent } from '../state';
import { FormattingDisplayMode } from '../types';
import { isSelectRange, setSubNodeHideDecorations, syntaxTreeInVisible } from '../utils';

export const codeBlockClass = {
  codeBlockLine: 'purrmd-cm-code-block-line',
  codeBlockFirstLine: 'purrmd-cm-code-block-line-first',
  codeBlockLastLine: 'purrmd-cm-code-block-line-last',
  codeBlockInfo: 'purrmd-cm-code-block-info',
};

function updateCodeBlockHiddenDecorations(
  mode: FormattingDisplayMode,
  config: CodeBlockConfig | undefined,
  state: EditorState,
): DecorationSet {
  const decorations: Range<Decoration>[] = [];
  syntaxTree(state).iterate({
    enter(node) {
      if (mode === 'show' || isSelectRange(state, node)) return;
      if (node.type.name === 'FencedCode') {
        setSubNodeHideDecorations(node.node, decorations, ['CodeMark', 'CodeInfo'], false);
      }
    },
  });
  return Decoration.set(decorations, true);
}

function decorateCodeBlock(config: CodeBlockConfig | undefined, view: EditorView) {
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
              `${codeBlockClass.codeBlockLine} ${isFirstLine ? codeBlockClass.codeBlockFirstLine : ''} ${isLastLine ? codeBlockClass.codeBlockLastLine : ''}`.trim(),
          }),
        );

        // 添加首行 widget
        if (isFirstLine) {
          builder.add(
            line.from,
            line.from,
            Decoration.widget({
              widget: new CodeBlockInfoWidget(
                lang,
                view.state.doc.sliceString(line.to + 1, node.to - 4),
                config?.onCodeBlockInfoClick,
              ),
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
  timeout: number | undefined;
  constructor(
    readonly lang: string,
    readonly code: string,
    readonly onClick?: (lang: string, code: string, event: MouseEvent) => void,
  ) {
    super();
  }
  eq(other: CodeBlockInfoWidget) {
    return other.lang === this.lang && other.code === this.code;
  }
  toDOM() {
    const dom = document.createElement('div');
    dom.className = codeBlockClass.codeBlockInfo;
    dom.innerHTML = this.lang;
    dom.tabIndex = -1;
    dom.onclick = (event) => {
      if (this.onClick) {
        this.onClick(this.lang, this.code, event);
      } else {
        dom.innerHTML = `&#128149;${this.lang}`;
        if (this.timeout) {
          window.clearTimeout(this.timeout);
        }
        this.timeout = window.setTimeout(() => {
          dom.innerHTML = this.lang;
          this.timeout = undefined;
        }, 3000);
        if (window.navigator.clipboard) {
          window.navigator.clipboard.writeText(this.code);
        } else {
          const textarea = document.createElement('textarea');
          textarea.value = this.code;
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand('copy');
          document.body.removeChild(textarea);
        }
        event.stopPropagation();
        event.preventDefault();
      }
    };
    return dom;
  }
}

export function codeBlock(mode: FormattingDisplayMode, config?: CodeBlockConfig): Extension {
  const codeBlockHiddenPlugin = StateField.define<DecorationSet>({
    create(state) {
      return updateCodeBlockHiddenDecorations(mode, config, state);
    },

    update(deco, tr) {
      if (tr.docChanged || tr.selection || isFocusEvent(tr)) {
        return updateCodeBlockHiddenDecorations(mode, config, tr.state);
      }
      return deco.map(tr.changes);
    },

    provide: (f) => [EditorView.decorations.from(f)],
  });
  const codeBlockExtension: Extension = ViewPlugin.fromClass(
    class {
      decorations: DecorationSet;
      constructor(view: EditorView) {
        this.decorations = decorateCodeBlock(config, view);
      }
      update(update: ViewUpdate) {
        if (
          update.docChanged ||
          update.viewportChanged ||
          update.selectionSet ||
          update.focusChanged
        )
          this.decorations = decorateCodeBlock(config, update.view);
      }
    },
    { decorations: (v) => v.decorations },
  );
  return [codeBlockHiddenPlugin, codeBlockExtension];
}

export interface CodeBlockConfig {
  onCodeBlockInfoClick?: (lang: string, code: string, event: MouseEvent) => void;
}
