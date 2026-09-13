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

import {
  isFocusEvent,
  isFocusEventState,
  isForceUpdateEvent,
  isForceUpdateEventState,
} from '../state';
import { FormattingDisplayMode } from '../types';
import { isSelectRange, setSubNodeHideDecorations, syntaxTreeInVisible } from '../utils';

export const codeBlockClass = {
  codeBlockLine: 'purrmd-cm-code-block-line',
  codeBlockFirstLine: 'purrmd-cm-code-block-line-first',
  codeBlockLastLine: 'purrmd-cm-code-block-line-last',
  codeBlockInfo: 'purrmd-cm-code-block-info',
  codeBlockCopySuccessIcon: 'purrmd-cm-code-block-copy-success-icon',
};

function updateCodeBlockHiddenDecorations(
  mode: FormattingDisplayMode,
  config: CodeBlockConfig | undefined,
  state: EditorState,
): DecorationSet {
  const decorations: Range<Decoration>[] = [];
  syntaxTree(state).iterate({
    enter(node) {
      if (mode === 'show' || config?.alwaysShowMarkdownMarks || isSelectRange(state, node)) return;
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
                config,
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
    readonly config?: CodeBlockConfig,
  ) {
    super();
  }
  eq(other: CodeBlockInfoWidget) {
    return (
      other.lang === this.lang &&
      other.code === this.code &&
      other.config?.onCodeBlockInfoClick === this.config?.onCodeBlockInfoClick &&
      other.config?.copySuccessIcon === this.config?.copySuccessIcon &&
      other.config?.copySuccessDurationMs === this.config?.copySuccessDurationMs
    );
  }
  private renderLabel(dom: HTMLElement, copied: boolean) {
    dom.replaceChildren();
    if (copied) {
      const iconConfig = this.config?.copySuccessIcon ?? '💕';
      const icon = document.createElement('span');
      icon.className = codeBlockClass.codeBlockCopySuccessIcon;
      try {
        const content =
          typeof iconConfig === 'function'
            ? iconConfig({ language: this.lang, code: this.code })
            : iconConfig;
        if (typeof content === 'string') {
          icon.textContent = content;
        } else if (content != null) {
          icon.appendChild(content);
        }
      } catch {
        icon.textContent = '💕';
      }
      if (icon.childNodes.length > 0 || icon.textContent) {
        dom.appendChild(icon);
      }
    }
    dom.appendChild(document.createTextNode(this.lang));
  }
  private async copyCode() {
    if (window.navigator.clipboard) {
      try {
        await window.navigator.clipboard.writeText(this.code);
        return;
      } catch {
        // WebView 可能暴露 Clipboard API 但拒绝当前 origin，继续使用兼容复制。
      }
    }
    const selection = window.getSelection();
    if (!selection) throw new Error('Document selection is unavailable');

    const previousRanges = Array.from({ length: selection.rangeCount }, (_, index) =>
      selection.getRangeAt(index).cloneRange(),
    );
    const copyTarget = document.createElement('span');
    copyTarget.textContent = this.code;
    copyTarget.setAttribute('aria-hidden', 'true');
    copyTarget.style.position = 'fixed';
    copyTarget.style.left = '-10000px';
    copyTarget.style.top = '0';
    copyTarget.style.opacity = '0';
    copyTarget.style.pointerEvents = 'none';
    copyTarget.style.userSelect = 'text';
    copyTarget.style.whiteSpace = 'pre';
    document.body.appendChild(copyTarget);

    const copyRange = document.createRange();
    copyRange.selectNodeContents(copyTarget);
    let copied = false;
    try {
      selection.removeAllRanges();
      selection.addRange(copyRange);
      copied = document.execCommand('copy');
    } finally {
      selection.removeAllRanges();
      copyTarget.remove();
      for (const range of previousRanges) selection.addRange(range);
    }
    if (!copied) throw new Error('Copy command failed');
  }
  toDOM() {
    const dom = document.createElement('div');
    dom.className = codeBlockClass.codeBlockInfo;
    this.renderLabel(dom, false);
    // 在 click 之前阻止语言区域抢走 contenteditable 的焦点，避免移动端键盘工具栏闪现。
    dom.onmousedown = (event) => {
      event.stopPropagation();
      event.preventDefault();
    };
    dom.onclick = (event) => {
      event.stopPropagation();
      event.preventDefault();
      if (this.config?.onCodeBlockInfoClick) {
        this.config.onCodeBlockInfoClick(this.lang, this.code, event);
      } else {
        void this.copyCode()
          .then(() => {
            if (!dom.isConnected) return;
            this.renderLabel(dom, true);
            if (this.timeout) {
              window.clearTimeout(this.timeout);
            }
            this.timeout = window.setTimeout(
              () => {
                this.renderLabel(dom, false);
                this.timeout = undefined;
              },
              Math.max(this.config?.copySuccessDurationMs ?? 3000, 0),
            );
          })
          .catch(() => undefined);
      }
    };
    return dom;
  }
  destroy() {
    if (this.timeout) window.clearTimeout(this.timeout);
    this.timeout = undefined;
  }
}

export function codeBlock(mode: FormattingDisplayMode, config?: CodeBlockConfig): Extension {
  const codeBlockHiddenPlugin = StateField.define<DecorationSet>({
    create(state) {
      return updateCodeBlockHiddenDecorations(mode, config, state);
    },

    update(deco, tr) {
      if (tr.docChanged || tr.selection || isFocusEvent(tr) || isForceUpdateEvent(tr)) {
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
          isFocusEventState(update.startState, update.state) ||
          isForceUpdateEventState(update.startState, update.state)
        )
          this.decorations = decorateCodeBlock(config, update.view);
      }
    },
    { decorations: (v) => v.decorations },
  );
  return [codeBlockHiddenPlugin, codeBlockExtension];
}

export interface CodeBlockConfig {
  /** 是否始终显示 fenced code 的 Markdown 标记；全局 show 模式下无论此值如何都会显示。@default false */
  alwaysShowMarkdownMarks?: boolean;
  /** 默认复制行为成功反馈的图标。字符串会按纯文本渲染；回调可返回自定义 DOM/SVG。@default '💕' */
  copySuccessIcon?: CodeBlockCopySuccessIcon;
  /** 复制成功反馈持续时间，单位 ms。@default 3000 */
  copySuccessDurationMs?: number;
  /** 自定义语言区域点击行为；设置后由调用方接管复制及成功反馈。 */
  onCodeBlockInfoClick?: (lang: string, code: string, event: MouseEvent) => void;
}

export interface CodeBlockCopySuccessContext {
  language: string;
  code: string;
}

export type CodeBlockCopySuccessIcon =
  | string
  | ((context: CodeBlockCopySuccessContext) => Node | null);
