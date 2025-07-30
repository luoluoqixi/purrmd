import { EditorState } from '@codemirror/state';

export interface BaseRange {
  from: number;
  to: number;
}

export const isSelectRange = (state: EditorState, range: BaseRange) => {
  return state.selection.ranges.some((r) => range.from <= r.to && range.to >= r.from);
};
