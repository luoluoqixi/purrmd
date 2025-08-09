import { markdown } from '@codemirror/lang-markdown';
import { type Extension, Prec } from '@codemirror/state';
import { keymap } from '@codemirror/view';
import { merge } from 'ts-deepmerge';

import { markdownKeymap } from './command';
import { defaultConfig, defaultThemeConfig } from './common/config';
import {
  blockquote,
  codeBlock,
  emphasis,
  heading,
  horizontalRule,
  image,
  inlineCode,
  link,
  list,
  strikethrough,
  strong,
} from './markdown';
import { base, defaultTheme } from './themes';
import type { PurrMDConfig, PurrMDThemeConfig } from './types';
import { PurrMDFeatures } from './types';

export function purrmd(config?: PurrMDConfig): Extension {
  const defaultMdConfig = defaultConfig();
  let mergedConfig = defaultMdConfig;
  if (config) {
    mergedConfig = merge.withOptions({ mergeArrays: false }, defaultMdConfig, config);
    if (config.markdownExtConfig?.extensions) {
      if (!mergedConfig.markdownExtConfig) mergedConfig.markdownExtConfig = {};
      mergedConfig.markdownExtConfig.extensions = [
        defaultMdConfig.markdownExtConfig?.extensions || [],
        config.markdownExtConfig.extensions,
      ];
    }
  }

  // 将默认的 addKeymap 禁用
  if (!mergedConfig.markdownExtConfig) mergedConfig.markdownExtConfig = {};
  const addKeymap = mergedConfig.markdownExtConfig.addKeymap !== false;
  mergedConfig.markdownExtConfig.addKeymap = false;

  const mode = mergedConfig.formattingDisplayMode || 'auto';
  const features = mergedConfig.features;
  const featuresConfigs = mergedConfig.featuresConfigs;

  return [
    markdown(mergedConfig.markdownExtConfig),
    addKeymap && Prec.high(keymap.of(markdownKeymap())),
    features?.Blockquote && blockquote(mode, featuresConfigs?.[PurrMDFeatures.Blockquote]),
    features?.CodeBlock && codeBlock(mode, featuresConfigs?.[PurrMDFeatures.CodeBlock]),
    features?.Emphasis && emphasis(mode, featuresConfigs?.[PurrMDFeatures.Emphasis]),
    features?.Heading && heading(mode, featuresConfigs?.[PurrMDFeatures.Heading]),
    features?.HorizontalRule &&
      horizontalRule(mode, featuresConfigs?.[PurrMDFeatures.HorizontalRule]),
    features?.Image && image(mode, featuresConfigs?.[PurrMDFeatures.Image]),
    features?.InlineCode && inlineCode(mode, featuresConfigs?.[PurrMDFeatures.InlineCode]),
    features?.Link && link(mode, featuresConfigs?.[PurrMDFeatures.Link]),
    features?.List && list(mode, featuresConfigs?.[PurrMDFeatures.List]),
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
