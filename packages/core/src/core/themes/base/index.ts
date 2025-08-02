import { HighlightStyle, defaultHighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { Extension } from '@codemirror/state';
import { EditorView } from '@codemirror/view';

import { codeBaseTheme, codeClass } from './markdown/code';
import { codeBlockBaseTheme, codeBlockClass } from './markdown/code-block';
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
    syntaxHighlighting(HighlightStyle.define([...defaultHighlightStyle.specs])),
    codeBaseTheme(),
    emphasisBaseTheme(),
    codeBlockBaseTheme(),
    headingBaseTheme(),
    inlineCodeBaseTheme(),
    strongBaseTheme(),
    strikethroughBaseTheme(),
  ];
};

export const themeClass = {
  codeBlock: codeBlockClass,
  code: codeClass,
  emphasis: emphasisClass,
  heading: headingClass,
  inlineCode: inlineCodeClass,
  strikethrough: strikethroughClass,
  strong: strongClass,
};
