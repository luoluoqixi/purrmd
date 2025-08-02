import { Extension } from '@codemirror/state';
import { EditorView } from '@codemirror/view';

import { codeClass } from '../../base/markdown/code';
import { codeBlockClass } from '../../base/markdown/code-block';

export const codeBlockTheme = (dark: boolean): Extension => {
  const theme = EditorView.theme(
    {
      '.cm-content': {
        '--purrmd-formatting-code-block-color': 'var(--formatting-color)',
      },
      [`.${codeBlockClass.codeBlockLine} .${codeClass.codeFormatting}`]: {
        color: 'var(--purrmd-formatting-code-block-color)',
      },
    },
    {
      dark,
    },
  );
  return theme;
};
