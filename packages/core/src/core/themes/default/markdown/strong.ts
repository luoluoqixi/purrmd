import { Extension } from '@codemirror/state';
import { EditorView } from '@codemirror/view';

import { emphasisClass } from '../../base/markdown/emphasis';
import { strongClass } from '../../base/markdown/strong';

export const strongTheme = (dark: boolean): Extension => {
  const theme = EditorView.theme(
    {
      '.cm-content': {
        '--purrmd-formatting-strong-color': 'var(--formatting-color)',
      },
      [`.${strongClass.strong}.${emphasisClass.emphasisFormatting}`]: {
        color: 'var(--purrmd-formatting-strong-color)',
      },
    },
    {
      dark,
    },
  );
  return theme;
};
