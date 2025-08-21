import { Extension } from '@codemirror/state';
import { EditorView } from '@codemirror/view';

import { inlineCodeClass as inlineCode } from '@/core/markdown';

import { codeClass } from './code';

export const inlineCodeClass = inlineCode;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const inlineCodeBaseTheme = (dark: boolean): Extension => {
  const theme = EditorView.baseTheme({
    '.cm-content': {
      '--purrmd-inline-code-bg-color': 'var(--purrmd-primary-color)',
      '--purrmd-inline-code-color': 'white',
      '--purrmd-formatting-inline-code-color': 'white',
    },
    [`.${inlineCodeClass.inlineCode}`]: {
      padding: '0.14rem 0.22rem',
      borderRadius: '0.4rem',
      fontSize: '0.8rem',
      backgroundColor: 'var(--purrmd-inline-code-bg-color)',
      color: 'var(--purrmd-inline-code-color)',
    },
    [`.${inlineCodeClass.inlineCodeFormatting} .${codeClass.codeFormatting}`]: {
      color: 'var(--purrmd-formatting-inline-code-color)',
      opacity: 'var(--purrmd-formatting-opacity)',
    },
  });
  return theme;
};
