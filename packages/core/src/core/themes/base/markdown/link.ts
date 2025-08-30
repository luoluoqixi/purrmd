import { markdownLanguage } from '@codemirror/lang-markdown';
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { Extension } from '@codemirror/state';
import { EditorView } from '@codemirror/view';

import { markdownTags } from '@/core/common/tags';
import { linkClass as link } from '@/core/markdown';

export const linkClass = link;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const linkBaseTheme = (dark: boolean): Extension => {
  const theme = EditorView.baseTheme({
    '.cm-content': {
      '--purrmd-formatting-link-color': 'var(--purrmd-primary-color)',
      '--purrmd-formatting-link-opacity': 'var(--purrmd-formatting-opacity)',

      '--purrmd-link-color': 'var(--purrmd-primary-color)',
      '--purrmd-link-url-color': 'var(--purrmd-primary-color)',
      '--purrmd-link-title-color': 'var(--purrmd-primary-color)',
    },
    [`.${linkClass.link}`]: {
      color: 'var(--purrmd-link-color)',
      textDecoration: 'none',
    },
    [`.${linkClass.link}:hover`]: {
      opacity: '0.8',
      textDecoration: 'underline',
    },
    [`.${linkClass.linkURL}`]: {
      color: 'var(--purrmd-link-url-color)',
      textDecoration: 'underline',
    },
    [`.${linkClass.linkTitle}`]: {
      color: 'var(--purrmd-link-title-color)',
      textDecoration: 'underline',
    },

    [`.${linkClass.linkHideFormatting} .${linkClass.link}`]: {
      color: 'var(--purrmd-link-color)',
      textDecoration: 'none',
    },
    [`.${linkClass.linkHideFormatting} .${linkClass.link}:hover`]: {
      opacity: '0.8',
      textDecoration: 'underline',
    },
    [`.${linkClass.link}.${linkClass.linkFormatting}`]: {
      color: 'var(--purrmd-formatting-link-color)',
      textDecoration: 'none',
      opacity: 'var(--purrmd-formatting-link-opacity)',
    },
    [`.${linkClass.linkHideFormatting}`]: {
      textDecoration: 'none',
    },

    [`.${linkClass.linkHideFormatting}.${linkClass.linkHover},
      .${linkClass.linkFormatting}.${linkClass.linkHover}`]: {
      cursor: 'pointer',
    },
  });
  const highlightStyle = HighlightStyle.define(
    [
      { class: linkClass.linkFormatting, tag: markdownTags.linkTag },
      { class: linkClass.linkURL, tag: markdownTags.linkURLTag },
      { class: linkClass.linkTitle, tag: markdownTags.linkTitle },
      { class: linkClass.link, tag: markdownTags.link },
    ],
    {
      scope: markdownLanguage,
    },
  );
  return [syntaxHighlighting(highlightStyle), theme];
};
