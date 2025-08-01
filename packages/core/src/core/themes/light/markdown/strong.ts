import { Extension } from '@codemirror/state';
import { EditorView } from '@codemirror/view';

import { strongFormattingClass } from '@/core/markdown';

export const strongLightTheme = (): Extension => {
  const strongTheme = EditorView.theme(
    {
      [`.${strongFormattingClass}`]: {
        color: 'var(--formatting-color)',
      },
    },
    {
      dark: false,
    },
  );
  return strongTheme;
};
