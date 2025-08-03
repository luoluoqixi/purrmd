import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { Extension } from '@codemirror/state';
import { EditorView } from '@codemirror/view';

import { markdownTags } from '@/core/common/tags';
import { linkClass as link } from '@/core/markdown';

export const linkClass = link;

export const linkBaseTheme = (): Extension => {
  const theme = EditorView.baseTheme({
    '.cm-content': {
      '--purrmd-link-color': 'blue',
      '--purrmd-link-url-color': 'blue',
      '--purrmd-link-title-color': '#a11',
      '--purrmd-formatting-link-color': 'blue',
    },
    [`.${linkClass.linkFormatting} .${linkClass.link}`]: {
      color: 'var(--purrmd-link-color)',
      textDecoration: 'none',
    },
    [`.${linkClass.linkHideFormatting} .${linkClass.link}`]: {
      color: 'var(--purrmd-link-color)',
      textDecoration: 'underline',
      cursor: 'pointer',
    },
    [`.${linkClass.linkFormatting} .${linkClass.linkURL}`]: {
      color: 'var(--purrmd-link-url-color)',
      textDecoration: 'underline',
    },
    [`.${linkClass.linkFormatting} .${linkClass.linkTitle}`]: {
      color: 'var(--purrmd-link-title-color)',
      textDecoration: 'none',
    },
    [`.${linkClass.linkHideFormatting} .${linkClass.linkTitle}`]: {
      color: 'var(--purrmd-link-title-color)',
      textDecoration: 'underline',
    },
    [`.${linkClass.link}.${linkClass.linkFormatting}`]: {
      color: 'var(--purrmd-formatting-link-color)',
      textDecoration: 'none',
    },
    [`.${linkClass.linkHideFormatting}`]: {
      textDecoration: 'none',
    },
  });
  const highlightStyle = HighlightStyle.define([
    { class: linkClass.linkFormatting, tag: markdownTags.linkTag },
    { class: linkClass.linkURL, tag: markdownTags.linkURLTag },
    { class: linkClass.linkTitle, tag: markdownTags.linkTitle },
    { class: linkClass.link, tag: markdownTags.link },
  ]);
  return [syntaxHighlighting(highlightStyle), theme];
};
