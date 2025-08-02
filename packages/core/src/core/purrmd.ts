import { markdown } from '@codemirror/lang-markdown';
import { type Extension } from '@codemirror/state';
import { merge } from 'ts-deepmerge';

import { defaultConfig, defaultThemeConfig } from './common/config';
import { codeBlock, emphasis, heading, inlineCode, strikethrough, strong } from './markdown';
import { base, defaultTheme } from './themes';
import type { PurrMDConfig, PurrMDThemeConfig } from './types';
import { PurrMDFeatures } from './types';

export function purrmd(config?: PurrMDConfig): Extension {
  const defaultMdConfig = defaultConfig();
  const mergedConfig = config
    ? merge.withOptions({ mergeArrays: false }, defaultMdConfig, config)
    : defaultMdConfig;
  const mode = mergedConfig.visibilityMarksMode || 'auto';
  const features = mergedConfig.features;
  const featuresConfigs = mergedConfig.featuresConfigs;
  return [
    markdown(mergedConfig.markdownExtConfig),
    features?.Emphasis && emphasis(mode, featuresConfigs?.[PurrMDFeatures.Emphasis]),
    features?.CodeBlock && codeBlock(mode, featuresConfigs?.[PurrMDFeatures.CodeBlock]),
    features?.Heading && heading(mode, featuresConfigs?.[PurrMDFeatures.Heading]),
    features?.InlineCode && inlineCode(mode, featuresConfigs?.[PurrMDFeatures.InlineCode]),
    features?.Strikethrough && strikethrough(mode, featuresConfigs?.[PurrMDFeatures.Strikethrough]),
    features?.Strong && strong(mode, featuresConfigs?.[PurrMDFeatures.Strong]),
  ].filter(Boolean) as Extension[];
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
    formattingColor: mergedConfig.formattingColor,
    dark: mode === 'dark',
  });
}

export { themeClass } from './themes/base';
