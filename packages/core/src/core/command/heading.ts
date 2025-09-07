import { EditorSelection, EditorState, StateCommand } from '@codemirror/state';

import { SelectionRangeCalculator } from './utils';

const isHeadingAllLine = (state: EditorState, level?: number): boolean => {
  const { doc, selection } = state;
  const range = selection.main;
  const fromLine = doc.lineAt(range.from);
  const toLine = doc.lineAt(range.to);

  if (level === 0) {
    const regex = /^\s*#{1,6}\s+/;

    for (let i = fromLine.number; i <= toLine.number; i++) {
      const line = doc.line(i);
      if (regex.test(line.text)) {
        return false;
      }
    }
    return true;
  }
  const regex = level ? new RegExp(`^\\s*#{${level}}\\s+`) : /^\s*#{1,6}\s+/;

  for (let i = fromLine.number; i <= toLine.number; i++) {
    const line = doc.line(i);
    if (!regex.test(line.text)) {
      return false;
    }
  }
  return true;
};

const setHeading = (level: number): StateCommand => {
  return ({ state, dispatch }): boolean => {
    const { doc, selection } = state;
    const range = selection.main;
    const fromLine = doc.lineAt(range.from);
    const toLine = doc.lineAt(range.to);

    const changes = [];
    const isOneLine = fromLine.number === toLine.number;
    let newSelection = null;
    const rangeCalculator = isOneLine ? null : new SelectionRangeCalculator(range.from, range.to);

    for (let i = fromLine.number; i <= toLine.number; i++) {
      const line = doc.line(i);
      const text = line.text.replace(/^\s*#{1,6}\s+/, '').trimStart();

      const newText = level > 0 ? `${'#'.repeat(level)} ${text}` : text;

      if (newText !== line.text) {
        changes.push({
          from: line.from,
          to: line.to,
          insert: newText,
        });
        if (isOneLine) {
          const delta = newText.length - line.text.length;
          if (delta !== 0) {
            newSelection = { anchor: range.anchor + delta, head: range.head + delta };
          }
        } else {
          rangeCalculator!.addChange(line.from, line.to, newText);
        }
      }
    }
    if (rangeCalculator) {
      const range = rangeCalculator.getRange();
      newSelection = EditorSelection.range(range.from, range.to);
    }

    if (changes.length === 0) return false;
    dispatch(
      state.update({
        changes,
        selection: newSelection || undefined,
        scrollIntoView: true,
        userEvent: 'setHeading',
      }),
    );
    return false;
  };
};

/**
 * Create a command to set the current selection to headings of a specific level or paragraphs if level is 0.
 * @param level Heading level (1-6) or 0 for paragraph
 * @returns StateCommand
 */
export const setHeadingCommand = (level: number) => setHeading(level);
/**
 * Command to set the current selection to heading 1
 */
export const setHeading1Command = setHeading(1);
/**
 * Command to set the current selection to heading 2
 */
export const setHeading2Command = setHeading(2);
/**
 * Command to set the current selection to heading 3
 */
export const setHeading3Command = setHeading(3);
/**
 * Command to set the current selection to heading 4
 */
export const setHeading4Command = setHeading(4);
/**
 * Command to set the current selection to heading 5
 */
export const setHeading5Command = setHeading(5);
/**
 * Command to set the current selection to heading 6
 */
export const setHeading6Command = setHeading(6);
/**
 * Command to set the current selection to paragraphs (not headings)
 */
export const setParagraphCommand = setHeading(0);

/**
 * Check if the current selection is all headings of a specific level or paragraphs if level is 0.
 * @param state EditorState
 * @param level Heading level (1-6) or 0 for paragraphs, if undefined checks for any heading level (1-6)
 * @returns boolean
 */
export const isHeading = (state: EditorState, level?: number) => isHeadingAllLine(state, level);
/**
 * Check if the current selection is all heading 1
 * @param state EditorState
 * @returns boolean
 */
export const isHeading1 = (state: EditorState) => isHeadingAllLine(state, 1);
/**
 * Check if the current selection is all heading 2
 * @param state EditorState
 * @returns boolean
 */
export const isHeading2 = (state: EditorState) => isHeadingAllLine(state, 2);
/**
 * Check if the current selection is all heading 3
 * @param state EditorState
 * @returns boolean
 */
export const isHeading3 = (state: EditorState) => isHeadingAllLine(state, 3);
/**
 * Check if the current selection is all heading 4
 * @param state EditorState
 * @returns boolean
 */
export const isHeading4 = (state: EditorState) => isHeadingAllLine(state, 4);
/**
 * Check if the current selection is all heading 5
 * @param state EditorState
 * @returns boolean
 */
export const isHeading5 = (state: EditorState) => isHeadingAllLine(state, 5);
/**
 * Check if the current selection is all heading 6
 * @param state EditorState
 * @returns boolean
 */
export const isHeading6 = (state: EditorState) => isHeadingAllLine(state, 6);
/**
 * Check if the current selection is all paragraphs (not headings)
 * @param state EditorState
 * @returns boolean
 */
export const isParagraph = (state: EditorState) => isHeadingAllLine(state, 0);
