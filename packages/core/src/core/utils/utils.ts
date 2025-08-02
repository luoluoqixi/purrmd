import { EditorState, type Range } from '@codemirror/state';
import { Decoration } from '@codemirror/view';
import type { SyntaxNode } from '@lezer/common';

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
