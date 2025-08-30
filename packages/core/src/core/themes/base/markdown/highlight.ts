import { markdownLanguage } from '@codemirror/lang-markdown';
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { Extension } from '@codemirror/state';
import { EditorView } from '@codemirror/view';

import { markdownTags } from '@/core/common/tags';

import { emphasisClass } from './emphasis';

export const highlightClass = {
  highlight: 'purrmd-cm-highlight',
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const highlightBaseTheme = (dark: boolean): Extension => {
  const theme = EditorView.baseTheme({
    '.cm-content': {
      '--purrmd-formatting-highlight-color': 'var(--purrmd-primary-color)',
      '--purrmd-formatting-highlight-opacity': 'var(--purrmd-formatting-opacity)',
      '--purrmd-highlight-bg-color': '#ffd00066',
    },
    [`.${highlightClass.highlight}`]: {
      backgroundColor: 'var(--purrmd-highlight-bg-color, yellow)',
    },
    [`.${highlightClass.highlight}.${emphasisClass.emphasisFormatting}`]: {
      color: 'var(--purrmd-formatting-highlight-color)',
      opacity: 'var(--purrmd-formatting-highlight-opacity)',
    },
  });
  const highlightStyle = HighlightStyle.define(
    [{ class: highlightClass.highlight, tag: markdownTags.highlight }],
    {
      scope: markdownLanguage,
    },
  );
  return [syntaxHighlighting(highlightStyle), theme];
};
