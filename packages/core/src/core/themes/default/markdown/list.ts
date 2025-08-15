import { Extension } from '@codemirror/state';
import { EditorView } from '@codemirror/view';

export const listTheme = (dark: boolean): Extension => {
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
