import { HighlightStyle, defaultHighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { Extension } from '@codemirror/state';
import { EditorView } from '@codemirror/view';

import { hiddenClass } from '@/core/common/decorations';

import { blockquoteBaseTheme } from './markdown/blockquote';
import { codeBaseTheme, codeClass } from './markdown/code';
import { codeBlockBaseTheme, codeBlockClass } from './markdown/codeBlock';
import { emphasisBaseTheme, emphasisClass } from './markdown/emphasis';
import { headingBaseTheme, headingClass } from './markdown/heading';
import { horizontalRuleBaseTheme } from './markdown/horizontalRule';
import { inlineCodeBaseTheme, inlineCodeClass } from './markdown/inlineCode';
import { linkBaseTheme } from './markdown/link';
import { listBaseTheme } from './markdown/list';
import { strikethroughBaseTheme, strikethroughClass } from './markdown/strikethrough';
import { strongBaseTheme, strongClass } from './markdown/strong';

export const base = (): Extension => {
  const baseTheme = EditorView.baseTheme({
    [`.${hiddenClass.inline}`]: {
      fontSize: '0px',
    },
  });
  return [
    baseTheme,
    syntaxHighlighting(HighlightStyle.define([...defaultHighlightStyle.specs])),
    blockquoteBaseTheme(),
    codeBaseTheme(),
    emphasisBaseTheme(),
    codeBlockBaseTheme(),
    headingBaseTheme(),
    horizontalRuleBaseTheme(),
    inlineCodeBaseTheme(),
    linkBaseTheme(),
    listBaseTheme(),
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
