import { StateCommand } from '@codemirror/state';

function insertBelow(text: string, userEvent: string): StateCommand {
  return ({ state, dispatch }) => {
    const { doc, selection } = state;
    const range = selection.main;
    const line = doc.lineAt(range.to);

    let insertText: string;
    if (range.from === range.to && line.text.length === 0) {
      insertText = text;
    } else {
      const indentMatch = line.text.match(/^(\s*)/);
      const indent = indentMatch ? indentMatch[1] : '';

      insertText = `\n${indent}${text}`;
    }

    dispatch(
      state.update({
        changes: { from: line.to, to: line.to, insert: insertText },
        selection: { anchor: line.to + insertText.length },
        scrollIntoView: true,
        userEvent,
      }),
    );

    return true;
  };
}

/**
 * Insert Any Text
 * @param text text to insert
 * @param userEvent userEvent for CM history
 * @returns StateCommand
 */
export const insertAnyText = (text: string, userEvent?: string) =>
  insertBelow(text, userEvent || 'insertAnyText');

/**
 * Insert Heading1
 */
export const insertHeading1 = insertBelow('# ', 'insertHeading1');
/**
 * Insert Heading2
 */
export const insertHeading2 = insertBelow('## ', 'insertHeading2');
/**
 * Insert Heading3
 */
export const insertHeading3 = insertBelow('### ', 'insertHeading3');
/**
 * Insert Heading4
 */
export const insertHeading4 = insertBelow('#### ', 'insertHeading4');
/**
 * Insert Heading5
 */
export const insertHeading5 = insertBelow('##### ', 'insertHeading5');
/**
 * Insert Heading6
 */
export const insertHeading6 = insertBelow('###### ', 'insertHeading6');

/**
 * Insert Text
 */
export const insertText = insertBelow('', 'insertText');

/**
 * Insert Unordered List
 */
export const insertUnorderedList = insertBelow('- ', 'insertUnorderedList');
/**
 * Insert Ordered List
 */
export const insertOrderedList = insertBelow('1. ', 'insertOrderedList');
/**
 * Insert Task List
 */
export const insertTaskList = insertBelow('- [ ] ', 'insertTaskList');

/**
 * Insert Blockquote
 */
export const insertBlockquote = insertBelow('> ', 'insertBlockquote');

/**
 * Insert Horizontal Rule
 */
export const insertHorizontalRule = insertBelow('***\n', 'insertHorizontalRule');

/**
 * Insert Code Block
 */
export const insertCodeBlock = insertBelow('```javascript\n\n```', 'insertCodeBlock');

/**
 * Insert Table
 */
export const insertTable = insertBelow(
  '| Header1 | Header2 |\n| --- | --- |\n|  |  |',
  'insertTable',
);

/**
 * Insert Link
 */
export const insertLink = insertBelow('[title](url)', 'insertLink');

/**
 * Insert Image
 */
export const insertImage = insertBelow('![alt](url)', 'insertImage');
