# 命令

所有命令都在 `commands` 中

```ts
import { commands } from 'purrmd';

// 清除选中文本的所有文本格式
commands.clearAllTextFormattingCommand(view);
```

## 文本格式

- `clearAllTextFormattingCommand`

  `(view: EditorView) => boolean` - 清除选中文本的所有文本格式 （`粗体`、`斜体`、`高亮`、`删除线`、`行内代码`）

- `isAnyTextFormatting`

  `(view: EditorState) => boolean` - 检查选中文本是否都是任意文本格式 （`粗体`、`斜体`、`高亮`、`删除线`、`行内代码`）

#### 粗体

- `toggleStrongCommand`

  `(view: EditorView) => boolean` - 切换选中文本的 `粗体`

- `clearStrongCommand`

  `(view: EditorView) => boolean` - 清除选中文本的 `粗体`

- `isStrong`

  `(view: EditorState) => boolean` - 检查选中文本是否都是 `粗体`

#### 斜体

- `toggleItalicCommand`

  `(view: EditorView) => boolean` - 切换选中文本的 `斜体`

- `clearItalicCommand`

  `(view: EditorView) => boolean` - 清除选中文本的 `斜体`

- `isItalic`

  `(view: EditorState) => boolean` - 检查选中文本是否都是 `斜体`

#### 高亮

- `toggleHighlightCommand`

  `(view: EditorView) => boolean` - 切换选中文本的 `高亮`

- `clearHighlightCommand`

  `(view: EditorView) => boolean` - 清除选中文本的 `高亮`

- `isHighlight`

  `(view: EditorState) => boolean` - 检查选中文本是否都是 `高亮`

#### 删除线

- `toggleStrikethroughCommand`

  `(view: EditorView) => boolean` - 切换选中文本的 `删除线`

- `clearStrikethroughCommand`

  `(view: EditorView) => boolean` - 清除选中文本的 `删除线`

- `isStrikethrough`

  `(view: EditorState) => boolean` - 检查选中文本是否都是 `删除线`

#### 行内代码

- `toggleInlineCodeCommand`

  `(view: EditorView) => boolean` - 切换选中文本的 `行内代码`

- `clearInlineCodeCommand`

  `(view: EditorView) => boolean` - 清除选中文本的 `行内代码`

- `isInlineCode`

  `(view: EditorState) => boolean` - 检查选中文本是否都是 `行内代码`


## 段落


#### 标题

- `setHeadingCommand`

  `(level: number) => ((view: EditorView) => boolean)` - 创建一个命令，设置选中的所有行到指定的 `标题` 等级

- `setHeading1Command`

  `(view: EditorView) => boolean` - 设置选中的所有行到 `标题1` 等级

- `setHeading2Command`

  `(view: EditorView) => boolean` - 设置选中的所有行到 `标题2` 等级

- `setHeading3Command`

  `(view: EditorView) => boolean` - 设置选中的所有行到 `标题3` 等级

- `setHeading4Command`

  `(view: EditorView) => boolean` - 设置选中的所有行到 `标题4` 等级

- `setHeading5Command`

  `(view: EditorView) => boolean` - 设置选中的所有行到 `标题5` 等级

- `setHeading6Command`

  `(view: EditorView) => boolean` - 设置选中的所有行到 `标题6` 等级

- `isHeading`

  `(view: EditorState, level?: number) => boolean` - 检查选中的所有行中是否都是指定等级（或任意等级）的 `标题`

- `isHeading1`

  `(view: EditorState) => boolean` - 检查选中的所有行中是否都是 `标题1`

- `isHeading2`

  `(view: EditorState) => boolean` - 检查选中的所有行中是否都是 `标题2`

- `isHeading3`

  `(view: EditorState) => boolean` - 检查选中的所有行中是否都是 `标题3`

- `isHeading4`

  `(view: EditorState) => boolean` - 检查选中的所有行中是否都是 `标题4`

- `isHeading5`

  `(view: EditorState) => boolean` - 检查选中的所有行中是否都是 `标题5`

- `isHeading6`

  `(view: EditorState) => boolean` - 检查选中的所有行中是否都是 `标题6`

#### 正文

- `setParagraphCommand`

  `(view: EditorView) => boolean` - 设置选中的所有行到 `正文` 等级

- `isParagraph`

  `(view: EditorState) => boolean` - 检查选中的所有行中是否都是 `正文`


## 列表

- `clearAllListCommand`

  `(view: EditorView) => boolean` - 清除选中的所有行的列表 （`无序列表`、`有序列表`、`任务列表`）

#### 无序列表

- `toggleUnorderedListCommand`

  `(view: EditorView) => boolean` - 切换选中的所有行的 `无序列表`

- `clearUnorderedListCommand`

  `(view: EditorView) => boolean` - 清除选中的所有行的 `无序列表`

- `isUnorderedList`

  `(view: EditorState) => boolean` - 检查选中的所有行是否都是 `无序列表`

#### 有序列表

- `toggleOrderedListCommand`

  `(view: EditorView) => boolean` - 切换选中的所有行的 `有序列表`

- `clearOrderedListCommand`

  `(view: EditorView) => boolean` - 清除选中的所有行的 `有序列表`

- `isOrderedList`

  `(view: EditorState) => boolean` - 检查选中的所有行是否都是 `有序列表`

#### 任务列表

- `toggleTaskListCommand`

  `(view: EditorView) => boolean` - 切换选中的所有行的 `任务列表`

- `clearTaskListCommand`

  `(view: EditorView) => boolean` - 清除选中的所有行的 `任务列表`

- `isTaskList`

  `(view: EditorState) => boolean` - 检查选中的所有行是否都是 `任务列表`


## 插入

- `insertAnyText`

  `(text: string, userEvent?: string) => ((view: EditorView) => boolean)` - 创建一个插入指定文本的命令

- `insertHeading1`

  `(view: EditorView) => boolean` - 插入 `标题1`

- `insertHeading2`

  `(view: EditorView) => boolean` - 插入 `标题2`

- `insertHeading3`

  `(view: EditorView) => boolean` - 插入 `标题3`

- `insertHeading4`

  `(view: EditorView) => boolean` - 插入 `标题4`

- `insertHeading5`

  `(view: EditorView) => boolean` - 插入 `标题5`

- `insertHeading6`

  `(view: EditorView) => boolean` - 插入 `标题6`

- `insertText`

  `(view: EditorView) => boolean` - 插入 `空文本`

- `insertUnorderedList`

  `(view: EditorView) => boolean` - 插入 `无序列表`

- `insertOrderedList`

  `(view: EditorView) => boolean` - 插入 `有序列表`

- `insertTaskList`

  `(view: EditorView) => boolean` - 插入 `任务列表`

- `insertBlockquote`

  `(view: EditorView) => boolean` - 插入 `引用`

- `insertHorizontalRule`

  `(view: EditorView) => boolean` - 插入 `水平分割线`

- `insertCodeBlock`

  `(view: EditorView) => boolean` - 插入 `代码块`

- `insertTable`

  `(view: EditorView) => boolean` - 插入 `表格`

- `insertLink`

  `(view: EditorView) => boolean` - 插入 `链接`

- `insertImage`

  `(view: EditorView) => boolean` - 插入 `图片`
