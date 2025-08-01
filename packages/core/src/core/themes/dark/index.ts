import { Extension } from '@codemirror/state';
import { EditorView } from '@codemirror/view';

import { base } from '../base';
import { headingDarkTheme } from './markdown/heading';

export const dark = (config: { primaryColor: string }): Extension => {
  const darkTheme = EditorView.theme(
    {
      '.cm-content': {
        '--purrmd-primary-color': config.primaryColor,
        '--formatting-color': 'var(--purrmd-primary-color)',
      },
    },
    {
      dark: true,
    },
  );
  return [base(), darkTheme, headingDarkTheme()];
};
