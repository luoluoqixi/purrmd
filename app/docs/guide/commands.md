# Commands

All commands are located in `commands`.

```ts
import { commands } from 'purrmd';

// Clear all text formatting for the selected text
commands.clearAllTextFormattingCommand(view);
```

## Text Formatting

- `clearAllTextFormattingCommand`

  `(view: EditorView) => boolean` - Clears all text formatting (`bold`、`italic`、`highlight`、`strikethrough`、`inline code`) for the selected text.

- `isAnyTextFormatting`

  `(view: EditorState) => boolean` - Checks if the selected text has any text formatting (`bold`、`italic`、`highlight`、`strikethrough`、`inline code`).

#### Bold

- `toggleStrongCommand`

  `(view: EditorView) => boolean` - Toggles `bold` for the selected text.

- `clearStrongCommand`

  `(view: EditorView) => boolean` - Clears `bold` for the selected text.

- `isStrong`

  `(view: EditorState) => boolean` - Checks if the selected text is entirely `bold`.

#### Italic

- `toggleItalicCommand`

  `(view: EditorView) => boolean` - Toggles `italic` for the selected text.

- `clearItalicCommand`

  `(view: EditorView) => boolean` - Clears `italic` for the selected text.

- `isItalic`

  `(view: EditorState) => boolean` - Checks if the selected text is entirely `italic`.

#### Highlight

- `toggleHighlightCommand`

  `(view: EditorView) => boolean` - Toggles `highlight` for the selected text.

- `clearHighlightCommand`

  `(view: EditorView) => boolean` - Clears `highlight` for the selected text.

- `isHighlight`

  `(view: EditorState) => boolean` - Checks if the selected text is entirely `highlight`.

#### Strikethrough

- `toggleStrikethroughCommand`

  `(view: EditorView) => boolean` - Toggles `strikethrough` for the selected text.

- `clearStrikethroughCommand`

  `(view: EditorView) => boolean` - Clears `strikethrough` for the selected text.

- `isStrikethrough`

  `(view: EditorState) => boolean` - Checks if the selected text is entirely `strikethrough`.

#### Inline Code

- `toggleInlineCodeCommand`

  `(view: EditorView) => boolean` - Toggles `inline code` for the selected text.

- `clearInlineCodeCommand`

  `(view: EditorView) => boolean` - Clears `inline code` for the selected text.

- `isInlineCode`

  `(view: EditorState) => boolean` - Checks if the selected text is entirely `inline code`.


## Paragraphs


#### Headings

- `setHeadingCommand`

  `(level: number) => ((view: EditorView) => boolean)` - Creates a command to set all selected lines to the specified `heading` level.

- `setHeading1Command`

  `(view: EditorView) => boolean` - Sets all selected lines to `heading1` level.

- `setHeading2Command`

  `(view: EditorView) => boolean` - Sets all selected lines to `heading2` level.

- `setHeading3Command`

  `(view: EditorView) => boolean` - Sets all selected lines to `heading3` level.

- `setHeading4Command`

  `(view: EditorView) => boolean` - Sets all selected lines to `heading4` level.

- `setHeading5Command`

  `(view: EditorView) => boolean` - Sets all selected lines to `heading5` level.

- `setHeading6Command`

  `(view: EditorView) => boolean` - Sets all selected lines to `heading6` level.

- `isHeading`

  `(view: EditorState, level?: number) => boolean` - Checks if all selected lines are `headings` of the specified level (or any level).

- `isHeading1`

  `(view: EditorState) => boolean` - Checks if all selected lines are `heading1`.

- `isHeading2`

  `(view: EditorState) => boolean` - Checks if all selected lines are `heading2`.

- `isHeading3`

  `(view: EditorState) => boolean` - Checks if all selected lines are `heading3`.

- `isHeading4`

  `(view: EditorState) => boolean` - Checks if all selected lines are `heading4`.

- `isHeading5`

  `(view: EditorState) => boolean` - Checks if all selected lines are `heading5`.

- `isHeading6`

  `(view: EditorState) => boolean` - Checks if all selected lines are `heading6`.

#### Paragraph

- `setParagraphCommand`

  `(view: EditorView) => boolean` - Sets all selected lines to `paragraph` level.

- `isParagraph`

  `(view: EditorState) => boolean` - Checks if all selected lines are `paragraph`.


## Lists

- `clearAllListCommand`

  `(view: EditorView) => boolean` - Clears all lists (`unordered list`, `ordered list`, `task list`) for the selected lines.

#### Unordered List

- `toggleUnorderedListCommand`

  `(view: EditorView) => boolean` - Toggles `unordered list` for all selected lines.

- `clearUnorderedListCommand`

  `(view: EditorView) => boolean` - Clears `unordered list` for all selected lines.

- `isUnorderedList`

  `(view: EditorState) => boolean` - Checks if all selected lines are `unordered lists`.

#### Ordered List

- `toggleOrderedListCommand`

  `(view: EditorView) => boolean` - Toggles `ordered list` for all selected lines.

- `clearOrderedListCommand`

  `(view: EditorView) => boolean` - Clears `ordered list` for all selected lines.

- `isOrderedList`

  `(view: EditorState) => boolean` - Checks if all selected lines are `ordered lists`.

#### Task List

- `toggleTaskListCommand`

  `(view: EditorView) => boolean` - Toggles `task list` for all selected lines.

- `clearTaskListCommand`

  `(view: EditorView) => boolean` - Clears `task list` for all selected lines.

- `isTaskList`

  `(view: EditorState) => boolean` - Checks if all selected lines are `task lists`.


## Blockquote

- `toggleBlockquoteCommand`

  `(view: EditorView) => boolean` - Toggles `blockquote` for all selected lines.

- `clearBlockquoteCommand`

  `(view: EditorView) => boolean` - Clears `blockquote` for all selected lines.

- `isBlockquote`

  `(view: EditorState) => boolean` - Checks if all selected lines are `blockquote`.


## Insertion

- `insertAnyText`

  `(text: string, userEvent?: string) => ((view: EditorView) => boolean)` - Creates a command to insert the specified text.

- `insertHeading1`

  `(view: EditorView) => boolean` - Inserts `heading1`.

- `insertHeading2`

  `(view: EditorView) => boolean` - Inserts `heading2`.

- `insertHeading3`

  `(view: EditorView) => boolean` - Inserts `heading3`.

- `insertHeading4`

  `(view: EditorView) => boolean` - Inserts `heading4`.

- `insertHeading5`

  `(view: EditorView) => boolean` - Inserts `heading5`.

- `insertHeading6`

  `(view: EditorView) => boolean` - Inserts `heading6`.

- `insertText`

  `(view: EditorView) => boolean` - Inserts `plain text`.

- `insertUnorderedList`

  `(view: EditorView) => boolean` - Inserts `unordered list`.

- `insertOrderedList`

  `(view: EditorView) => boolean` - Inserts `ordered list`.

- `insertTaskList`

  `(view: EditorView) => boolean` - Inserts `task list`.

- `insertBlockquote`

  `(view: EditorView) => boolean` - Inserts `blockquote`.

- `insertHorizontalRule`

  `(view: EditorView) => boolean` - Inserts `horizontal rule`.

- `insertCodeBlock`

  `(view: EditorView) => boolean` - Inserts `code block`.

- `insertTable`

  `(view: EditorView) => boolean` - Inserts `table`.

- `insertLink`

  `(view: EditorView) => boolean` - Inserts `link`.

- `insertImage`

  `(view: EditorView) => boolean` - Inserts `image`.
