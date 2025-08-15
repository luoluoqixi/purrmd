import { Extension } from '@codemirror/state';
import { EditorView } from '@codemirror/view';

export const codeBlockTheme = (dark: boolean): Extension => {
  const theme = EditorView.theme(
    {
      '.cm-content': {
        '--purrmd-formatting-code-block-color': 'var(--purrmd-formatting-color)',
        '--purrmd-code-block-bg-color': dark ? '#ffffff05' : '#00000005',
        '--purrmd-code-block-info-bg-color-hover': dark ? '#ffffff1a' : '#0000001a',
      },
    },
    {
      dark,
    },
  );
  return theme;
};
