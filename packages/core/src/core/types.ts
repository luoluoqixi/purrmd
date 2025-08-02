import type { markdown } from '@codemirror/lang-markdown';

export type MarkdownExtConfig = Parameters<typeof markdown>[0];

export interface PurrMDConfig {
  markdownExtConfig?: MarkdownExtConfig;
}

export interface PurrMDThemeConfig {
  /** theme mode @default 'light' */
  mode?: 'light' | 'dark' | 'base';
  /** primary color, support 'light' or 'dark' */
  primaryColor?: string;
  /** formatting color, support 'light' or 'dark' */
  formattingColor?: string;
}
