import { Extension } from '@codemirror/state';
import { EditorView } from '@codemirror/view';

export const strongTheme = (dark: boolean): Extension => {
  const theme = EditorView.theme(
    {
      '.cm-content': {
        '--purrmd-formatting-strong-color': 'var(--formatting-color)',
      },
    },
    {
      dark,
    },
  );
  return theme;
};
