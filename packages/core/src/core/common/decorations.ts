import { Decoration } from '@codemirror/view';

export const hiddenInlineDecoration = Decoration.mark({
  class: 'purrmd-cm-hidden',
});

export const hiddenBlockDecoration = Decoration.replace({
  block: true,
});
