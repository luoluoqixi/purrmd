import { Extension } from '@codemirror/state';
import { EditorView } from '@codemirror/view';

export const listTheme = (dark: boolean): Extension => {
  const theme = EditorView.theme(
    {
      '.cm-content': {
        '--purrmd-formatting-bullet-list-item-color': '#ababab',
        '--purrmd-formatting-bullet-list-item-point-color': '#ababab',
        '--purrmd-formatting-ordered-list-item-color': '#ababab',
      },
    },
    {
      dark,
    },
  );
  return theme;
};
