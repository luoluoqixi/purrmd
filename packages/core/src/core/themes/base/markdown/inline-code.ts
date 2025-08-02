import { Extension } from '@codemirror/state';
import { EditorView } from '@codemirror/view';

import { inlineCodeClass as inlineCode } from '@/core/markdown';

import { codeClass } from './code';

export const inlineCodeClass = inlineCode;

export const inlineCodeBaseTheme = (): Extension => {
  const theme = EditorView.baseTheme({
    '.cm-content': {
      '--purrmd-inline-code-bg-color': 'rgba(0, 0, 0, 0.1)',
      '--purrmd-inline-code-color': 'inherit',
      '--purrmd-formatting-inline-code-color': 'inherit',
    },
    [`.${inlineCodeClass.inlineCode}`]: {
      padding: '0.2rem',
      borderRadius: '0.4rem',
      fontSize: '0.8rem',
      backgroundColor: 'var(--purrmd-inline-code-bg-color)',
      color: 'var(--purrmd-inline-code-color)',
    },
    [`.${inlineCodeClass.inlineCode}`]: {
      backgroundColor: 'var(--purrmd-inline-code-bg-color)',
      color: 'var(--purrmd-inline-code-color)',
    },
    [`.${inlineCodeClass.inlineCodeFormatting} .${codeClass.codeFormatting}`]: {
      color: 'var(--purrmd-formatting-inline-code-color)',
    },
  });
  return theme;
};
