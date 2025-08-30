import { Tag, tags } from '@lezer/highlight';

export const markdownTags = {
  blockquoteTag: Tag.define(),

  codeInfo: Tag.define(),
  codeTag: Tag.define(),

  contentSeparator: tags.contentSeparator,

  emphasis: tags.emphasis,
  emphasisTag: Tag.define(),

  heading1: tags.heading1,
  heading2: tags.heading2,
  heading3: tags.heading3,
  heading4: tags.heading4,
  heading5: tags.heading5,
  heading6: tags.heading6,
  headerTag: Tag.define(),

  highlight: Tag.define(),

  link: tags.link,
  linkTag: Tag.define(),
  linkTitle: Tag.define(),
  linkURLTag: Tag.define(),

  listTag: Tag.define(),

  processingInstruction: tags.processingInstruction,

  strong: tags.strong,

  strikethrough: tags.strikethrough,
  strikethroughTag: Tag.define(),

  taskTag: Tag.define(),

  // inlineCode: Tag.define(),
  // fencedCode: Tag.define(),
};
