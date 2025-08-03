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
    HorizontalRule: true,
    InlineCode: true,
    Link: true,
    List: true,
    Strikethrough: true,
    Strong: true,
  },
  formattingDisplayMode: 'auto',
});

export const defaultThemeConfig = (): PurrMDThemeConfig => ({
  mode: 'light',
  primaryColor: '#ab35ff',
});

const getMarkdownSyntaxTags = (): MarkdownExtension => [
  {
    defineNodes: [],
    props: [
      styleTags({
        CodeMark: markdownTags.codeTag,
        CodeInfo: markdownTags.codeInfo,
        EmphasisMark: markdownTags.emphasisTag,
        HeaderMark: markdownTags.headerTag,
        URL: markdownTags.linkURLTag,
        LinkMark: markdownTags.linkTag,
        LinkTitle: markdownTags.linkTitle,
        ListMark: markdownTags.listTag,
        QuoteMark: markdownTags.blockquoteTag,
        StrikethroughMark: markdownTags.strikethroughTag,
        TaskMarker: markdownTags.taskTag,
        // InlineCode: markdownTags.inlineCode,
        // FencedCode: markdownTags.fencedCode,
      }),
    ],
  },
];
