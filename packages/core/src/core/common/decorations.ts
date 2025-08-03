import { Decoration } from '@codemirror/view';

export const hiddenClass = {
  inline: 'purrmd-cm-hidden',
};

export const hiddenInlineDecoration = Decoration.mark({
  class: hiddenClass.inline,
});

export const hiddenBlockDecoration = Decoration.replace({
  block: true,
});
