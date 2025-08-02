import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { Extension } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { tags } from '@lezer/highlight';

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
  const highlightStyle = HighlightStyle.define([{ class: strongClass.strong, tag: tags.strong }]);
  return [syntaxHighlighting(highlightStyle), theme];
};
