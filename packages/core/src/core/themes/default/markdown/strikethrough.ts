import { Extension } from '@codemirror/state';
import { EditorView } from '@codemirror/view';

import { strikethroughFormattingClass } from '@/core/markdown';

export const strikethroughLightTheme = (dark: boolean): Extension => {
  const strikethroughTheme = EditorView.theme(
    {
      '.cm-content': {
        '--purrmd-formatting-strikethrough-color': 'var(--formatting-color)',
      },
      [`.${strikethroughFormattingClass}`]: {
        color: 'var(--purrmd-formatting-strikethrough-color)',
      },
    },
    {
      dark,
    },
  );
  return strikethroughTheme;
};
