import { StateCommand } from '@codemirror/state';
import { KeyBinding } from '@codemirror/view';

import { DefaultKeyMapsConfig } from '../types';
import {
  insertNewlineContinueMarkup,
  toggleHighlightCommand,
  toggleItalicCommand,
  toggleStrikethroughCommand,
  toggleStrongCommand,
} from './command';

export const mdMarkdownKeymap = (): KeyBinding[] => {
  return [
    { key: 'Enter', run: insertNewlineContinueMarkup },
    // { key: 'Backspace', run: deleteMarkupBackward },
  ];
};

export const markdownKeymap = (config?: DefaultKeyMapsConfig): KeyBinding[] => {
  const getKeyBinding = (
    keymap: string | boolean | undefined,
    defaultKeymap: string,
    command: StateCommand,
  ): KeyBinding | null => {
    if (keymap === false) return null;
    const key = typeof keymap === 'string' ? keymap : defaultKeymap;
    return { key, run: command };
  };
  return [
    getKeyBinding(config?.strong, 'Mod-b', toggleStrongCommand),
    getKeyBinding(config?.italic, 'Mod-i', toggleItalicCommand),
    getKeyBinding(config?.strikethrough, 'Mod-d', toggleStrikethroughCommand),
    getKeyBinding(config?.highlight, 'Mod-h', toggleHighlightCommand),
  ].filter((x) => x != null);
};
