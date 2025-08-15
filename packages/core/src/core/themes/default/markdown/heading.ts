import { Extension } from '@codemirror/state';
import { EditorView } from '@codemirror/view';

export const headingTheme = (dark: boolean): Extension => {
  const theme = EditorView.theme(
    {
      '.cm-content': {
        '--purrmd-formatting-heading-color': 'var(--purrmd-formatting-color)',
      },
    },
    {
      dark,
    },
  );
  return theme;
};
