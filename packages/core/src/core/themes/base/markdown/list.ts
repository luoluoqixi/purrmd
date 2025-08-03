import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { Extension } from '@codemirror/state';
import { EditorView } from '@codemirror/view';

import { markdownTags } from '@/core/common/tags';
import { listClass as list } from '@/core/markdown';

export const listClass = list;

export const listBaseTheme = (): Extension => {
  const theme = EditorView.baseTheme({
    '.cm-content': {
      '--purrmd-formatting-bullet-list-item-color': '#ababab',
      '--purrmd-formatting-bullet-list-item-point-color': '#ababab',
      '--purrmd-formatting-ordered-list-item-color': '#ababab',
    },
    [`.${listClass.bulletListItemFormattingHide} .${listClass.listFormatting},
      .${listClass.bulletListItemFormatting} .${listClass.listFormatting}`]: {
      display: 'inline-block',
      position: 'relative',
    },
    [`.${listClass.bulletListItemFormattingHide} .${listClass.listFormatting}`]: {
      color: 'transparent',
    },
    [`.${listClass.bulletListItemFormatting} .${listClass.listFormatting}`]: {
      color: 'var(--purrmd-formatting-bullet-list-item-color)',
    },
    [`.${listClass.bulletListItemFormattingHide} .${listClass.listFormatting}::after,
      .${listClass.bulletListItemFormatting} .${listClass.listFormatting}::after`]: {
      position: 'absolute',
      content: '"•"',
      left: 0,
    },
    [`.${listClass.bulletListItemFormattingHide} .${listClass.listFormatting}::after`]: {
      color: 'var(--purrmd-formatting-bullet-list-item-point-color)',
    },
    [`.${listClass.bulletListItemFormatting} .${listClass.listFormatting}::after`]: {
      color: 'transparent',
    },
    [`.${listClass.orderedListItemFormatting} .${listClass.listFormatting}`]: {
      color: 'var(--purrmd-formatting-ordered-list-item-color)',
    },
  });
  const highlightStyle = HighlightStyle.define([
    {
      tag: markdownTags.listTag,
      class: listClass.listFormatting,
    },
  ]);
  return [syntaxHighlighting(highlightStyle), theme];
};
