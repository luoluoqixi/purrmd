import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { Extension } from '@codemirror/state';
import { EditorView } from '@codemirror/view';

import { markdownTags } from '@/core/common/tags';

export const strongClass = {
  strong: 'purrmd-cm-strong',
};

export const strongBaseTheme = (): Extension => {
  const theme = EditorView.baseTheme({
    '.cm-content': {
      '--purrmd-strong-weight': 'bold',
    },
    [`.${strongClass.strong}`]: {
      fontWeight: 'var(--purrmd-strong-weight)',
    },
  });
  const highlightStyle = HighlightStyle.define([
    { class: strongClass.strong, tag: markdownTags.strong },
  ]);
  return [syntaxHighlighting(highlightStyle), theme];
};
