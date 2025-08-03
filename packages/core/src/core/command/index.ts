import { KeyBinding } from '@codemirror/view';

import { insertNewlineContinueMarkup } from './command';

export const markdownKeymap = (): KeyBinding[] => {
  return [
    { key: 'Enter', run: insertNewlineContinueMarkup },
    // { key: 'Backspace', run: deleteMarkupBackward },
  ];
};
