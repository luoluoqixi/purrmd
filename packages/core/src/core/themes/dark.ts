import { Extension } from '@codemirror/state';
import { EditorView } from '@codemirror/view';

import { base } from './base';

export const dark = (config: { primaryColor: string }): Extension => {
  const darkTheme = EditorView.theme(
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
      dark: true,
    },
  );
  return [base(), darkTheme];
};
