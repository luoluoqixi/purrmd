import { Extension } from '@codemirror/state';
import { EditorView } from '@codemirror/view';

export const imageTheme = (dark: boolean): Extension => {
  const theme = EditorView.theme(
    {
      '.cm-content': {},
    },
    {
      dark,
    },
  );
  return theme;
};
