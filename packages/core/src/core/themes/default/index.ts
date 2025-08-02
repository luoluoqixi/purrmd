import { Extension } from '@codemirror/state';
import { EditorView } from '@codemirror/view';

import { base } from '../base';
import { emphasisTheme } from './markdown/emphasis';
import { headingTheme } from './markdown/heading';
import { inlineCodeTheme } from './markdown/inline-code';
import { strikethroughTheme } from './markdown/strikethrough';
import { strongTheme } from './markdown/strong';

export const defaultTheme = (config: {
  primaryColor: string;
  formattingColor?: string;
  dark: boolean;
}): Extension => {
  const dark = config.dark;
  const theme = EditorView.theme(
    {
      '.cm-content': {
        '--purrmd-primary-color': config.primaryColor,
        '--formatting-color': config.formattingColor
          ? config.formattingColor
          : 'var(--purrmd-primary-color)',
      },
    },
    {
      dark,
    },
  );
  return [
    base(),
    theme,
    emphasisTheme(dark),
    headingTheme(dark),
    inlineCodeTheme(dark),
    strikethroughTheme(dark),
    strongTheme(dark),
  ];
};
