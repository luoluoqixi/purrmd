import { Extension } from '@codemirror/state';
import { EditorView } from '@codemirror/view';

import { emphasisFormattingClass } from '@/core/markdown';

export const emphasisLightTheme = (): Extension => {
  const emphasisTheme = EditorView.theme(
    {
      [`.${emphasisFormattingClass}`]: {
        color: 'var(--formatting-color)',
      },
    },
    {
      dark: false,
    },
  );
  return emphasisTheme;
};
