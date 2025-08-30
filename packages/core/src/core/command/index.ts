import { KeyBinding } from '@codemirror/view';

import { insertNewlineContinueMarkup } from './newline';

export const markdownKeymap = (): KeyBinding[] => {
  return [
    { key: 'Enter', run: insertNewlineContinueMarkup },
    // { key: 'Backspace', run: deleteMarkupBackward },
  ];
};
