import { syntaxTree } from '@codemirror/language';
import { EditorSelection, EditorState, StateCommand } from '@codemirror/state';
import { Tree } from '@lezer/common';

import { iterParentNodes, iterSubNodes } from '../utils';
import { SelectionRangeCalculator } from './utils';

export const textFormattingKeys = [
  'Strong',
  'Italic',
  'Strikethrough',
  'Highlight',
  'InlineCode',
] as const;

export type TextFormattingKeyType = (typeof textFormattingKeys)[number];

const textFormattingNodeTypes = [
  'StrongEmphasis',
  'Emphasis',
  'Strikethrough',
  'Highlight',
  'InlineCode',
] as const;

type TextFormattingNodeType = (typeof textFormattingNodeTypes)[number];

const textFormattingConfig: Record<TextFormattingKeyType, FormattingConfig> = {
  Strong: {
    nodeType: 'StrongEmphasis',
    subType: 'EmphasisMark',
    markup: '**',
    placeholder: '',
  },
  Italic: {
    nodeType: 'Emphasis',
    subType: 'EmphasisMark',
    markup: '*',
    placeholder: '',
  },
  Highlight: {
    nodeType: 'Highlight',
    subType: 'HighlightMark',
    markup: '==',
    placeholder: '',
  },
  Strikethrough: {
    nodeType: 'Strikethrough',
    subType: 'StrikethroughMark',
    markup: '~~',
    placeholder: '',
  },
  InlineCode: {
    nodeType: 'InlineCode',
    subType: 'CodeMark',
    markup: '`',
    placeholder: '',
  },
};

interface FormattingConfig {
  nodeType: TextFormattingNodeType;
  subType: string;
  markup: string;
  placeholder?: string;
}

interface UpdataChange {
  from: number;
  to: number;
  insert: string;
}

const removeRangeMarkups = (
  tree: Tree,
  from: number,
  to: number,
  config: FormattingConfig,
  rangeCalculator: SelectionRangeCalculator,
  updateChanges: UpdataChange[],
  deleteCount?: number,
  lineText?: string | null,
): string | undefined | null => {
  let delCount = deleteCount == null ? 0 : deleteCount;
  tree.iterate({
    from,
    to,
    enter: (node) => {
      if (node.type.name === config.nodeType) {
        iterSubNodes(node.node, config.subType, (sub) => {
          if (sub.node.parent == null || sub.node.parent.type.name !== config.nodeType) {
            return;
          }
          updateChanges.push({
            from: sub.from,
            to: sub.to,
            insert: '',
          });
          rangeCalculator.addDeletion(sub.from, sub.to);

          const start = sub.from - from - delCount;
          const length = sub.to - sub.from;
          if (lineText != null) {
            lineText = lineText.substring(0, start) + lineText.substring(start + length);
          }
          delCount += length;
        });
      }
    },
  });
  return lineText;
};

const isCharInMarkup = (
  tree: Tree,
  from: number,
  nodeType: TextFormattingNodeType | TextFormattingNodeType[],
  to?: number,
) => {
  to = to == null ? from : to;
  const isArray = Array.isArray(nodeType);
  let charInMarkup = false;
  tree.iterate({
    from,
    to,
    enter: (node) => {
      if (isArray) {
        if (nodeType.includes(node.type.name as TextFormattingNodeType)) {
          charInMarkup = true;
        } else {
          iterParentNodes(node.node, nodeType, () => {
            charInMarkup = true;
          });
        }
      } else {
        if (node.type.name === nodeType) {
          charInMarkup = true;
        } else {
          iterParentNodes(node.node, nodeType, () => {
            charInMarkup = true;
          });
        }
      }
    },
  });
  return charInMarkup;
};

const toggleTextFormattingCommand =
  (config: FormattingConfig): StateCommand =>
  ({ state, dispatch }): boolean => {
    const { selection, doc } = state;
    const changes: { from: number; to: number; insert: string }[] = [];
    const newRanges: { from: number; to: number }[] = [];
    const nodeType = config.nodeType;
    const tree = syntaxTree(state);

    const range = selection.main;

    if (range.empty) {
      const pos = range.from;
      const charInMarkup = isCharInMarkup(tree, pos, nodeType);
      if (charInMarkup) {
        const updateChanges: UpdataChange[] = [];
        const rangeCalculator = new SelectionRangeCalculator(pos, pos);
        removeRangeMarkups(tree, pos, pos, config, rangeCalculator, updateChanges);
        changes.push(...updateChanges);
        const to = rangeCalculator.getRange().to;
        newRanges.push({
          from: to,
          to,
        });
      } else {
        const insertText = `${config.markup}${config.placeholder || ''}${config.markup}`;
        changes.push({
          from: range.from,
          to: range.to,
          insert: insertText,
        });
        const cursorPos = range.from + config.markup.length;
        newRanges.push({
          from: cursorPos,
          to: cursorPos + (config.placeholder?.length || 0),
        });
      }
    } else {
      const fromLine = doc.lineAt(range.from);
      const toLine = doc.lineAt(range.to);

      let notInAllMarkup = false;
      const linesToProcess = [];
      for (let i = fromLine.number; i <= toLine.number; i++) {
        const line = doc.line(i);
        const lineStart = Math.max(range.from, line.from);
        const lineEnd = Math.min(range.to, line.to);
        if (lineStart < lineEnd) {
          let allMarkup = true;
          const lineTextStart = line.text.trimStart();
          const lineTextEnd = line.text.trimEnd();
          const startOffset = line.text.length - lineTextStart.length;
          const endOffset = line.text.length - lineTextEnd.length;
          for (let pos = lineStart + startOffset; pos < lineEnd - endOffset; pos++) {
            if (!isCharInMarkup(tree, pos, nodeType)) {
              allMarkup = false;
              break;
            }
          }

          linesToProcess.push({
            from: lineStart,
            to: lineEnd,
            allMarkup,
          });
          if (!allMarkup) {
            notInAllMarkup = true;
          }
        }
      }

      const targetAddMarkup = notInAllMarkup;
      const updateChanges: UpdataChange[] = [];
      const rangeCalculator = new SelectionRangeCalculator(range.from, range.to);

      const lineCount = linesToProcess.length;
      linesToProcess.forEach((lineProcess, index) => {
        const { from, to } = lineProcess;
        let lineText = doc.sliceString(from, to);
        let deleteCount = 0;

        // remove markup
        const newLineText = removeRangeMarkups(
          tree,
          from,
          to,
          config,
          rangeCalculator,
          updateChanges,
          deleteCount,
          lineText,
        )!;
        deleteCount += lineText.length - newLineText.length;
        lineText = newLineText;

        if (targetAddMarkup) {
          // add markup
          let newText;
          const t = lineText.trimStart();
          if (t.length < lineText.length) {
            const s = lineText.substring(0, lineText.length - t.length);
            newText = `${s}${config.markup}${t}${config.markup}`;
          } else {
            newText = `${config.markup}${lineText}${config.markup}`;
          }
          rangeCalculator.addInsertion(from, config.markup.length);
          if (index < lineCount - 1) {
            rangeCalculator.addInsertion(to, config.markup.length);
          }
          updateChanges.push({
            from,
            to,
            insert: newText,
          });
        }
      });

      changes.push(...updateChanges);
      newRanges.push(rangeCalculator.getRange());
    }

    if (changes.length > 0) {
      const transaction = state.update({
        changes,
        selection: EditorSelection.create(
          newRanges.map((range) => EditorSelection.range(range.from, range.to)),
        ),
      });

      dispatch(transaction);
      return true;
    }

    return false;
  };

const clearTextFormattingCommand = (nodeKeys: TextFormattingKeyType[]): StateCommand => {
  return ({ state, dispatch }) => {
    const { selection, doc } = state;
    const changes: { from: number; to: number; insert: string }[] = [];
    const newRanges: { from: number; to: number }[] = [];
    const tree = syntaxTree(state);
    const nodeTypes = nodeKeys.map((key) => textFormattingConfig[key].nodeType);

    const range = selection.main;
    if (range.empty) {
      const pos = range.from;
      const charInMarkup = isCharInMarkup(tree, pos, nodeTypes);
      if (charInMarkup) {
        const updateChanges: UpdataChange[] = [];
        const rangeCalculator = new SelectionRangeCalculator(pos, pos);
        for (let i = 0; i < nodeKeys.length; i++) {
          const nodeKey = nodeKeys[i];
          const config = textFormattingConfig[nodeKey];
          removeRangeMarkups(tree, pos, pos, config, rangeCalculator, updateChanges);
        }
        changes.push(...updateChanges);
        const to = rangeCalculator.getRange().to;
        newRanges.push({
          from: to,
          to,
        });
      }
    } else {
      const fromLine = doc.lineAt(range.from);
      const toLine = doc.lineAt(range.to);

      const linesToProcess = [];
      for (let i = fromLine.number; i <= toLine.number; i++) {
        const line = doc.line(i);
        const lineStart = Math.max(range.from, line.from);
        const lineEnd = Math.min(range.to, line.to);
        if (lineStart < lineEnd) {
          linesToProcess.push({
            from: lineStart,
            to: lineEnd,
          });
        }
      }

      const updateChanges: UpdataChange[] = [];
      const rangeCalculator = new SelectionRangeCalculator(range.from, range.to);

      linesToProcess.forEach((lineProcess) => {
        const { from, to } = lineProcess;
        const lineText = doc.sliceString(from, to);
        let deleteCount = 0;

        for (let i = 0; i < nodeKeys.length; i++) {
          const nodeType = nodeKeys[i];
          const config = textFormattingConfig[nodeType];
          const newLineText = removeRangeMarkups(
            tree,
            from,
            to,
            config,
            rangeCalculator,
            updateChanges,
            deleteCount,
            lineText,
          )!;
          deleteCount += lineText.length - newLineText.length;
        }
      });

      changes.push(...updateChanges);
      newRanges.push(rangeCalculator.getRange());
    }

    if (changes.length > 0) {
      const transaction = state.update({
        changes,
        selection: EditorSelection.create(
          newRanges.map((range) => EditorSelection.range(range.from, range.to)),
        ),
      });

      dispatch(transaction);
      return true;
    }

    return false;
  };
};

const isTextFormattingCommand = (
  state: EditorState,
  allRange: boolean,
  nodeTypes: TextFormattingNodeType[],
): boolean => {
  const { selection, doc } = state;
  let has = true;
  const tree = syntaxTree(state);
  const range = selection.main;
  if (range.empty) {
    const pos = range.from;
    const charInMarkup = isCharInMarkup(tree, pos, nodeTypes);
    if (!charInMarkup) {
      has = false;
    }
  } else {
    const fromLine = doc.lineAt(range.from);
    const toLine = doc.lineAt(range.to);
    let notInAllMarkup = false;
    for (let i = fromLine.number; i <= toLine.number; i++) {
      const line = doc.line(i);
      const lineStart = Math.max(range.from, line.from);
      const lineEnd = Math.min(range.to, line.to);
      if (lineStart < lineEnd) {
        if (allRange) {
          let allMarkup = true;

          for (let pos = lineStart; pos < lineEnd; pos++) {
            if (!isCharInMarkup(tree, pos, nodeTypes)) {
              allMarkup = false;
              break;
            }
          }

          if (!allMarkup) {
            notInAllMarkup = true;
            break;
          }
        } else {
          if (lineStart < lineEnd) {
            const charInMarkup = isCharInMarkup(tree, lineStart, nodeTypes, lineEnd);
            if (!charInMarkup) {
              notInAllMarkup = true;
              break;
            }
          }
        }
      }
    }
    if (notInAllMarkup) {
      has = false;
    }
  }
  return has;
};

/**
 * Clear all text formatting in selection
 */
export const clearAllTextFormattingCommand = clearTextFormattingCommand([...textFormattingKeys]);
/**
 * Clear specific text formatting in selection
 */
export const clearStrongCommand = clearTextFormattingCommand(['Strong']);
/**
 * Clear specific text formatting in selection
 */
export const clearItalicCommand = clearTextFormattingCommand(['Italic']);
/**
 * Clear specific text formatting in selection
 */
export const clearStrikethroughCommand = clearTextFormattingCommand(['Strikethrough']);
/**
 * Clear specific text formatting in selection
 */
export const clearHighlightCommand = clearTextFormattingCommand(['Highlight']);
/**
 * Clear specific text formatting in selection
 */
export const clearInlineCodeCommand = clearTextFormattingCommand(['InlineCode']);

/**
 * Clear text formatting command map
 */
export const clearTextFormatting: Record<TextFormattingKeyType, StateCommand> = {
  Strong: clearStrongCommand,
  Italic: clearItalicCommand,
  Strikethrough: clearStrikethroughCommand,
  Highlight: clearHighlightCommand,
  InlineCode: clearInlineCodeCommand,
};

/**
 * Toggle strong emphasis command
 */
export const toggleStrongCommand = toggleTextFormattingCommand(textFormattingConfig.Strong);
/**
 * Toggle emphasis command
 */
export const toggleItalicCommand = toggleTextFormattingCommand(textFormattingConfig.Italic);
/**
 * Toggle highlight command
 */
export const toggleHighlightCommand = toggleTextFormattingCommand(textFormattingConfig.Highlight);
/**
 * Toggle strikethrough command
 */
export const toggleStrikethroughCommand = toggleTextFormattingCommand(
  textFormattingConfig.Strikethrough,
);
/**
 * Toggle inline code command
 */
export const toggleInlineCodeCommand = toggleTextFormattingCommand(textFormattingConfig.InlineCode);

/**
 * Toggle text formatting command map
 */
export const toggleTextFormatting: Record<TextFormattingKeyType, StateCommand> = {
  Strong: toggleStrongCommand,
  Italic: toggleItalicCommand,
  Strikethrough: toggleStrikethroughCommand,
  Highlight: toggleHighlightCommand,
  InlineCode: toggleInlineCodeCommand,
};

/**
 * Check if selection has any text formatting
 * @param state Editor state
 * @returns is any text formatting
 */
export const isAnyTextFormatting = (state: EditorState) => {
  return isTextFormattingCommand(state, true, [...textFormattingNodeTypes]);
};
/**
 * Check if selection has strong
 * @param state Editor state
 * @returns is strong
 */
export const isStrong = (state: EditorState) => {
  return isTextFormattingCommand(state, true, ['StrongEmphasis']);
};
/**
 * Check if selection has italic
 * @param state Editor state
 * @returns has emphasis
 */
export const isItalic = (state: EditorState) => {
  return isTextFormattingCommand(state, true, ['Emphasis']);
};
/**
 * Check if selection has strikethrough
 * @param state Editor state
 * @returns has strikethrough
 */
export const isStrikethrough = (state: EditorState) => {
  return isTextFormattingCommand(state, true, ['Strikethrough']);
};
/**
 * Check if selection has highlight
 * @param state Editor state
 * @returns has highlight
 */
export const isHighlight = (state: EditorState) => {
  return isTextFormattingCommand(state, true, ['Highlight']);
};
/**
 * Check if selection has inline code
 * @param state Editor state
 * @returns has inline code
 */
export const isInlineCode = (state: EditorState) => {
  return isTextFormattingCommand(state, true, ['InlineCode']);
};
/**
 * Check if selection has specific text formatting
 */
export const isTextFormatting: Record<TextFormattingKeyType, (state: EditorState) => boolean> = {
  Strong: isStrong,
  Italic: isItalic,
  Strikethrough: isStrikethrough,
  Highlight: isHighlight,
  InlineCode: isInlineCode,
};
