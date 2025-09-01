import { syntaxTree } from '@codemirror/language';
import { EditorSelection, StateCommand } from '@codemirror/state';

import { iterParentNodes, iterSubNodes } from '../utils';

interface StyleConfig {
  nodeType: string;
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
}

const toggleTextStyle =
  (config: StyleConfig): StateCommand =>
  ({ state, dispatch }): boolean => {
    const { selection, doc } = state;
    const changes: { from: number; to: number; insert: string }[] = [];
    const newRanges: { from: number; to: number }[] = [];

    selection.ranges.forEach((range) => {
      if (range.empty) {
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
      } else {
        const tree = syntaxTree(state);

        const markTypeName = config.subType;
        const nodeType = config.nodeType;

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
              let charInMarkup = false;

              tree.iterate({
                from: pos,
                to: pos + 1,
                enter: (node) => {
                  if (node.type.name === nodeType) {
                    charInMarkup = true;
                  } else {
                    iterParentNodes(node.node, nodeType, () => {
                      charInMarkup = true;
                    });
                  }
                },
              });

              if (!charInMarkup) {
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

        console.log(notInAllMarkup);

        const targetAddMarkup = notInAllMarkup;
        const updateChanges: Array<{ from: number; to: number; insert: string }> = [];

        const rangeCalculator = new SelectionRangeCalculator(range.from, range.to);

        linesToProcess.forEach((lineProcess) => {
          const { from, to } = lineProcess;
          // remove markup
          tree.iterate({
            from,
            to,
            enter: (node) => {
              if (node.type.name === nodeType) {
                iterSubNodes(node.node, markTypeName, (sub) => {
                  if (sub.node.parent == null || sub.node.parent.type.name !== nodeType) {
                    return;
                  }
                  updateChanges.push({
                    from: sub.from,
                    to: sub.to,
                    insert: '',
                  });
                  rangeCalculator.addDeletion(sub.from, sub.to);
                });
              }
            },
          });
          if (targetAddMarkup) {
            // add markup
            const lineText = doc.sliceString(from, to);
            const newText = `${config.markup}${lineText}${config.markup}`;
            rangeCalculator.addInsertion(from, config.markup.length);
            // rangeCalculator.addInsertion(to, config.markup.length);
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
    });

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

export const toggleStrong = toggleTextStyle({
  nodeType: 'StrongEmphasis',
  subType: 'EmphasisMark',
  markup: '**',
  placeholder: '',
});

export const toggleItalic = toggleTextStyle({
  nodeType: 'Emphasis',
  subType: 'EmphasisMark',
  markup: '*',
  placeholder: '',
});

export const toggleHighlight = toggleTextStyle({
  nodeType: 'Highlight',
  subType: 'HighlightMark',
  markup: '==',
  placeholder: '',
});

export const toggleStrikethrough = toggleTextStyle({
  nodeType: 'Strikethrough',
  subType: 'StrikethroughMark',
  markup: '~~',
  placeholder: '',
});

export const toggleInlineCode = toggleTextStyle({
  nodeType: 'InlineCode',
  subType: 'CodeMark',
  markup: '`',
  placeholder: '',
});
