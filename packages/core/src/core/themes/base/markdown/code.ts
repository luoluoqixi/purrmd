import { markdownLanguage } from '@codemirror/lang-markdown';
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { Extension } from '@codemirror/state';
import { EditorView } from '@codemirror/view';

import { markdownTags } from '@/core/common/tags';

export const codeClass = {
  codeFormatting: 'purrmd-cm-formatting-code',
  codeInfo: 'purrmd-cm-formatting-code-info',
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const codeBaseTheme = (dark: boolean): Extension => {
  const theme = EditorView.baseTheme({
    '.cm-content': {
      '--purrmd-formatting-code-info-color': 'inherit',
    },
    [`.${codeClass.codeInfo}`]: {
      color: 'var(--purrmd-formatting-code-info-color)',
    },
  });
  const highlightStyle = HighlightStyle.define(
    [
      { class: codeClass.codeFormatting, tag: markdownTags.codeTag },
      { class: codeClass.codeInfo, tag: markdownTags.codeInfo },
    ],
    {
      scope: markdownLanguage,
    },
  );
  return [syntaxHighlighting(highlightStyle), theme];
};
