import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { Extension } from '@codemirror/state';
import { EditorView } from '@codemirror/view';

import { markdownTags } from '@/core/common/tags';

export const strikethroughClass = {
  strikethrough: 'purrmd-cm-strikethrough',
  strikethroughFormatting: 'purrmd-cm-formatting-strikethrough',
};

export const strikethroughBaseTheme = (): Extension => {
  const theme = EditorView.baseTheme({
    '.cm-content': {
      '--purrmd-strikethrough-text-decoration': 'line-through',
    },
    [`.${strikethroughClass.strikethrough}`]: {
      textDecoration: 'var(--purrmd-strikethrough-text-decoration)',
    },
  });
  const highlightStyle = HighlightStyle.define([
    { class: strikethroughClass.strikethrough, tag: markdownTags.strikethrough },
    { class: strikethroughClass.strikethroughFormatting, tag: markdownTags.strikethroughTag },
  ]);
  return [syntaxHighlighting(highlightStyle), theme];
};
