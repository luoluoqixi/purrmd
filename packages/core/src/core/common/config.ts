import { languages } from '@codemirror/language-data';
import { GFM } from '@lezer/markdown';

import { PurrMDConfig, PurrMDThemeConfig } from '../types';

export const defaultConfig = (): PurrMDConfig => ({
  markdownExtConfig: {
    codeLanguages: languages,
    extensions: [GFM],
  },
});

export const defaultThemeConfig = (): PurrMDThemeConfig => ({
  mode: 'light',
  primaryColor: '#f084d1ff',
});
