import { Extension } from '@codemirror/state';
import { EditorView } from '@codemirror/view';

import { hiddenClass } from '@/core/common/decorations';

import { blockquoteBaseTheme, blockquoteClass } from './markdown/blockquote';
import { codeBaseTheme, codeClass } from './markdown/code';
import { codeBlockBaseTheme, codeBlockClass } from './markdown/codeBlock';
import { emphasisBaseTheme, emphasisClass } from './markdown/emphasis';
import { escapeBaseTheme, escapeClass } from './markdown/escape';
import { headingBaseTheme, headingClass } from './markdown/heading';
import { highlightBaseTheme } from './markdown/highlight';
import { horizontalRuleBaseTheme, horizontalRuleClass } from './markdown/horizontalRule';
import { imageBaseTheme } from './markdown/image';
import { inlineCodeBaseTheme, inlineCodeClass } from './markdown/inlineCode';
import { linkBaseTheme, linkClass } from './markdown/link';
import { listBaseTheme, listClass } from './markdown/list';
import { strikethroughBaseTheme, strikethroughClass } from './markdown/strikethrough';
import { strongBaseTheme, strongClass } from './markdown/strong';
import { slashMenuBaseTheme, slashMenuClass } from './slashMenu';

export const base = (config: {
  primaryColor: string;
  formattingColor?: string;
  dark: boolean;
}): Extension => {
  const baseTheme = EditorView.baseTheme({
    '.cm-content': {
      '--purrmd-primary-color': 'gray',
      '--purrmd-formatting-color': 'var(--purrmd-primary-color)',
      '--purrmd-formatting-opacity': '0.8',
    },
    [`.${hiddenClass.inline}`]: {
      fontSize: '0px',
    },
    // fix image block warpping
    ':is(.cm-widgetBuffer:has(+ .purrmd-cm-image-wrap), .purrmd-cm-image-wrap + .cm-widgetBuffer)':
      {
        display: 'none',
      },
  });
  const formattingColor = config.formattingColor || 'var(--purrmd-primary-color)';
  const theme = EditorView.theme(
    {
      '.cm-content': {
        '--purrmd-primary-color': config.primaryColor,
        '--purrmd-formatting-color': formattingColor,
        '--purrmd-formatting-opacity': config.formattingColor || '0.8',
      },
      '&': {
        '--purrmd-primary-color': config.primaryColor,
      },
    },
    {
      dark: config.dark,
    },
  );
  return [
    baseTheme,
    theme,
    blockquoteBaseTheme(config.dark),
    codeBaseTheme(config.dark),
    emphasisBaseTheme(config.dark),
    escapeBaseTheme(config.dark),
    codeBlockBaseTheme(config.dark),
    headingBaseTheme(config.dark),
    highlightBaseTheme(config.dark),
    horizontalRuleBaseTheme(config.dark),
    imageBaseTheme(config.dark),
    inlineCodeBaseTheme(config.dark),
    linkBaseTheme(config.dark),
    listBaseTheme(config.dark),
    strongBaseTheme(config.dark),
    strikethroughBaseTheme(config.dark),
    slashMenuBaseTheme(config.dark),
  ];
};

export const themeClass = {
  blockquote: blockquoteClass,
  code: codeClass,
  codeBlock: codeBlockClass,
  emphasis: emphasisClass,
  escape: escapeClass,
  heading: headingClass,
  horizontalRule: horizontalRuleClass,
  inlineCode: inlineCodeClass,
  link: linkClass,
  list: listClass,
  strikethrough: strikethroughClass,
  strong: strongClass,
  slashMenu: slashMenuClass,
};
