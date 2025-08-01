import { markdown } from '@codemirror/lang-markdown';
import { languages } from '@codemirror/language-data';
import { type Extension } from '@codemirror/state';
import { GFM } from '@lezer/markdown';
import { merge } from 'ts-deepmerge';

import { heading } from './markdown';
import { base, dark, light } from './themes';
import type { PurrMDConfig, PurrMDThemeConfig } from './types';

export const defaultConfig = (): PurrMDConfig => ({
  markdownExtConfig: {
    codeLanguages: languages,
    extensions: [GFM],
  },
});

export const defaultThemeConfig = (): PurrMDThemeConfig => ({
  mode: 'light',
  primaryColor: '#84acf0',
});

export function purrmd(config?: PurrMDConfig): Extension {
  const mergedConfig = config
    ? merge.withOptions({ mergeArrays: false }, defaultConfig(), config)
    : defaultConfig();
  return [markdown(mergedConfig.markdownExtConfig), heading()];
}

export function purrmdTheme(config?: PurrMDThemeConfig): Extension {
  const defaultConfig = defaultThemeConfig();
  const mergedConfig = config
    ? merge.withOptions({ mergeArrays: false }, defaultConfig, config)
    : defaultConfig;
  mergedConfig.primaryColor = mergedConfig.primaryColor || defaultConfig.primaryColor!;
  const mode = mergedConfig.mode;
  if (mode === 'base') {
    return base();
  } else if (mode === 'light') {
    return light({
      primaryColor: mergedConfig.primaryColor,
    });
  } else if (mode === 'dark') {
    return dark({
      primaryColor: mergedConfig.primaryColor,
    });
  }
  console.error(`not support theme mode: ${mode}`);
  return [];
}
