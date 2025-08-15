import { Extension } from '@codemirror/state';
import { EditorView } from '@codemirror/view';

export const blockquoteTheme = (dark: boolean): Extension => {
  const theme = EditorView.theme(
    {
      '.cm-content': {
        '--purrmd-formatting-blockquote-color': 'var(--purrmd-formatting-color)',
        '--purrmd-formatting-blockquote-border-color': 'var(--purrmd-formatting-color)',
      },
    },
    {
      dark,
    },
  );
  return theme;
};
