import { Extension } from '@codemirror/state';
import { EditorView } from '@codemirror/view';

import { headingFormattingClass } from '@/core/markdown';

export const headingDarkTheme = (): Extension => {
  const headingTheme = EditorView.theme(
    {
      [`.${headingFormattingClass}`]: {
        color: 'var(--formatting-color)',
      },
    },
    {
      dark: true,
    },
  );
  return headingTheme;
};
