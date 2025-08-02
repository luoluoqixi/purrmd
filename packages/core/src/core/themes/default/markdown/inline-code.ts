import { Extension } from '@codemirror/state';
import { EditorView } from '@codemirror/view';

export const inlineCodeTheme = (dark: boolean): Extension => {
  const theme = EditorView.theme(
    {
      '.cm-content': {
        '--purrmd-inline-code-bg-color': 'rgba(0, 0, 0, 0.05)',
        '--purrmd-inline-code-color': 'inherit',
        '--purrmd-formatting-inline-code-color': 'var(--formatting-color)',
      },
    },
    {
      dark,
    },
  );
  return theme;
};
