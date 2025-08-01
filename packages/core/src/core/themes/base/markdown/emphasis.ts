import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { Extension } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { tags } from '@lezer/highlight';

export const emphasisClass = 'purrmd-cm-emphasis';

export const emphasisBaseTheme = (): Extension => {
  const emphasisTheme = EditorView.baseTheme({
    '.cm-content': {
      '--purrmd-emphasis-style': 'italic',
    },
    [`.${emphasisClass}`]: {
      fontStyle: 'var(--purrmd-emphasis-style)',
    },
  });
  const highlightStyle = HighlightStyle.define([{ class: emphasisClass, tag: tags.emphasis }]);
  return [syntaxHighlighting(highlightStyle), emphasisTheme];
};
