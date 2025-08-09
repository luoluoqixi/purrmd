import { HighlightStyle, defaultHighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { Extension } from '@codemirror/state';
import { EditorView } from '@codemirror/view';

import { hiddenClass } from '@/core/common/decorations';

import { blockquoteBaseTheme, blockquoteClass } from './markdown/blockquote';
import { codeBaseTheme, codeClass } from './markdown/code';
import { codeBlockBaseTheme, codeBlockClass } from './markdown/codeBlock';
import { emphasisBaseTheme, emphasisClass } from './markdown/emphasis';
import { headingBaseTheme, headingClass } from './markdown/heading';
import { horizontalRuleBaseTheme, horizontalRuleClass } from './markdown/horizontalRule';
import { imageBaseTheme } from './markdown/image';
import { inlineCodeBaseTheme, inlineCodeClass } from './markdown/inlineCode';
import { linkBaseTheme, linkClass } from './markdown/link';
import { listBaseTheme, listClass } from './markdown/list';
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
    imageBaseTheme(),
    inlineCodeBaseTheme(),
    linkBaseTheme(),
    listBaseTheme(),
    strongBaseTheme(),
    strikethroughBaseTheme(),
  ];
};

export const themeClass = {
  blockquote: blockquoteClass,
  code: codeClass,
  codeBlock: codeBlockClass,
  emphasis: emphasisClass,
  heading: headingClass,
  horizontalRule: horizontalRuleClass,
  inlineCode: inlineCodeClass,
  link: linkClass,
  list: listClass,
  strikethrough: strikethroughClass,
  strong: strongClass,
};
