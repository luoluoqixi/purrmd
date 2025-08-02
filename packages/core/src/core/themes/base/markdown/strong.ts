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
    },
    [`.${strongClass.strong}`]: {
      fontWeight: 'var(--purrmd-strong-weight)',
    },
    [`.${strongClass.strong}.${emphasisClass.emphasisFormatting}`]: {
      color: 'var(--purrmd-formatting-strong-color)',
    },
  });
  const highlightStyle = HighlightStyle.define([
    { class: strongClass.strong, tag: markdownTags.strong },
  ]);
  return [syntaxHighlighting(highlightStyle), theme];
};
