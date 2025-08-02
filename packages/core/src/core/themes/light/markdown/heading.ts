import { Extension } from '@codemirror/state';
import { EditorView } from '@codemirror/view';

import { headingFormattingClass } from '@/core/markdown';

export const headingLightTheme = (): Extension => {
  const headingTheme = EditorView.theme(
    {
      '.cm-content': {
        '--purrmd-heading-formatting-color': 'var(--formatting-color)',
      },
      [`.${headingFormattingClass}`]: {
        color: 'var(--purrmd-heading-formatting-color)',
      },
    },
    {
      dark: false,
    },
  );
  return headingTheme;
};
