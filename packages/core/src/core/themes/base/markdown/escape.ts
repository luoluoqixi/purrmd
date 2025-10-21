import { markdownLanguage } from '@codemirror/lang-markdown';
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { Extension } from '@codemirror/state';
import { EditorView } from '@codemirror/view';

import { markdownTags } from '@/core/common/tags';

export const escapeClass = {
  escape: 'purrmd-cm-escape',
  escapeFormatting: 'purrmd-cm-formatting-escape',
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const escapeBaseTheme = (dark: boolean): Extension => {
  const theme = EditorView.baseTheme({
    '.cm-content': {
      '--purrmd-formatting-escape-color': 'var(--purrmd-primary-color)',
      '--purrmd-formatting-escape-opacity': 'var(--purrmd-formatting-opacity)',
      '--purrmd-escape-color': 'var(--purrmd-primary-color)',
    },
    [`.${escapeClass.escape}`]: {
      color: 'var(--purrmd-escape-color, yellow)',
    },
    [`.${escapeClass.escapeFormatting}`]: {
      color: 'var(--purrmd-formatting-escape-color)',
      opacity: 'var(--purrmd-formatting-escape-opacity)',
    },
  });
  const highlightStyle = HighlightStyle.define(
    [
      { class: escapeClass.escape, tag: markdownTags.escape },
      { class: escapeClass.escapeFormatting, tag: markdownTags.escapeTag },
    ],
    {
      scope: markdownLanguage,
    },
  );
  return [syntaxHighlighting(highlightStyle), theme];
};
