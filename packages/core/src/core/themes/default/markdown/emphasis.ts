import { Extension } from '@codemirror/state';
import { EditorView } from '@codemirror/view';

import { emphasisFormattingClass } from '@/core/markdown';

export const emphasisLightTheme = (dark: boolean): Extension => {
  const emphasisTheme = EditorView.theme(
    {
      '.cm-content': {
        '--purrmd-formatting-emphasis-color': 'var(--formatting-color)',
      },
      [`.${emphasisFormattingClass}`]: {
        color: 'var(--purrmd-formatting-emphasis-color)',
      },
    },
    {
      dark,
    },
  );
  return emphasisTheme;
};
