import { Extension } from '@codemirror/state';
import { EditorView } from '@codemirror/view';

import { base } from '../base';
import { headingLightTheme } from './markdown/heading';

export const light = (config: { primaryColor: string }): Extension => {
  const lightTheme = EditorView.theme(
    {
      '.cm-content': {
        '--purrmd-primary-color': config.primaryColor,
        '--formatting-color': 'var(--purrmd-primary-color)',
      },
    },
    {
      dark: false,
    },
  );
  return [base(), lightTheme, headingLightTheme()];
};
