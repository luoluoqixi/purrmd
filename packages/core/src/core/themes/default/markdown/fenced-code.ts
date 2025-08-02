import { Extension } from '@codemirror/state';
import { EditorView } from '@codemirror/view';

import { fencedCodeClass } from '../../base/markdown/fenced-code';

export const fencedCodeTheme = (dark: boolean): Extension => {
  const theme = EditorView.theme(
    {
      '.cm-content': {},
      [`.${fencedCodeClass.fencedCode}`]: {},
    },
    {
      dark,
    },
  );
  return theme;
};
