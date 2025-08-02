import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { Extension } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { tags } from '@lezer/highlight';

export const strikethroughClass = 'purrmd-cm-strikethrough';

export const strikethroughBaseTheme = (): Extension => {
  const strikethroughTheme = EditorView.baseTheme({
    '.cm-content': {
      '--purrmd-strikethrough-text-decoration': 'line-through',
    },
    [`.${strikethroughClass}`]: {
      textDecoration: 'var(--purrmd-strikethrough-text-decoration)',
    },
  });
  const highlightStyle = HighlightStyle.define([
    { class: strikethroughClass, tag: tags.strikethrough },
  ]);
  return [syntaxHighlighting(highlightStyle), strikethroughTheme];
};
