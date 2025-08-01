import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { Extension } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { tags } from '@lezer/highlight';

export const headingClass = {
  heading1: 'purrmd-cm-heading1',
  heading2: 'purrmd-cm-heading2',
  heading3: 'purrmd-cm-heading3',
  heading4: 'purrmd-cm-heading4',
  heading5: 'purrmd-cm-heading5',
  heading6: 'purrmd-cm-heading6',
};

export const headingBaseTheme = (): Extension => {
  const headingTheme = EditorView.baseTheme({
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
    },
    [`.${headingClass.heading1}`]: {
      fontWeight: 'var(--purrmd-h1-weight)',
      fontSize: 'var(--purrmd-h1-size)',
    },
    [`.${headingClass.heading2}`]: {
      fontWeight: 'var(--purrmd-h2-weight)',
      fontSize: 'var(--purrmd-h2-size)',
    },
    [`.${headingClass.heading3}`]: {
      fontWeight: 'var(--purrmd-h3-weight)',
      fontSize: 'var(--purrmd-h3-size)',
    },
    [`.${headingClass.heading4}`]: {
      fontWeight: 'var(--purrmd-h4-weight)',
      fontSize: 'var(--purrmd-h4-size)',
    },
    [`.${headingClass.heading5}`]: {
      fontWeight: 'var(--purrmd-h5-weight)',
      fontSize: 'var(--purrmd-h5-size)',
    },
    [`.${headingClass.heading6}`]: {
      fontWeight: 'var(--purrmd-h6-weight)',
      fontSize: 'var(--purrmd-h6-size)',
    },
  });
  const highlightStyle = HighlightStyle.define([
    { class: headingClass.heading1, tag: tags.heading1 },
    { class: headingClass.heading2, tag: tags.heading2 },
    { class: headingClass.heading3, tag: tags.heading3 },
    { class: headingClass.heading4, tag: tags.heading4 },
    { class: headingClass.heading5, tag: tags.heading5 },
    { class: headingClass.heading6, tag: tags.heading6 },
  ]);
  return [syntaxHighlighting(highlightStyle), headingTheme];
};
