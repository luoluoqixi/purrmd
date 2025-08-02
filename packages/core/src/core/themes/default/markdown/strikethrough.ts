import { Extension } from '@codemirror/state';
import { EditorView } from '@codemirror/view';

import { strikethroughClass } from '../../base/markdown/strikethrough';

export const strikethroughTheme = (dark: boolean): Extension => {
  const theme = EditorView.theme(
    {
      '.cm-content': {
        '--purrmd-formatting-strikethrough-color': 'var(--formatting-color)',
      },
      [`.${strikethroughClass.strikethroughFormatting}`]: {
        color: 'var(--purrmd-formatting-strikethrough-color)',
      },
    },
    {
      dark,
    },
  );
  return theme;
};
