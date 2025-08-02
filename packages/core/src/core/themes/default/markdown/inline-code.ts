import { Extension } from '@codemirror/state';
import { EditorView } from '@codemirror/view';

import { codeClass } from '../../base/markdown/code';
import { inlineCodeClass } from '../../base/markdown/inline-code';

export const inlineCodeTheme = (dark: boolean): Extension => {
  const theme = EditorView.theme(
    {
      '.cm-content': {
        '--purrmd-inline-code-bg-color': 'rgba(0, 0, 0, 0.1)',
        '--purrmd-inline-code-color': 'inherit',
        '--purrmd-formatting-inline-code-color': 'var(--formatting-color)',
      },
      [`.${inlineCodeClass.inlineCode}`]: {
        backgroundColor: 'var(--purrmd-inline-code-bg-color)',
        color: 'var(--purrmd-inline-code-color)',
      },
      [`.${inlineCodeClass.inlineCodeFormatting} .${codeClass.codeFormatting}`]: {
        color: 'var(--purrmd-formatting-inline-code-color)',
      },
    },
    {
      dark,
    },
  );
  return theme;
};
