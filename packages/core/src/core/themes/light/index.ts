import { Extension } from '@codemirror/state';
import { EditorView } from '@codemirror/view';

import { base } from '../base';
import { emphasisLightTheme } from './markdown/emphasis';
import { headingLightTheme } from './markdown/heading';
import { strongLightTheme } from './markdown/strong';

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
  return [base(), lightTheme, emphasisLightTheme(), headingLightTheme(), strongLightTheme()];
};
