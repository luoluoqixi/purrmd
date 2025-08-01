import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { Extension } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { tags } from '@lezer/highlight';

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
    '.purrmd-cm-heading1': {
      fontWeight: 'var(--purrmd-h1-weight)',
      fontSize: 'var(--purrmd-h1-size)',
    },
    '.purrmd-cm-heading2': {
      fontWeight: 'var(--purrmd-h2-weight)',
      fontSize: 'var(--purrmd-h2-size)',
    },
    '.purrmd-cm-heading3': {
      fontWeight: 'var(--purrmd-h3-weight)',
      fontSize: 'var(--purrmd-h3-size)',
    },
    '.purrmd-cm-heading4': {
      fontWeight: 'var(--purrmd-h4-weight)',
      fontSize: 'var(--purrmd-h4-size)',
    },
    '.purrmd-cm-heading5': {
      fontWeight: 'var(--purrmd-h5-weight)',
      fontSize: 'var(--purrmd-h5-size)',
    },
    '.purrmd-cm-heading6': {
      fontWeight: 'var(--purrmd-h6-weight)',
      fontSize: 'var(--purrmd-h6-size)',
    },
  });
  const highlightStyle = HighlightStyle.define([
    { class: 'purrmd-cm-heading1', tag: tags.heading1 },
    { class: 'purrmd-cm-heading2', tag: tags.heading2 },
    { class: 'purrmd-cm-heading3', tag: tags.heading3 },
    { class: 'purrmd-cm-heading4', tag: tags.heading4 },
    { class: 'purrmd-cm-heading5', tag: tags.heading5 },
    { class: 'purrmd-cm-heading6', tag: tags.heading6 },
  ]);
  return [syntaxHighlighting(highlightStyle), headingTheme];
};
