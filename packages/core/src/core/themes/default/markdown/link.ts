import { Extension } from '@codemirror/state';
import { EditorView } from '@codemirror/view';

export const linkTheme = (dark: boolean): Extension => {
  const theme = EditorView.theme(
    {
      '.cm-content': {
        '--purrmd-link-color': 'var(--purrmd-primary-color)',
        '--purrmd-link-url-color': 'var(--purrmd-primary-color)',
        '--purrmd-link-title-color': 'var(--purrmd-primary-color)',
        '--purrmd-formatting-link-color': 'var(--purrmd-formatting-color)',
      },
    },
    {
      dark,
    },
  );
  return theme;
};
