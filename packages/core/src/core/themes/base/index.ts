import { Extension } from '@codemirror/state';
import { EditorView } from '@codemirror/view';

import { headingBaseTheme } from './markdown/heading';

export const base = (): Extension => {
  const baseTheme = EditorView.baseTheme({
    '.purrmd-cm-hidden': {
      fontSize: '0px',
    },
  });
  return [baseTheme, headingBaseTheme()];
};
