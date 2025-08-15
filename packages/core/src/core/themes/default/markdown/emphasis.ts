import { Extension } from '@codemirror/state';
import { EditorView } from '@codemirror/view';

export const emphasisTheme = (dark: boolean): Extension => {
  const theme = EditorView.theme(
    {
      '.cm-content': {
        '--purrmd-formatting-emphasis-color': 'var(--purrmd-formatting-color)',
      },
    },
    {
      dark,
    },
  );
  return theme;
};
