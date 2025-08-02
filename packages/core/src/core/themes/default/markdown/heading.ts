import { Extension } from '@codemirror/state';
import { EditorView } from '@codemirror/view';

import { headingFormattingClass } from '@/core/markdown';

export const headingLightTheme = (dark: boolean): Extension => {
  const headingTheme = EditorView.theme(
    {
      '.cm-content': {
        '--purrmd-formatting-heading-color': 'var(--formatting-color)',
      },
      [`.${headingFormattingClass}`]: {
        color: 'var(--purrmd-formatting-heading-color)',
      },
    },
    {
      dark,
    },
  );
  return headingTheme;
};
