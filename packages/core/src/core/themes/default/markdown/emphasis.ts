import { Extension } from '@codemirror/state';
import { EditorView } from '@codemirror/view';

import { emphasisClass } from '../../base/markdown/emphasis';

export const emphasisLightTheme = (dark: boolean): Extension => {
  const theme = EditorView.theme(
    {
      '.cm-content': {
        '--purrmd-formatting-emphasis-color': 'var(--formatting-color)',
      },
      [`.${emphasisClass.emphasisFormatting}`]: {
        color: 'var(--purrmd-formatting-emphasis-color)',
      },
    },
    {
      dark,
    },
  );
  return theme;
};
