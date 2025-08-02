import { Extension } from '@codemirror/state';
import { EditorView } from '@codemirror/view';

import { emphasisFormattingClass } from '@/core/markdown';

export const emphasisDarkTheme = (): Extension => {
  const emphasisTheme = EditorView.theme(
    {
      '.cm-content': {
        '--purrmd-emphasis-formatting-color': 'var(--formatting-color)',
      },
      [`.${emphasisFormattingClass}`]: {
        color: 'var(--purrmd-emphasis-formatting-color)',
      },
    },
    {
      dark: true,
    },
  );
  return emphasisTheme;
};
