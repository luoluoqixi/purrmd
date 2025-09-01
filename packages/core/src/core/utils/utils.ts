import { syntaxTree } from '@codemirror/language';
import { EditorSelection, EditorState, Line, type Range } from '@codemirror/state';
import { Decoration, EditorView } from '@codemirror/view';
import type { SyntaxNode, SyntaxNodeRef } from '@lezer/common';

import { hiddenBlockDecoration, hiddenInlineDecoration } from '../common/decorations';
import { hasFocus } from '../state';

export interface BaseRange {
  from: number;
  to: number;
}

export const isSelectRange = (state: EditorState, range: BaseRange) => {
  if (!hasFocus(state)) return false;
  return state.selection.ranges.some((r) => range.from <= r.to && range.to >= r.from);
};

export const isSelectLine = (state: EditorState, node: SyntaxNodeRef) => {
  if (!hasFocus(state)) return false;
  const doc = state.doc;
  const fromLine = doc.lineAt(node.from).number;
  const toLine = doc.lineAt(node.to).number;

  return state.selection.ranges.some((r) => {
    const rFromLine = doc.lineAt(r.from).number;
    const rToLine = doc.lineAt(r.to).number;

    return rFromLine <= toLine && rToLine >= fromLine;
  });
};

export const iterSubNodes = (
  node: SyntaxNode,
  subNodeName?: string | string[],
  cb?: (node: SyntaxNodeRef) => void,
) => {
  const isArray = Array.isArray(subNodeName);
  const isNeedMatch = subNodeName != null;
  const cursor = node.cursor();
  cursor.iterate((node) => {
    const isMatch =
      !isNeedMatch ||
      (isArray
        ? subNodeName.some((name) => node.type.name === name)
        : node.type.name === subNodeName);
    if (isMatch) {
      cb?.(node);
    }
  });
};

export const iterParentNodes = (
  node: SyntaxNode,
  parentNodeName?: string | string[],
  cb?: (node: SyntaxNodeRef) => void,
) => {
  const isArray = Array.isArray(parentNodeName);
  const isNeedMatch = parentNodeName != null;
  while (node.parent) {
    node = node.parent;
    const isMatch =
      !isNeedMatch ||
      (isArray
        ? parentNodeName.some((name) => node.type.name === name)
        : node.type.name === parentNodeName);
    if (isMatch) {
      cb?.(node);
    }
  }
};

export const setSubNodeHideDecorations = (
  node: SyntaxNode,
  decorations: Range<Decoration>[],
  subNodeName: string | string[],
  isBlock: boolean,
  decoration?: Decoration | null,
  customHide?: (
    node: SyntaxNode,
    decorations: Decoration,
  ) => Range<Decoration> | Range<Decoration>[] | undefined,
) => {
  iterSubNodes(node, subNodeName, (node) => {
    if (!decoration) {
      decoration = isBlock ? hiddenBlockDecoration : hiddenInlineDecoration;
    }
    if (customHide) {
      const result = customHide(node.node, decoration);
      if (result) {
        if (Array.isArray(result)) {
          decorations.push(...result);
        } else {
          decorations.push(result);
        }
      }
    } else {
      decorations.push(decoration.range(node.from, node.to));
    }
  });
};

export const setSubNodeHideDecorationsLine = (
  state: EditorState,
  node: SyntaxNode,
  decorations: Range<Decoration>[],
  subNodeName: string | string[],
  isBlock: boolean,
  decoration?: Decoration | null,
) => {
  iterSubNodes(node, subNodeName, (sub) => {
    if (!isSelectLine(state, sub)) {
      if (!decoration) {
        decoration = isBlock ? hiddenBlockDecoration : hiddenInlineDecoration;
      }
      decorations.push(decoration.range(sub.from, sub.to));
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

export function findNodeURL(state: EditorState, node: SyntaxNodeRef): string | undefined {
  let url: string | undefined;
  if (node.name === 'URL') {
    url = state.doc.sliceString(node.from, node.to);
  } else {
    const cursor = node.node.cursor();
    if (cursor.firstChild()) {
      do {
        if (cursor.name === 'URL') {
          url = state.doc.sliceString(cursor.from, cursor.to);
          break;
        }
      } while (cursor.nextSibling());
    }
  }
  return url;
}

export function findNodeFromLine(state: EditorState, line: Line, name: string): SyntaxNode | null {
  let foundNode: SyntaxNode | null = null;
  syntaxTree(state).iterate({
    from: line.from,
    to: line.to,
    enter(node) {
      if (node.type.name === name) {
        foundNode = node.node;
        return true;
      }
    },
  });
  return foundNode;
}

export function selectRange(view: EditorView, range: BaseRange) {
  setTimeout(() => {
    if (!view) return;
    view.dispatch({
      selection: EditorSelection.single(range.to, range.from),
    });
  }, 0);
}

export function deviceIsDesktop(): boolean {
  const userAgent = navigator.userAgent;
  const isTablet = /(iPad|Android(?!.*mobile)|Tablet|Kindle|Silk)/i.test(userAgent);
  if (isTablet) {
    return false;
  }
  const isMobile = /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  if (isMobile) {
    return false;
  }
  return true;
}
