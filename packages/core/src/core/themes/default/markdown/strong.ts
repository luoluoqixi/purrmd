import { Extension } from '@codemirror/state';
import { EditorView } from '@codemirror/view';

import { strongFormattingClass } from '@/core/markdown';

export const strongLightTheme = (dark: boolean): Extension => {
  const strongTheme = EditorView.theme(
    {
      '.cm-content': {
        '--purrmd-formatting-strong-color': 'var(--formatting-color)',
      },
      [`.${strongFormattingClass}`]: {
        color: 'var(--purrmd-formatting-strong-color)',
      },
    },
    {
      dark,
    },
  );
  return strongTheme;
};
