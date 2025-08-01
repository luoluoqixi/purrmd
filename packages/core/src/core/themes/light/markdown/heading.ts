import { Extension } from '@codemirror/state';
import { EditorView } from '@codemirror/view';

export const headingLightTheme = (): Extension => {
  const headingTheme = EditorView.theme(
    {
      '.purrmd-cm-formatting-heading': {
        color: 'var(--formatting-color)',
      },
    },
    {
      dark: false,
    },
  );
  return headingTheme;
};
