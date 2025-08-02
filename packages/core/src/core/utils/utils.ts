import { syntaxTree } from '@codemirror/language';
import { EditorState, type Range } from '@codemirror/state';
import { Decoration, EditorView } from '@codemirror/view';
import type { SyntaxNode, SyntaxNodeRef } from '@lezer/common';

import { hiddenBlockDecoration, hiddenInlineDecoration } from '../common/decorations';

export interface BaseRange {
  from: number;
  to: number;
}

export const isSelectRange = (state: EditorState, range: BaseRange) => {
  return state.selection.ranges.some((r) => range.from <= r.to && range.to >= r.from);
};

export const setSubNodeHideDecorations = (
  node: SyntaxNode,
  decorations: Range<Decoration>[],
  subNodeName: string | string[],
  isBlock: boolean,
) => {
  const isArray = Array.isArray(subNodeName);
  const cursor = node.cursor();
  cursor.iterate((node) => {
    const isMatch = isArray
      ? subNodeName.some((name) => node.type.name === name)
      : node.type.name === subNodeName;
    if (isMatch) {
      const hiddenDecoration = isBlock ? hiddenBlockDecoration : hiddenInlineDecoration;
      decorations.push(hiddenDecoration.range(node.from, node.to));
    }
  });
};

export function syntaxTreeInVisible(
  view: EditorView,
  iterateFns: {
    enter(node: SyntaxNodeRef): boolean | void;
    leave?(node: SyntaxNodeRef): void;
  },
) {
  for (const { from, to } of view.visibleRanges) {
    syntaxTree(view.state).iterate({ ...iterateFns, from, to });
  }
}

export function isInsideFencedCode(state: EditorState, from: number): boolean {
  let node: SyntaxNode | null = syntaxTree(state).resolve(from);
  while (node) {
    if (node.name === 'FencedCode') return true;
    node = node.parent;
  }
  return false;
}
