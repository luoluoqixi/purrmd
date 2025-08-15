import { markdownLanguage } from '@codemirror/lang-markdown';
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { Extension } from '@codemirror/state';
import { EditorView } from '@codemirror/view';

import { markdownTags } from '@/core/common/tags';

import { emphasisClass } from './emphasis';

export const strongClass = {
  strong: 'purrmd-cm-strong',
};

export const strongBaseTheme = (): Extension => {
  const theme = EditorView.baseTheme({
    '.cm-content': {
      '--purrmd-strong-weight': 'bold',
      '--purrmd-formatting-strong-color': 'inherit',
      '--purrmd-formatting-strong-opacity': 'var(--purrmd-formatting-opacity)',
    },
    [`.${strongClass.strong}`]: {
      fontWeight: 'var(--purrmd-strong-weight)',
    },
    [`.${strongClass.strong}.${emphasisClass.emphasisFormatting}`]: {
      color: 'var(--purrmd-formatting-strong-color)',
      opacity: 'var(--purrmd-formatting-strong-opacity)',
    },
  });
  const highlightStyle = HighlightStyle.define(
    [{ class: strongClass.strong, tag: markdownTags.strong }],
    {
      scope: markdownLanguage,
    },
  );
  return [syntaxHighlighting(highlightStyle), theme];
};
