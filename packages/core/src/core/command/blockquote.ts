import { EditorState, StateCommand } from '@codemirror/state';

import { removeAnyListPrefix, removeBlockquotePrefix } from './utils';

const isBlockquoteAllLine = (state: EditorState): boolean => {
  const { doc, selection } = state;
  const range = selection.main;
  const fromLine = doc.lineAt(range.from);
  const toLine = doc.lineAt(range.to);

  const regex = /^\s*>+\s+/;

  for (let i = fromLine.number; i <= toLine.number; i++) {
    const line = doc.line(i);
    if (!regex.test(line.text)) {
      return false;
    }
  }
  return true;
};

const toggleBlockquote = (): StateCommand => {
  return ({ state, dispatch }): boolean => {
    const { doc, selection } = state;
    const range = selection.main;
    const fromLine = doc.lineAt(range.from);
    const toLine = doc.lineAt(range.to);

    const changes = [];

    const regex1 = /^\s*>\s+/;
    const regex2 = /^\s*>/;

    const allBlockquote = isBlockquoteAllLine(state);

    for (let i = fromLine.number; i <= toLine.number; i++) {
      const line = doc.line(i);
      let newText: string;

      const lineText = removeAnyListPrefix(line.text);

      if (allBlockquote) {
        newText = lineText.replace(regex1, '');
        if (newText === lineText) {
          newText = lineText.replace(regex2, '').trimStart();
        }
      } else {
        const text = lineText;
        if (text.startsWith('>')) {
          newText = `>${text}`;
        } else {
          newText = `> ${text}`;
        }
      }

      if (newText !== lineText) {
        changes.push({
          from: line.from,
          to: line.to,
          insert: newText,
        });
      }
    }

    if (changes.length === 0) return false;
    dispatch(
      state.update({
        changes,
        scrollIntoView: true,
        userEvent: 'toggleBlockquote',
      }),
    );
    return false;
  };
};

const clearBlockquote = (): StateCommand => {
  return ({ state, dispatch }): boolean => {
    const { doc, selection } = state;
    const range = selection.main;
    const fromLine = doc.lineAt(range.from);
    const toLine = doc.lineAt(range.to);

    const changes = [];

    for (let i = fromLine.number; i <= toLine.number; i++) {
      const line = doc.line(i);
      const newText = removeBlockquotePrefix(line.text);

      if (newText !== line.text) {
        changes.push({
          from: line.from,
          to: line.to,
          insert: newText,
        });
      }
    }

    if (changes.length === 0) return false;
    dispatch(
      state.update({
        changes,
        scrollIntoView: true,
        userEvent: 'clearBlockquote',
      }),
    );
    return false;
  };
};

/**
 * Command to set the current selection to blockquote
 */
export const toggleBlockquoteCommand = toggleBlockquote();

/**
 * Command to clear the current selection to blockquote
 */
export const clearBlockquoteCommand = clearBlockquote();

/**
 * Check if the current selection is all blockquote
 * @param state EditorState
 * @returns boolean
 */
export const isBlockquote = (state: EditorState) => isBlockquoteAllLine(state);
