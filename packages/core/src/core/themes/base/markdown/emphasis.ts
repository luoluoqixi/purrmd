import { markdownLanguage } from '@codemirror/lang-markdown';
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { Extension } from '@codemirror/state';
import { EditorView } from '@codemirror/view';

import { markdownTags } from '@/core/common/tags';

export const emphasisClass = {
  emphasis: 'purrmd-cm-emphasis',
  emphasisFormatting: 'purrmd-cm-formatting-emphasis',
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const emphasisBaseTheme = (dark: boolean): Extension => {
  const theme = EditorView.baseTheme({
    '.cm-content': {
      '--purrmd-emphasis-style': 'italic',
      '--purrmd-formatting-emphasis-color': 'var(--purrmd-formatting-color)',
      '--purrmd-formatting-emphasis-opacity': 'var(--purrmd-formatting-opacity)',
    },
    [`.${emphasisClass.emphasis}`]: {
      fontStyle: 'var(--purrmd-emphasis-style)',
    },
    [`.${emphasisClass.emphasis}.${emphasisClass.emphasisFormatting}`]: {
      color: 'var(--purrmd-formatting-emphasis-color)',
      opacity: 'var(--purrmd-formatting-emphasis-opacity)',
    },
  });
  const highlightStyle = HighlightStyle.define(
    [
      { class: emphasisClass.emphasis, tag: markdownTags.emphasis },
      { class: emphasisClass.emphasisFormatting, tag: markdownTags.emphasisTag },
    ],
    {
      scope: markdownLanguage,
    },
  );
  return [syntaxHighlighting(highlightStyle), theme];
};
