import { Extension } from '@codemirror/state';
import { EditorView } from '@codemirror/view';

import { codeBaseTheme } from './markdown/code';
import { emphasisBaseTheme, emphasisClass } from './markdown/emphasis';
import { fencedCodeBaseTheme } from './markdown/fenced-code';
import { headingBaseTheme, headingClass } from './markdown/heading';
import { inlineCodeBaseTheme, inlineCodeClass } from './markdown/inline-code';
import { strikethroughBaseTheme, strikethroughClass } from './markdown/strikethrough';
import { strongBaseTheme, strongClass } from './markdown/strong';

export const codeClass = {
  codeFormatting: 'purrmd-cm-formatting-code',
};

export const base = (): Extension => {
  const baseTheme = EditorView.baseTheme({
    '.purrmd-cm-hidden': {
      fontSize: '0px',
    },
  });
  return [
    baseTheme,
    codeBaseTheme(),
    emphasisBaseTheme(),
    fencedCodeBaseTheme(),
    headingBaseTheme(),
    inlineCodeBaseTheme(),
    strongBaseTheme(),
    strikethroughBaseTheme(),
  ];
};

export const themeClass = {
  codeClass,
  emphasis: emphasisClass,
  heading: headingClass,
  inlineCode: inlineCodeClass,
  strikethrough: strikethroughClass,
  strong: strongClass,
};
