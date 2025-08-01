import { Extension } from '@codemirror/state';
import { EditorView } from '@codemirror/view';

import { base } from './base';

export const light = (config: { primaryColor: string }): Extension => {
  const lightTheme = EditorView.theme(
    {
      '.cm-content': {
        '--purrmd-primary-color': config.primaryColor,
        '--formatting-color': 'var(--purrmd-primary-color)',
      },
      '.purrmd-cm-formatting-heading': {
        color: 'var(--formatting-color)',
      },
    },
    {
      dark: false,
    },
  );
  return [base(), lightTheme];
};
