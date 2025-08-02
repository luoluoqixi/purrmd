import type { markdown } from '@codemirror/lang-markdown';

import {
  CodeBlockConfig,
  EmphasisConfig,
  HeadingConfig,
  InlineCodeConfig,
  StrikethroughConfig,
  StrongConfig,
} from './markdown';

export type MarkdownExtConfig = Parameters<typeof markdown>[0];

export enum PurrMDFeatures {
  CodeBlock = 'CodeBlock',
  Emphasis = 'Emphasis',
  Heading = 'Heading',
  InlineCode = 'InlineCode',
  Strikethrough = 'Strikethrough',
  Strong = 'Strong',
}

export interface PurrMDFeatureConfig {
  [PurrMDFeatures.CodeBlock]?: CodeBlockConfig;
  [PurrMDFeatures.Emphasis]?: EmphasisConfig;
  [PurrMDFeatures.Heading]?: HeadingConfig;
  [PurrMDFeatures.InlineCode]?: InlineCodeConfig;
  [PurrMDFeatures.Strikethrough]?: StrikethroughConfig;
  [PurrMDFeatures.Strong]?: StrongConfig;
}

export type VisibilityMarksMode = 'auto' | 'show';

export interface PurrMDConfig {
  markdownExtConfig?: MarkdownExtConfig;
  features?: Partial<Record<PurrMDFeatures, boolean>>;
  featuresConfigs?: PurrMDFeatureConfig;
  visibilityMarksMode?: VisibilityMarksMode;
}

export interface PurrMDThemeConfig {
  /** theme mode @default 'light' */
  mode?: 'light' | 'dark' | 'base';
  /** primary color, support 'light' or 'dark' */
  primaryColor?: string;
  /** formatting color, support 'light' or 'dark' */
  formattingColor?: string;
}
