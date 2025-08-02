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
  features: {
    Blockquote: true,
    CodeBlock: true,
    Emphasis: true,
    Heading: true,
    InlineCode: true,
    Strikethrough: true,
    Strong: true,
  },
  formattingDisplayMode: 'auto',
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
        QuoteMark: markdownTags.blockquoteTag,
        HeaderMark: markdownTags.headerTag,
        EmphasisMark: markdownTags.emphasisTag,
        StrikethroughMark: markdownTags.strikethroughTag,
        // InlineCode: markdownTags.inlineCode,
        // FencedCode: markdownTags.fencedCode,
        CodeMark: markdownTags.codeTag,
        CodeInfo: markdownTags.codeInfo,
      }),
    ],
  },
];
