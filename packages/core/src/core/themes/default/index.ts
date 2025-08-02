import { Extension } from '@codemirror/state';
import { EditorView } from '@codemirror/view';

import { base } from '../base';
import { emphasisLightTheme } from './markdown/emphasis';
import { headingLightTheme } from './markdown/heading';
import { strikethroughLightTheme } from './markdown/strikethrough';
import { strongLightTheme } from './markdown/strong';

export const defaultTheme = (config: { primaryColor: string; dark: boolean }): Extension => {
  const dark = config.dark;
  const theme = EditorView.theme(
    {
      '.cm-content': {
        '--purrmd-primary-color': config.primaryColor,
        '--formatting-color': 'var(--purrmd-primary-color)',
      },
    },
    {
      dark,
    },
  );
  return [
    base(),
    theme,
    emphasisLightTheme(dark),
    headingLightTheme(dark),
    strongLightTheme(dark),
    strikethroughLightTheme(dark),
  ];
};
