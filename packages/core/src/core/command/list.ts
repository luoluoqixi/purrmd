import { EditorState, StateCommand } from '@codemirror/state';

import {
  allMatch,
  emptyRegex,
  regexOrderedList,
  regexTaskList,
  regexUnorderedList,
  removeAnyListPrefix,
} from './utils';

/**
 * Check if all selected lines are unordered list items
 * @param state EditorState
 * @returns boolean  Whether all selected lines match the list type
 */
export const isUnorderedList = (state: EditorState) => {
  return allMatch(state, regexUnorderedList);
};

/**
 * Check if all selected lines are ordered list items
 * @param state EditorState
 * @returns boolean  Whether all selected lines match the list type
 */
export const isOrderedList = (state: EditorState) => {
  return allMatch(state, regexOrderedList);
};

/**
 * Check if all selected lines are task list items
 * @param state EditorState
 * @returns boolean  Whether all selected lines match the list type
 */
export const isTaskList = (state: EditorState) => {
  return allMatch(state, regexTaskList);
};

/**
 * toggle Unordered List
 */
export const toggleUnorderedListCommand: StateCommand = ({ state, dispatch }) => {
  const regex = regexUnorderedList;
  const regex2 = emptyRegex;
  const allUnordered = allMatch(state, regex);

  const { doc, selection } = state;
  const range = selection.main;
  const fromLine = doc.lineAt(range.from);
  const toLine = doc.lineAt(range.to);

  const changes = [];

  for (let i = fromLine.number; i <= toLine.number; i++) {
    const line = doc.line(i);
    const lineText = line.text;
    let newText: string;
    if (allUnordered) {
      newText = lineText.replace(regex, (_, indent) => indent);
    } else {
      newText = removeAnyListPrefix(lineText);
      newText = newText.replace(regex2, (_, indent) => `${indent}- `);
    }
    if (newText !== lineText) {
      changes.push({ from: line.from, to: line.to, insert: newText });
    }
  }

  if (!changes.length) return false;
  dispatch(state.update({ changes, scrollIntoView: true, userEvent: 'toggleUnorderedList' }));
  return true;
};

/**
 * toggle Ordered List
 */
export const toggleOrderedListCommand: StateCommand = ({ state, dispatch }) => {
  const regex = regexOrderedList;
  const regex2 = emptyRegex;
  const allOrdered = allMatch(state, regex);

  const { doc, selection } = state;
  const range = selection.main;
  const fromLine = doc.lineAt(range.from);
  const toLine = doc.lineAt(range.to);

  const changes = [];

  let counter = 1;

  for (let i = fromLine.number; i <= toLine.number; i++) {
    const line = doc.line(i);
    const lineText = line.text;
    let newText: string;
    if (allOrdered) {
      newText = lineText.replace(regex, (_, indent) => indent);
    } else {
      newText = removeAnyListPrefix(lineText);
      newText = newText.replace(regex2, (_, indent) => `${indent}${counter}. `);
    }
    counter++;
    if (newText !== lineText) {
      changes.push({ from: line.from, to: line.to, insert: newText });
    }
  }

  if (!changes.length) return false;
  dispatch(state.update({ changes, scrollIntoView: true, userEvent: 'toggleOrderedList' }));
  return true;
};

/**
 * toggle Task List
 */
export const toggleTaskListCommand: StateCommand = ({ state, dispatch }) => {
  const regex = regexTaskList;
  const regex2 = emptyRegex;
  const allTasks = allMatch(state, regex);

  const { doc, selection } = state;
  const range = selection.main;
  const fromLine = doc.lineAt(range.from);
  const toLine = doc.lineAt(range.to);

  const changes = [];

  for (let i = fromLine.number; i <= toLine.number; i++) {
    const line = doc.line(i);
    const lineText = line.text;
    let newText: string;
    if (allTasks) {
      newText = lineText.replace(regex, (_, indent) => indent);
    } else {
      newText = removeAnyListPrefix(lineText);
      newText = newText.replace(regex2, (_, indent) => `${indent}- [ ] `);
    }
    if (newText !== lineText) {
      changes.push({ from: line.from, to: line.to, insert: newText });
    }
  }

  if (!changes.length) return false;
  dispatch(state.update({ changes, scrollIntoView: true, userEvent: 'toggleTaskList' }));
  return true;
};

/**
 * Clear Unordered List
 */
export const clearUnorderedListCommand: StateCommand = ({ state, dispatch }) => {
  const { doc, selection } = state;
  const range = selection.main;
  const fromLine = doc.lineAt(range.from);
  const toLine = doc.lineAt(range.to);

  const regex = regexUnorderedList;
  const changes = [];

  for (let i = fromLine.number; i <= toLine.number; i++) {
    const line = doc.line(i);
    const newText = line.text.replace(regex, (_, indent) => indent);
    if (newText !== line.text) {
      changes.push({ from: line.from, to: line.to, insert: newText });
    }
  }

  if (!changes.length) return false;
  dispatch(state.update({ changes, scrollIntoView: true, userEvent: 'clearUnorderedList' }));
  return true;
};

/**
 * Clear Ordered List
 */
export const clearOrderedListCommand: StateCommand = ({ state, dispatch }) => {
  const { doc, selection } = state;
  const range = selection.main;
  const fromLine = doc.lineAt(range.from);
  const toLine = doc.lineAt(range.to);

  const regex = regexOrderedList;
  const changes = [];

  for (let i = fromLine.number; i <= toLine.number; i++) {
    const line = doc.line(i);
    const newText = line.text.replace(regex, (_, indent) => indent);
    if (newText !== line.text) {
      changes.push({ from: line.from, to: line.to, insert: newText });
    }
  }

  if (!changes.length) return false;
  dispatch(state.update({ changes, scrollIntoView: true, userEvent: 'clearOrderedList' }));
  return true;
};

/**
 * Clear Task List
 */
export const clearTaskListCommand: StateCommand = ({ state, dispatch }) => {
  const { doc, selection } = state;
  const range = selection.main;
  const fromLine = doc.lineAt(range.from);
  const toLine = doc.lineAt(range.to);

  const regex = regexTaskList;
  const changes = [];

  for (let i = fromLine.number; i <= toLine.number; i++) {
    const line = doc.line(i);
    const newText = line.text.replace(regex, (_, indent) => indent);
    if (newText !== line.text) {
      changes.push({ from: line.from, to: line.to, insert: newText });
    }
  }

  if (!changes.length) return false;
  dispatch(state.update({ changes, scrollIntoView: true, userEvent: 'clearTaskList' }));
  return true;
};

/**
 * Clear All List (Unordered, Ordered, Task)
 */
export const clearAllListCommand: StateCommand = ({ state, dispatch }) => {
  const { doc, selection } = state;
  const range = selection.main;
  const fromLine = doc.lineAt(range.from);
  const toLine = doc.lineAt(range.to);

  const changes = [];

  for (let i = fromLine.number; i <= toLine.number; i++) {
    const line = doc.line(i);
    const newText = removeAnyListPrefix(line.text);
    if (newText !== line.text) {
      changes.push({ from: line.from, to: line.to, insert: newText });
    }
  }

  if (!changes.length) return false;
  dispatch(state.update({ changes, scrollIntoView: true, userEvent: 'clearAllList' }));
  return true;
};
