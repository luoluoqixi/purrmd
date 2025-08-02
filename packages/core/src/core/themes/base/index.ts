import { HighlightStyle, defaultHighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { Extension } from '@codemirror/state';
import { EditorView } from '@codemirror/view';

import { codeBaseTheme, codeClass } from './markdown/code';
import { emphasisBaseTheme, emphasisClass } from './markdown/emphasis';
import { fencedCodeBaseTheme } from './markdown/fenced-code';
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
    syntaxHighlighting(HighlightStyle.define([...defaultHighlightStyle.specs])),
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
  code: codeClass,
  emphasis: emphasisClass,
  heading: headingClass,
  inlineCode: inlineCodeClass,
  strikethrough: strikethroughClass,
  strong: strongClass,
};
