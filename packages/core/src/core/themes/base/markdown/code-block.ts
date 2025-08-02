import { Extension } from '@codemirror/state';
import { EditorView } from '@codemirror/view';

import { codeBlockClass as codeBlock } from '@/core/markdown';

export const codeBlockClass = codeBlock;

export const codeBlockBaseTheme = (): Extension => {
  const theme = EditorView.baseTheme({
    [`.${codeBlockClass.codeBlockLine}`]: {
      backgroundColor: 'rgba(0, 0, 0, 0.05)',
    },
    [`.${codeBlockClass.codeBlockFirstLine}`]: {
      borderTopLeftRadius: '0.5rem',
      borderTopRightRadius: '0.5rem',
    },
    [`.${codeBlockClass.codeBlockLastLine}`]: {
      borderBottomLeftRadius: '0.5rem',
      borderBottomRightRadius: '0.5rem',
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
    },
    [`.${codeBlockClass.codeBlockInfo}:hover`]: {
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
    },
  });
  return theme;
};
