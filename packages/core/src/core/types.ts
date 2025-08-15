import type { markdown } from '@codemirror/lang-markdown';

import {
  BlockquoteConfig,
  CodeBlockConfig,
  EmphasisConfig,
  HeadingConfig,
  HorizontalRuleConfig,
  ImageConfig,
  InlineCodeConfig,
  LinkConfig,
  ListConfig,
  StrikethroughConfig,
  StrongConfig,
} from './markdown';

export type MarkdownExtConfig = Parameters<typeof markdown>[0];

export enum PurrMDFeatures {
  Blockquote = 'Blockquote',
  CodeBlock = 'CodeBlock',
  Emphasis = 'Emphasis',
  Heading = 'Heading',
  HorizontalRule = 'HorizontalRule',
  Image = 'Image',
  InlineCode = 'InlineCode',
  Link = 'Link',
  List = 'List',
  Strikethrough = 'Strikethrough',
  Strong = 'Strong',
}

export interface PurrMDFeatureConfig {
  [PurrMDFeatures.Blockquote]?: BlockquoteConfig;
  [PurrMDFeatures.CodeBlock]?: CodeBlockConfig;
  [PurrMDFeatures.Emphasis]?: EmphasisConfig;
  [PurrMDFeatures.Heading]?: HeadingConfig;
  [PurrMDFeatures.HorizontalRule]?: HorizontalRuleConfig;
  [PurrMDFeatures.Image]?: ImageConfig;
  [PurrMDFeatures.InlineCode]?: InlineCodeConfig;
  [PurrMDFeatures.Link]?: LinkConfig;
  [PurrMDFeatures.List]?: ListConfig;
  [PurrMDFeatures.Strikethrough]?: StrikethroughConfig;
  [PurrMDFeatures.Strong]?: StrongConfig;
}

export type FormattingDisplayMode = 'auto' | 'show';

export interface PurrMDConfig {
  /** markdown extension config */
  markdownExtConfig?: MarkdownExtConfig;
  /** features enable, default all are set to true. */
  features?: Partial<Record<PurrMDFeatures, boolean>>;
  /** features config */
  featuresConfigs?: PurrMDFeatureConfig;
  /** markdown formatting display mode, @default 'auto' */
  formattingDisplayMode?: FormattingDisplayMode;
}

export interface PurrMDThemeConfig {
  /** theme mode @default 'light' */
  mode?: 'light' | 'dark' | 'dracula' | 'base';
  /** primary color, support 'light' or 'dark' */
  primaryColor?: string;
  /** formatting color, support 'light' or 'dark' */
  formattingColor?: string;
  /** formatting opacity @default '0.8' */
  formattingOpacity?: string;
  /** whether the theme is dark mode, default from mode */
  isDark?: boolean;
}
