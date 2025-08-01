import { markdown } from '@codemirror/lang-markdown';
import { type Extension } from '@codemirror/state';
import { merge } from 'ts-deepmerge';

import { defaultConfig, defaultThemeConfig } from './common/config';
import { emphasis, heading, strong } from './markdown';
import { base, dark, light } from './themes';
import type { PurrMDConfig, PurrMDThemeConfig } from './types';

export function purrmd(config?: PurrMDConfig): Extension {
  const defaultMdConfig = defaultConfig();
  const mergedConfig = config
    ? merge.withOptions({ mergeArrays: false }, defaultMdConfig, config)
    : defaultMdConfig;
  return [markdown(mergedConfig.markdownExtConfig), emphasis(), heading(), strong()];
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
