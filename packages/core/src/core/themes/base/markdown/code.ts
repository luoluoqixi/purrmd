import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { Extension } from '@codemirror/state';
import { EditorView } from '@codemirror/view';

import { markdownTags } from '@/core/common/tags';

export const codeClass = {
  codeFormatting: 'purrmd-cm-formatting-code',
  codeInfo: 'purrmd-cm-formatting-code-info',
};

export const codeBaseTheme = (): Extension => {
  const theme = EditorView.baseTheme({
    '.cm-content': {
      '--purrmd-formatting-code-info-color': 'inherit',
    },
    [`.${codeClass.codeInfo}`]: {
      color: 'var(--purrmd-formatting-code-info-color)',
    },
  });
  const highlightStyle = HighlightStyle.define([
    { class: codeClass.codeFormatting, tag: markdownTags.codeTag },
    { class: codeClass.codeInfo, tag: markdownTags.codeInfo },
  ]);
  return [syntaxHighlighting(highlightStyle), theme];
};
