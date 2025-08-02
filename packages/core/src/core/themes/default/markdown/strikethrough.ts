import { Extension } from '@codemirror/state';
import { EditorView } from '@codemirror/view';

export const strikethroughTheme = (dark: boolean): Extension => {
  const theme = EditorView.theme(
    {
      '.cm-content': {
        '--purrmd-formatting-strikethrough-color': 'var(--formatting-color)',
      },
    },
    {
      dark,
    },
  );
  return theme;
};
