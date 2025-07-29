import type { markdown } from '@codemirror/lang-markdown';

export type MarkdownExtConfig = Parameters<typeof markdown>[0];

export interface PurrMDConfig {
  markdownExtConfig?: MarkdownExtConfig;
}
