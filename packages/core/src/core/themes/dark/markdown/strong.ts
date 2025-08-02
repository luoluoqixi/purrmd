import { Extension } from '@codemirror/state';
import { EditorView } from '@codemirror/view';

import { strongFormattingClass } from '@/core/markdown';

export const strongDarkTheme = (): Extension => {
  const strongTheme = EditorView.theme(
    {
      '.cm-content': {
        '--purrmd-strong-formatting-color': 'var(--formatting-color)',
      },
      [`.${strongFormattingClass}`]: {
        color: 'var(--purrmd-strong-formatting-color)',
      },
    },
    {
      dark: true,
    },
  );
  return strongTheme;
};
