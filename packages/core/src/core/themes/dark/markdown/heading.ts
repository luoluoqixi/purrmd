import { Extension } from '@codemirror/state';
import { EditorView } from '@codemirror/view';

export const headingDarkTheme = (): Extension => {
  const headingTheme = EditorView.theme(
    {
      '.purrmd-cm-formatting-heading': {
        color: 'var(--formatting-color)',
      },
    },
    {
      dark: true,
    },
  );
  return headingTheme;
};
