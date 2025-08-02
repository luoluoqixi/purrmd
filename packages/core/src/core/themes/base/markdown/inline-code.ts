import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { Extension } from '@codemirror/state';
import { EditorView } from '@codemirror/view';

import { markdownTags } from '@/core/common/tags';

export const inlineCodeClass = {
  inlineCode: 'purrmd-cm-inline-code',
  inlineCodeFormatting: 'purrmd-cm-formatting-inline-code',
};

export const inlineCodeBaseTheme = (): Extension => {
  const theme = EditorView.baseTheme({
    '.cm-content': {
      '--purrmd-inline-code-weight': 'bold',
    },
    [`.${inlineCodeClass.inlineCode}`]: {
      padding: '0.2rem',
      borderRadius: '0.4rem',
      fontSize: '0.8rem',
      backgroundColor: 'gray',
      color: 'white',
    },
  });
  const highlightStyle = HighlightStyle.define([
    { class: inlineCodeClass.inlineCode, tag: markdownTags.inlineCode },
    { class: inlineCodeClass.inlineCodeFormatting, tag: markdownTags.inlineCodeTag },
  ]);
  return [syntaxHighlighting(highlightStyle), theme];
};
