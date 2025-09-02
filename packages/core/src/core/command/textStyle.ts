import { syntaxTree } from '@codemirror/language';
import { EditorSelection, EditorState, StateCommand } from '@codemirror/state';
import { Tree } from '@lezer/common';

import { iterParentNodes, iterSubNodes } from '../utils';

export const textStyleNodeTypes = [
  'StrongEmphasis',
  'Emphasis',
  'Strikethrough',
  'Highlight',
  'InlineCode',
] as const;

export type TextStyleNodeType = (typeof textStyleNodeTypes)[number];

const textStyleConfig: Record<TextStyleNodeType, StyleConfig> = {
  StrongEmphasis: {
    nodeType: 'StrongEmphasis',
    subType: 'EmphasisMark',
    markup: '**',
    placeholder: '',
  },
  Emphasis: {
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

interface StyleConfig {
  nodeType: TextStyleNodeType;
  subType: string;
  markup: string;
  placeholder?: string;
}

class SelectionRangeCalculator {
  private originalFrom: number;
  private originalTo: number;
  private fromOffset: number = 0;
  private toOffset: number = 0;

  constructor(originalFrom: number, originalTo: number) {
    this.originalFrom = originalFrom;
    this.originalTo = originalTo;
  }

  addDeletion(from: number, to: number) {
    const deletionLength = to - from;
    if (to <= this.originalFrom) {
      this.fromOffset -= deletionLength;
      this.toOffset -= deletionLength;
    } else if (from < this.originalFrom) {
      const deletionLengthFrom = this.originalFrom - from;
      this.fromOffset -= deletionLengthFrom;
      this.toOffset -= deletionLength;
    } else if (from >= this.originalFrom && from < this.originalTo) {
      this.toOffset -= deletionLength;
    }
  }

  addInsertion(from: number, insertLength: number) {
    if (from <= this.originalFrom) {
      this.fromOffset += insertLength;
      this.toOffset += insertLength;
    } else if (from > this.originalFrom && from <= this.originalTo) {
      this.toOffset += insertLength;
    }
  }

  getRange(): { from: number; to: number } {
    return {
      from: this.originalFrom + this.fromOffset,
      to: this.originalTo + this.toOffset,
    };
  }

  getAdjustedPos(originalPos: number): number {
    return originalPos + this.fromOffset;
  }
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
  config: StyleConfig,
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

const isCharInMarkup = (tree: Tree, from: number, nodeType: string | string[], to?: number) => {
  to = to == null ? from + 1 : to;
  const isArray = Array.isArray(nodeType);
  let charInMarkup = false;
  tree.iterate({
    from,
    to,
    enter: (node) => {
      if (isArray) {
        if (nodeType.includes(node.type.name as TextStyleNodeType)) {
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

const toggleTextStyle =
  (config: StyleConfig): StateCommand =>
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
        removeRangeMarkups(tree, pos, pos + 1, config, rangeCalculator, updateChanges);
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

          for (let pos = lineStart; pos < lineEnd; pos++) {
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
          const newText = `${config.markup}${lineText}${config.markup}`;
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

const clearTextStyle = (nodeTypes: TextStyleNodeType[]): StateCommand => {
  return ({ state, dispatch }) => {
    const { selection, doc } = state;
    const changes: { from: number; to: number; insert: string }[] = [];
    const newRanges: { from: number; to: number }[] = [];
    const tree = syntaxTree(state);

    const range = selection.main;
    if (range.empty) {
      const pos = range.from;
      const charInMarkup = isCharInMarkup(tree, pos, nodeTypes);
      if (charInMarkup) {
        const updateChanges: UpdataChange[] = [];
        const rangeCalculator = new SelectionRangeCalculator(pos, pos);
        for (let i = 0; i < nodeTypes.length; i++) {
          const nodeType = nodeTypes[i];
          const config = textStyleConfig[nodeType];
          removeRangeMarkups(tree, pos, pos + 1, config, rangeCalculator, updateChanges);
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

        for (let i = 0; i < nodeTypes.length; i++) {
          const nodeType = nodeTypes[i];
          const config = textStyleConfig[nodeType];
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

const hasTextStyle = (
  state: EditorState,
  allRange: boolean,
  nodeTypes: TextStyleNodeType[],
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
 * Clear all text style in selection
 */
export const clearSelectionAllTextStyle = clearTextStyle([...textStyleNodeTypes]);
/**
 * Clear specific text style in selection
 */
export const clearSelectionStrong = clearTextStyle(['StrongEmphasis']);
/**
 * Clear specific text style in selection
 */
export const clearSelectionItalic = clearTextStyle(['Emphasis']);
/**
 * Clear specific text style in selection
 */
export const clearSelectionStrikethrough = clearTextStyle(['Strikethrough']);
/**
 * Clear specific text style in selection
 */
export const clearSelectionHighlight = clearTextStyle(['Highlight']);
/**
 * Clear specific text style in selection
 */
export const clearSelectionInlineCode = clearTextStyle(['InlineCode']);

/**
 * Clear text style command map
 */
export const clearSelectionTextStyle: Record<TextStyleNodeType, StateCommand> = {
  StrongEmphasis: clearSelectionStrong,
  Emphasis: clearSelectionItalic,
  Strikethrough: clearSelectionStrikethrough,
  Highlight: clearSelectionHighlight,
  InlineCode: clearSelectionInlineCode,
};

/**
 * Toggle strong emphasis command
 */
export const toggleSelectionStrong = toggleTextStyle(textStyleConfig.StrongEmphasis);
/**
 * Toggle emphasis command
 */
export const toggleSelectionItalic = toggleTextStyle(textStyleConfig.Emphasis);
/**
 * Toggle highlight command
 */
export const toggleSelectionHighlight = toggleTextStyle(textStyleConfig.Highlight);
/**
 * Toggle strikethrough command
 */
export const toggleSelectionStrikethrough = toggleTextStyle(textStyleConfig.Strikethrough);
/**
 * Toggle inline code command
 */
export const toggleSelectionInlineCode = toggleTextStyle(textStyleConfig.InlineCode);

/**
 * Toggle text style command map
 */
export const toggleSelectionTextStyle: Record<TextStyleNodeType, StateCommand> = {
  StrongEmphasis: toggleSelectionStrong,
  Emphasis: toggleSelectionItalic,
  Strikethrough: toggleSelectionStrikethrough,
  Highlight: toggleSelectionHighlight,
  InlineCode: toggleSelectionInlineCode,
};

/**
 * Check if selection has any text style
 * @param state Editor state
 * @returns has any text style
 */
export const hasSelectionAnyTextStyle = (state: EditorState) => {
  return hasTextStyle(state, true, [...textStyleNodeTypes]);
};
/**
 * Check if selection has strong emphasis
 * @param state Editor state
 * @returns has strong emphasis
 */
export const hasSelectionStrongEmphasis = (state: EditorState) => {
  return hasTextStyle(state, true, ['StrongEmphasis']);
};
/**
 * Check if selection has emphasis
 * @param state Editor state
 * @returns has emphasis
 */
export const hasSelectionEmphasis = (state: EditorState) => {
  return hasTextStyle(state, true, ['Emphasis']);
};
/**
 * Check if selection has strikethrough
 * @param state Editor state
 * @returns has strikethrough
 */
export const hasSelectionStrikethrough = (state: EditorState) => {
  return hasTextStyle(state, true, ['Strikethrough']);
};
/**
 * Check if selection has highlight
 * @param state Editor state
 * @returns has highlight
 */
export const hasSelectionHighlight = (state: EditorState) => {
  return hasTextStyle(state, true, ['Highlight']);
};
/**
 * Check if selection has inline code
 * @param state Editor state
 * @returns has inline code
 */
export const hasSelectionInlineCode = (state: EditorState) => {
  return hasTextStyle(state, true, ['InlineCode']);
};
/**
 * Check if selection has specific text style
 */
export const hasSelectionTextStyle: Record<TextStyleNodeType, (state: EditorState) => boolean> = {
  StrongEmphasis: hasSelectionStrongEmphasis,
  Emphasis: hasSelectionEmphasis,
  Strikethrough: hasSelectionStrikethrough,
  Highlight: hasSelectionHighlight,
  InlineCode: hasSelectionInlineCode,
};
