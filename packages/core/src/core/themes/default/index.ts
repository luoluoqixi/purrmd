import { Extension } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { dracula } from '@uiw/codemirror-theme-dracula';
import { vscodeDark, vscodeLight } from '@uiw/codemirror-theme-vscode';

import { base } from '../base';

export const defaultTheme = (config: {
  primaryColor: string;
  formattingColor?: string;
  mode: 'light' | 'dark' | 'dracula';
  dark: boolean;
}): Extension => {
  const highlightStyle =
    config.mode === 'dark' ? vscodeDark : config.mode === 'dracula' ? dracula : vscodeLight;
  const theme = EditorView.theme({
    '&': { color: config.dark ? '#dadada' : '#383a42' },
  });
  return [theme, base(config), highlightStyle];
};
