import { Extension } from '@codemirror/state';
import { EditorView } from '@codemirror/view';

import { base } from '../base';
import { blockquoteTheme } from './markdown/blockquote';
import { codeTheme } from './markdown/code';
import { codeBlockTheme } from './markdown/codeBlock';
import { emphasisTheme } from './markdown/emphasis';
import { headingTheme } from './markdown/heading';
import { horizontalRuleTheme } from './markdown/horizontalRule';
import { inlineCodeTheme } from './markdown/inlineCode';
import { linkTheme } from './markdown/link';
import { listTheme } from './markdown/list';
import { strikethroughTheme } from './markdown/strikethrough';
import { strongTheme } from './markdown/strong';

export const defaultTheme = (config: {
  primaryColor: string;
  formattingColor?: string;
  dark: boolean;
}): Extension => {
  const dark = config.dark;
  const formattingColor = config.formattingColor || 'var(--purrmd-primary-color)';
  const theme = EditorView.theme(
    {
      '.cm-content': {
        '--purrmd-primary-color': config.primaryColor,
        '--formatting-color': formattingColor,
      },
    },
    {
      dark,
    },
  );
  return [
    base(),
    theme,
    blockquoteTheme(dark),
    codeTheme(dark),
    emphasisTheme(dark),
    codeBlockTheme(dark),
    headingTheme(dark),
    horizontalRuleTheme(dark),
    inlineCodeTheme(dark),
    linkTheme(dark),
    listTheme(dark),
    strikethroughTheme(dark),
    strongTheme(dark),
  ];
};
