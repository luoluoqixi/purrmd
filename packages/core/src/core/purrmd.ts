import { markdown } from '@codemirror/lang-markdown';
import { type Extension } from '@codemirror/state';
import { merge } from 'ts-deepmerge';

import { defaultConfig, defaultThemeConfig } from './common/config';
import { emphasis, heading, strikethrough, strong } from './markdown';
import { base, defaultTheme } from './themes';
import type { PurrMDConfig, PurrMDThemeConfig } from './types';

export function purrmd(config?: PurrMDConfig): Extension {
  const defaultMdConfig = defaultConfig();
  const mergedConfig = config
    ? merge.withOptions({ mergeArrays: false }, defaultMdConfig, config)
    : defaultMdConfig;
  return [
    markdown(mergedConfig.markdownExtConfig),
    emphasis(),
    heading(),
    strong(),
    strikethrough(),
  ];
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
  }
  if (mode !== 'dark' && mode !== 'light') {
    console.error(`not support theme mode: ${mode}`);
  }
  return defaultTheme({
    primaryColor: mergedConfig.primaryColor,
    dark: mode === 'dark',
  });
}

export { themeClass } from './themes/base';
