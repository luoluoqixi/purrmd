import { Extension } from '@codemirror/state';
import { EditorView } from '@codemirror/view';

import { codeClass } from '../../base/markdown/code';

export const codeTheme = (dark: boolean): Extension => {
  const theme = EditorView.theme(
    {
      '.cm-content': {
        '--purrmd-formatting-code-info-color': 'inherit',
      },
      [`.${codeClass.codeInfo}`]: {
        color: 'var(--purrmd-formatting-code-info-color)',
      },
    },
    {
      dark,
    },
  );
  return theme;
};
