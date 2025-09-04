import { EditorState } from '@codemirror/state';

export const emptyRegex = /^(\s*)/;
export const regexUnorderedList = /^(\s*)[-*+]\s+/;
export const regexOrderedList = /^(\s*)\d+\.\s+/;
export const regexTaskList = /^(\s*)(?:[-*+]\s+\[( |x|X)\]\s+|\d+\.\s+\[( |x|X)\]\s+)/;
export const clearAllListRegex =
  /^(\s*)(?:[-*+]\s+\[( |x|X)\]\s+|\d+\.\s+\[( |x|X)\]\s+|\d+\.\s+|[-*+]\s+)/;

export function removeAnyListPrefix(lineText: string): string {
  return lineText.replace(clearAllListRegex, (_, indent) => indent);
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
