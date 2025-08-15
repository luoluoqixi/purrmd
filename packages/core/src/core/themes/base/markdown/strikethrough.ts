import { markdownLanguage } from '@codemirror/lang-markdown';
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { Extension } from '@codemirror/state';
import { EditorView } from '@codemirror/view';

import { markdownTags } from '@/core/common/tags';

export const strikethroughClass = {
  strikethrough: 'purrmd-cm-strikethrough',
  strikethroughFormatting: 'purrmd-cm-formatting-strikethrough',
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const strikethroughBaseTheme = (dark: boolean): Extension => {
  const theme = EditorView.baseTheme({
    '.cm-content': {
      '--purrmd-strikethrough-text-decoration': 'line-through',
      '--purrmd-formatting-strikethrough-color': 'var(--purrmd-primary-color)',
      '--purrmd-formatting-strikethrough-opacity': 'var(--purrmd-formatting-opacity)',
    },
    [`.${strikethroughClass.strikethrough}.${strikethroughClass.strikethrough}`]: {
      textDecoration: 'var(--purrmd-strikethrough-text-decoration)',
    },
    [`.${strikethroughClass.strikethrough}.${strikethroughClass.strikethroughFormatting}`]: {
      color: 'var(--purrmd-formatting-strikethrough-color)',
      opacity: 'var(--purrmd-formatting-strikethrough-opacity)',
    },
  });
  const highlightStyle = HighlightStyle.define(
    [
      { class: strikethroughClass.strikethrough, tag: markdownTags.strikethrough },
      { class: strikethroughClass.strikethroughFormatting, tag: markdownTags.strikethroughTag },
    ],
    {
      scope: markdownLanguage,
    },
  );
  return [syntaxHighlighting(highlightStyle), theme];
};
