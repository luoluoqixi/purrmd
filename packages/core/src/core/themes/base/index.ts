import { Extension } from '@codemirror/state';
import { EditorView } from '@codemirror/view';

import { emphasisBaseTheme } from './markdown/emphasis';
import { headingBaseTheme } from './markdown/heading';
import { strongBaseTheme } from './markdown/strong';

export const base = (): Extension => {
  const baseTheme = EditorView.baseTheme({
    '.purrmd-cm-hidden': {
      fontSize: '0px',
    },
  });
  return [baseTheme, emphasisBaseTheme(), headingBaseTheme(), strongBaseTheme()];
};
