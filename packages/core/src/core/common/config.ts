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
    Highlight: true,
    HorizontalRule: true,
    Image: true,
    InlineCode: true,
    Link: true,
    List: true,
    Strikethrough: true,
    Strong: true,
  },
  formattingDisplayMode: 'auto',
  addKeymap: true,
});

export const defaultThemeConfig = (): PurrMDThemeConfig => ({
  mode: 'light',
  primaryColor: '#e957b6',
});

const getMarkdownSyntaxTags = (): MarkdownExtension => {
  const HighlightDelim = { resolve: 'Highlight', mark: 'HighlightMark' };
  return [
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
    {
      defineNodes: ['Highlight', 'HighlightMark'],
      parseInline: [
        {
          name: 'Highlight',
          parse(cx, next, pos) {
            if (next != 61 /* '=' */ || cx.char(pos + 1) != 61) {
              return -1;
            }
            return cx.addDelimiter(HighlightDelim, pos, pos + 2, true, true);
          },
          after: 'Emphasis',
        },
      ],
      props: [
        styleTags({
          // eslint-disable-next-line quote-props
          HighlightMark: markdownTags.emphasisTag,
          'Highlight/...': markdownTags.highlight,
        }),
      ],
    },
  ];
};
