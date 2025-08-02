import { Extension } from '@codemirror/state';
import { EditorView } from '@codemirror/view';

import { inlineCodeClass as inlineCode } from '@/core/markdown';

export const inlineCodeClass = inlineCode;

export const inlineCodeBaseTheme = (): Extension => {
  const theme = EditorView.baseTheme({
    [`.${inlineCodeClass.inlineCode}`]: {
      padding: '0.2rem',
      borderRadius: '0.4rem',
      fontSize: '0.8rem',
      backgroundColor: 'gray',
      color: 'white',
    },
  });
  return theme;
};
