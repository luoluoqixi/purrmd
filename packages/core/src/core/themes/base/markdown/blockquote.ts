import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { Extension } from '@codemirror/state';
import { EditorView } from '@codemirror/view';

import { markdownTags } from '@/core/common/tags';
import { blockquoteClass as blockquote } from '@/core/markdown';

export const blockquoteClass = blockquote;

export const blockquoteBaseTheme = (): Extension => {
  const theme = EditorView.baseTheme({
    '.cm-content': {
      '--purrmd-formatting-blockquote-color': 'inherit',
      '--purrmd-formatting-blockquote-border-thickness': '2px',
      '--purrmd-formatting-blockquote-border-color': 'grey',
    },
    [`.${blockquoteClass.blockquote} .${blockquoteClass.blockquoteHideFormatting} .${blockquoteClass.blockquoteFormatting}`]:
      {
        color: 'transparent',
      },
    [`.${blockquoteClass.blockquote} .${blockquoteClass.blockquoteFormatting}`]: {
      display: 'inline-block',
      position: 'relative',
      color: 'var(--purrmd-formatting-blockquote-color)',
    },
    [`.${blockquoteClass.blockquote} .${blockquoteClass.blockquoteFormatting}::before`]: {
      borderInlineStart:
        'var(--purrmd-formatting-blockquote-border-thickness) solid var(--purrmd-formatting-blockquote-border-color)',
      content: '""',
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
    },
  });
  const highlightStyle = HighlightStyle.define([
    { class: blockquoteClass.blockquoteFormatting, tag: markdownTags.blockquoteTag },
  ]);
  return [syntaxHighlighting(highlightStyle), theme];
};
