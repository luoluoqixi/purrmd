import { Extension } from '@codemirror/state';
import { EditorView } from '@codemirror/view';

import { codeBlockClass as codeBlock } from '@/core/markdown';

import { codeClass } from './code';

export const codeBlockClass = codeBlock;

export const codeBlockBaseTheme = (): Extension => {
  const theme = EditorView.baseTheme({
    '.cm-content': {
      '--purrmd-code-block-bg-color': 'rgba(0, 0, 0, 0.05)',
      '--purrmd-code-block-border-radius': '0.5rem',
      '--purrmd-code-block-info-bg-color': 'transparent',
      '--purrmd-code-block-info-bg-color-hover': 'rgba(0, 0, 0, 0.1)',
      '--purrmd-formatting-code-block-color': 'inherit',
    },
    [`.${codeBlockClass.codeBlockLine}`]: {
      backgroundColor: 'var(--purrmd-code-block-bg-color)',
    },
    [`.${codeBlockClass.codeBlockFirstLine}`]: {
      borderTopLeftRadius: 'var(--purrmd-code-block-border-radius)',
      borderTopRightRadius: 'var(--purrmd-code-block-border-radius)',
    },
    [`.${codeBlockClass.codeBlockLastLine}`]: {
      borderBottomLeftRadius: 'var(--purrmd-code-block-border-radius)',
      borderBottomRightRadius: 'var(--purrmd-code-block-border-radius)',
    },
    [`.${codeBlockClass.codeBlockInfo}`]: {
      float: 'right',
      marginRight: '2px',
      marginTop: '2px',
      padding: '0.3rem 0.5rem',
      alignItems: 'center',
      cursor: 'default',
      borderRadius: '0.4rem',
      transition: 'background-color 0.2s ease',
      backgroundColor: 'var(--purrmd-code-block-info-bg-color)',
    },
    [`.${codeBlockClass.codeBlockInfo}:hover`]: {
      backgroundColor: 'var(--purrmd-code-block-info-bg-color-hover)',
    },
    [`.${codeBlockClass.codeBlockFirstLine} .${codeClass.codeFormatting},
      .${codeBlockClass.codeBlockLastLine} .${codeClass.codeFormatting}`]: {
      color: 'var(--purrmd-formatting-code-block-color)',
    },
  });
  return theme;
};
