import { KeyBinding } from '@codemirror/view';

import { insertNewlineContinueMarkup } from './command';

export const mdMarkdownKeymap = (): KeyBinding[] => {
  return [
    { key: 'Enter', run: insertNewlineContinueMarkup },
    // { key: 'Backspace', run: deleteMarkupBackward },
  ];
};

export const markdownKeymap = (): KeyBinding[] => {
  return [];
};
