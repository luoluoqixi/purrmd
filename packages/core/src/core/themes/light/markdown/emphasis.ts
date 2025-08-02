import { Extension } from '@codemirror/state';
import { EditorView } from '@codemirror/view';

import { emphasisFormattingClass } from '@/core/markdown';

export const emphasisLightTheme = (): Extension => {
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
      dark: false,
    },
  );
  return emphasisTheme;
};
