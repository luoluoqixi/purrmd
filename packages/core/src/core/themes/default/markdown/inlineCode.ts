import { Extension } from '@codemirror/state';
import { EditorView } from '@codemirror/view';

export const inlineCodeTheme = (dark: boolean): Extension => {
  const theme = EditorView.theme(
    {
      '.cm-content': {
        '--purrmd-inline-code-bg-color': 'var(--purrmd-primary-color)',
        '--purrmd-inline-code-color': 'white',
        '--purrmd-formatting-inline-code-color': 'white',
      },
    },
    {
      dark,
    },
  );
  return theme;
};
