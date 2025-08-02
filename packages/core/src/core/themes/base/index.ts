import { Extension } from '@codemirror/state';
import { EditorView } from '@codemirror/view';

import { emphasisBaseTheme, emphasisClass } from './markdown/emphasis';
import { headingBaseTheme, headingClass } from './markdown/heading';
import { inlineCodeBaseTheme, inlineCodeClass } from './markdown/inline-code';
import { strikethroughBaseTheme, strikethroughClass } from './markdown/strikethrough';
import { strongBaseTheme, strongClass } from './markdown/strong';

export const base = (): Extension => {
  const baseTheme = EditorView.baseTheme({
    '.purrmd-cm-hidden': {
      fontSize: '0px',
    },
  });
  return [
    baseTheme,
    emphasisBaseTheme(),
    headingBaseTheme(),
    inlineCodeBaseTheme(),
    strongBaseTheme(),
    strikethroughBaseTheme(),
  ];
};

export const themeClass = {
  emphasis: emphasisClass,
  heading: headingClass,
  inlineCode: inlineCodeClass,
  strikethrough: strikethroughClass,
  strong: strongClass,
};
