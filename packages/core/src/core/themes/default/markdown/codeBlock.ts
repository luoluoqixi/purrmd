import { Extension } from '@codemirror/state';
import { EditorView } from '@codemirror/view';

export const codeBlockTheme = (dark: boolean): Extension => {
  const theme = EditorView.theme(
    {
      '.cm-content': {
        '--purrmd-formatting-code-block-color': 'var(--formatting-color)',
      },
    },
    {
      dark,
    },
  );
  return theme;
};
