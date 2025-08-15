import { Extension } from '@codemirror/state';
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
  return [base(config), highlightStyle];
};
