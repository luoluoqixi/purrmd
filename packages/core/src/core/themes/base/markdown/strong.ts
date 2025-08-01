import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { Extension } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { tags } from '@lezer/highlight';

export const strongClass = 'purrmd-cm-strong';

export const strongBaseTheme = (): Extension => {
  const strongTheme = EditorView.baseTheme({
    '.cm-content': {
      '--purrmd-strong-weight': 'bold',
    },
    [`.${strongClass}`]: {
      fontWeight: 'var(--purrmd-strong-weight)',
    },
  });
  const highlightStyle = HighlightStyle.define([{ class: strongClass, tag: tags.strong }]);
  return [syntaxHighlighting(highlightStyle), strongTheme];
};
