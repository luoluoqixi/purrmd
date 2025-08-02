import { Extension } from '@codemirror/state';
import { EditorView } from '@codemirror/view';

import { headingClass } from '../../base/markdown/heading';

export const headingLightTheme = (dark: boolean): Extension => {
  const theme = EditorView.theme(
    {
      '.cm-content': {
        '--purrmd-formatting-heading-color': 'var(--formatting-color)',
      },
      [`.${headingClass.headingFormatting}`]: {
        color: 'var(--purrmd-formatting-heading-color)',
      },
    },
    {
      dark,
    },
  );
  return theme;
};
