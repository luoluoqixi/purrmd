import { EditorState } from '@codemirror/state';

export const emptyRegex = /^(\s*)/;
export const regexUnorderedList = /^(\s*)[-*+]\s+(?!\[)/;
export const regexOrderedList = /^(\s*)\d+\.\s+/;
export const regexTaskList = /^(\s*)(?:[-*+]\s+\[( |x|X)\]\s+|\d+\.\s+\[( |x|X)\]\s+)/;
export const clearAllListRegex =
  /^(\s*)(?:[-*+]\s+\[( |x|X)\]\s+|\d+\.\s+\[( |x|X)\]\s+|\d+\.\s+|[-*+]\s+)/;

export const clearBlockquoteRegex = /^(\s*)>+\s*/;

export function removeAnyListPrefix(lineText: string): string {
  return lineText.replace(clearAllListRegex, (_, indent) => indent);
}

export function removeBlockquotePrefix(lineText: string): string {
  return lineText.replace(clearBlockquoteRegex, (_, indent) => indent);
}

export function allMatch(state: EditorState, regex: RegExp): boolean {
  const { selection } = state;
  const range = selection.main;
  return rangeMatch(state, regex, range.from, range.to);
}

export function rangeMatch(state: EditorState, regex: RegExp, from: number, to: number): boolean {
  const { doc } = state;
  const fromLine = doc.lineAt(from);
  const toLine = doc.lineAt(to);

  for (let i = fromLine.number; i <= toLine.number; i++) {
    const line = doc.line(i);
    if (!regex.test(line.text)) {
      return false;
    }
  }
  return true;
}

export class SelectionRangeCalculator {
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

  addChange(from: number, to: number, insert: string) {
    const deletionLength = to - from;
    const insertionLength = insert.length;
    const delta = insertionLength - deletionLength;

    if (delta === 0) return;

    if (to <= this.originalFrom) {
      return;
    } else if (from < this.originalFrom) {
      this.fromOffset += delta;
      this.toOffset += delta;
    } else if (from >= this.originalFrom && from < this.originalTo) {
      this.toOffset += delta;
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
