import { Tag, tags } from '@lezer/highlight';

export const markdownTags = {
  heading1: tags.heading1,
  heading2: tags.heading2,
  heading3: tags.heading3,
  heading4: tags.heading4,
  heading5: tags.heading5,
  heading6: tags.heading6,
  headerTag: Tag.define(),

  strong: tags.strong,
  emphasis: tags.emphasis,
  emphasisTag: Tag.define(),

  strikethrough: tags.strikethrough,
  strikethroughTag: Tag.define(),

  fencedCode: Tag.define(),

  codeInfo: Tag.define(),
  codeTag: Tag.define(),
};
