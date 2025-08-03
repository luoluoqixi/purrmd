import { Extension } from '@codemirror/state';
import { EditorView } from '@codemirror/view';

export const listTheme = (dark: boolean): Extension => {
  const theme = EditorView.theme(
    {
      '.cm-content': {
        '--purrmd-formatting-bullet-list-item-color': 'var(--formatting-color)',
        '--purrmd-formatting-bullet-list-item-point-color': 'var(--formatting-color)',
        '--purrmd-formatting-ordered-list-item-color': 'var(--formatting-color)',
        '--purrmd-formatting-bullet-list-task-color': 'var(--formatting-color)',
        '--purrmd-formatting-ordered-list-task-color': 'var(--formatting-color)',

        '--purrmd-checkbox-list-height': '2rem',
        '--purrmd-checkbox-height': '1.0rem',
        '--purrmd-checkbox-color': '#fff',
        '--purrmd-checkbox-border-color': 'var(--purrmd-primary-color)',
        '--purrmd-checkbox-checked-color': 'var(--purrmd-primary-color)',
        '--purrmd-checkbox-checked-border-color': 'var(--purrmd-primary-color)',
      },
    },
    {
      dark,
    },
  );
  return theme;
};
