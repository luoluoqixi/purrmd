import { markdown } from '@codemirror/lang-markdown';
import { languages } from '@codemirror/language-data';
import { type Extension } from '@codemirror/state';
import { GFM } from '@lezer/markdown';
import { merge } from 'ts-deepmerge';

import { heading } from './markdown';
import type { PurrMDConfig } from './types';

export const defaultConfig = (): PurrMDConfig => ({
  markdownExtConfig: {
    codeLanguages: languages,
    extensions: [GFM],
  },
});

export function purrmd(config?: PurrMDConfig): Extension {
  const mergedConfig = config
    ? merge.withOptions({ mergeArrays: false }, defaultConfig(), config)
    : defaultConfig();
  return [markdown(mergedConfig.markdownExtConfig), heading()];
}
