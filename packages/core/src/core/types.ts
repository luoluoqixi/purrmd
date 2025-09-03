import type { markdown } from '@codemirror/lang-markdown';

import {
  BlockquoteConfig,
  CodeBlockConfig,
  EmphasisConfig,
  HeadingConfig,
  HighlightConfig,
  HorizontalRuleConfig,
  ImageConfig,
  InlineCodeConfig,
  LinkConfig,
  ListConfig,
  StrikethroughConfig,
  StrongConfig,
} from './markdown';
import { SlashCommand } from './view/slashMenu';

export type MarkdownExtConfig = Parameters<typeof markdown>[0];

export enum PurrMDFeatures {
  Blockquote = 'Blockquote',
  CodeBlock = 'CodeBlock',
  Emphasis = 'Emphasis',
  Heading = 'Heading',
  Highlight = 'Highlight',
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
  [PurrMDFeatures.Highlight]?: HighlightConfig;
  [PurrMDFeatures.HorizontalRule]?: HorizontalRuleConfig;
  [PurrMDFeatures.Image]?: ImageConfig;
  [PurrMDFeatures.InlineCode]?: InlineCodeConfig;
  [PurrMDFeatures.Link]?: LinkConfig;
  [PurrMDFeatures.List]?: ListConfig;
  [PurrMDFeatures.Strikethrough]?: StrikethroughConfig;
  [PurrMDFeatures.Strong]?: StrongConfig;
}

export type FormattingDisplayMode = 'auto' | 'show';

export interface DefaultKeyMapsConfig {
  /** strong switch or keymap */
  strong?: boolean | string;
  /** italic switch or keymap */
  italic?: boolean | string;
  /** highlight switch or keymap */
  highlight?: boolean | string;
  /** strikethrough switch or keymap */
  strikethrough?: boolean | string;
}

export interface DefaultSlashMenuConfig {
  /** whether to show the slash menu, default is true */
  show?: boolean;
  /** slash menu title, if false, no title */
  title?: boolean | string;
  /** slash menu class name */
  className?: string;
  /** slash menu title class name */
  classNameTitle?: string;
  /** slash menu content class name */
  classNameContent?: string;
  /** slash menu item class name */
  classNameItem?: string;
  /** slash menu item active class name */
  classNameItemActive?: string;
  /** custom commands */
  customCommands?: SlashCommand[];
  /** default commands config */
  defaultCommands?: {
    heading1?: {
      show?: boolean;
      label?: string;
    };
    heading2?: {
      show?: boolean;
      label?: string;
    };
    heading3?: {
      show?: boolean;
      label?: string;
    };
    heading4?: {
      show?: boolean;
      label?: string;
    };
    heading5?: {
      show?: boolean;
      label?: string;
    };
    heading6?: {
      show?: boolean;
      label?: string;
    };
    unorderedList?: {
      show?: boolean;
      label?: string;
    };
    orderedList?: {
      show?: boolean;
      label?: string;
    };
    taskList?: {
      show?: boolean;
      label?: string;
    };
    blockquote?: {
      show?: boolean;
      label?: string;
    };
    codeBlock?: {
      show?: boolean;
      label?: string;
    };
    horizontalRule?: {
      show?: boolean;
      label?: string;
    };
    link?: {
      show?: boolean;
      label?: string;
    };
    image?: {
      show?: boolean;
      label?: string;
    };
    table?: {
      show?: boolean;
      label?: string;
    };
  };
}

export interface PurrMDConfig {
  /** markdown extension config */
  markdownExtConfig?: MarkdownExtConfig;
  /** features enable, default all are set to true. */
  features?: Partial<Record<PurrMDFeatures, boolean>>;
  /** features config */
  featuresConfigs?: PurrMDFeatureConfig;
  /** markdown formatting display mode, @default 'auto' */
  formattingDisplayMode?: FormattingDisplayMode;
  /** default keymaps @default true */
  addKeymap?: boolean;
  /** default keymaps config */
  defaultKeymaps?: DefaultKeyMapsConfig;
  /** default slash menu config */
  defaultSlashMenu?: DefaultSlashMenuConfig;
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
