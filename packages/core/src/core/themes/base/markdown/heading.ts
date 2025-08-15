import { markdownLanguage } from '@codemirror/lang-markdown';
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { Extension } from '@codemirror/state';
import { EditorView } from '@codemirror/view';

import { markdownTags } from '@/core/common/tags';

export const headingClass = {
  heading1: 'purrmd-cm-heading1',
  heading2: 'purrmd-cm-heading2',
  heading3: 'purrmd-cm-heading3',
  heading4: 'purrmd-cm-heading4',
  heading5: 'purrmd-cm-heading5',
  heading6: 'purrmd-cm-heading6',
  headingFormatting: 'purrmd-cm-formatting-heading',
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const headingBaseTheme = (dark: boolean): Extension => {
  const theme = EditorView.baseTheme({
    '.cm-content': {
      '--purrmd-h1-size': '1.802em',
      '--purrmd-h2-size': '1.602em',
      '--purrmd-h3-size': '1.424em',
      '--purrmd-h4-size': '1.266em',
      '--purrmd-h5-size': '1.125em',
      '--purrmd-h6-size': '1em',
      '--purrmd-h1-weight': '700',
      '--purrmd-h2-weight': '600',
      '--purrmd-h3-weight': '600',
      '--purrmd-h4-weight': '600',
      '--purrmd-h5-weight': '600',
      '--purrmd-h6-weight': '600',
      '--purrmd-h1-text-decoration': 'none',
      '--purrmd-formatting-heading-color': 'var(--purrmd-formatting-color)',
      '--purrmd-h-color': 'inherit',
      '--purrmd-formatting-h-opacity': 'var(--purrmd-formatting-opacity)',
    },
    [`.${headingClass.heading1}`]: {
      fontWeight: 'var(--purrmd-h1-weight)',
      fontSize: 'var(--purrmd-h1-size)',
      textDecoration: 'var(--purrmd-h1-text-decoration, none)',
      color: 'var(--purrmd-h-color)',
    },
    [`.${headingClass.heading2}`]: {
      fontWeight: 'var(--purrmd-h2-weight)',
      fontSize: 'var(--purrmd-h2-size)',
      textDecoration: 'var(--purrmd-h1-text-decoration, none)',
      color: 'var(--purrmd-h-color)',
    },
    [`.${headingClass.heading3}`]: {
      fontWeight: 'var(--purrmd-h3-weight)',
      fontSize: 'var(--purrmd-h3-size)',
      textDecoration: 'var(--purrmd-h1-text-decoration, none)',
      color: 'var(--purrmd-h-color)',
    },
    [`.${headingClass.heading4}`]: {
      fontWeight: 'var(--purrmd-h4-weight)',
      fontSize: 'var(--purrmd-h4-size)',
      textDecoration: 'var(--purrmd-h1-text-decoration, none)',
      color: 'var(--purrmd-h-color)',
    },
    [`.${headingClass.heading5}`]: {
      fontWeight: 'var(--purrmd-h5-weight)',
      fontSize: 'var(--purrmd-h5-size)',
      textDecoration: 'var(--purrmd-h1-text-decoration, none)',
      color: 'var(--purrmd-h-color)',
    },
    [`.${headingClass.heading6}`]: {
      fontWeight: 'var(--purrmd-h6-weight)',
      fontSize: 'var(--purrmd-h6-size)',
      textDecoration: 'var(--purrmd-h1-text-decoration, none)',
      color: 'var(--purrmd-h-color)',
    },
    [`.${headingClass.headingFormatting}`]: {
      color: 'var(--purrmd-formatting-heading-color)',
      opacity: 'var(--purrmd-formatting-h-opacity)',
    },
  });
  const highlightStyle = HighlightStyle.define(
    [
      { class: headingClass.heading1, tag: markdownTags.heading1 },
      { class: headingClass.heading2, tag: markdownTags.heading2 },
      { class: headingClass.heading3, tag: markdownTags.heading3 },
      { class: headingClass.heading4, tag: markdownTags.heading4 },
      { class: headingClass.heading5, tag: markdownTags.heading5 },
      { class: headingClass.heading6, tag: markdownTags.heading6 },
      { class: headingClass.headingFormatting, tag: markdownTags.headerTag },
    ],
    {
      scope: markdownLanguage,
    },
  );
  return [syntaxHighlighting(highlightStyle), theme];
};
