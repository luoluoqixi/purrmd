import { languages } from '@codemirror/language-data';
import { styleTags } from '@lezer/highlight';
import { GFM, MarkdownExtension } from '@lezer/markdown';

import { PurrMDConfig, PurrMDThemeConfig } from '../types';
import { markdownTags } from './tags';

export const defaultConfig = (extensions?: MarkdownExtension[]): PurrMDConfig => ({
  markdownExtConfig: {
    codeLanguages: languages,
    extensions: [GFM, getMarkdownSyntaxTags(), ...(extensions || [])],
  },
});

export const defaultThemeConfig = (): PurrMDThemeConfig => ({
  mode: 'light',
  primaryColor: '#f084d1ff',
});

const getMarkdownSyntaxTags = (): MarkdownExtension => [
  {
    defineNodes: [],
    props: [
      styleTags({
        HeaderMark: markdownTags.headerTag,
        EmphasisMark: markdownTags.emphasisTag,
        StrikethroughMark: markdownTags.strikethroughTag,
        InlineCode: markdownTags.inlineCode,
        CodeMark: markdownTags.codeTag,
        FencedCode: markdownTags.fencedCode,
        CodeInfo: markdownTags.codeInfo,
      }),
    ],
  },
];
