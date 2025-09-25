import { EditorState, StateEffect, StateField, Transaction } from '@codemirror/state';
import { EditorView } from '@codemirror/view';

export const forceUpdateEffect = StateEffect.define<void>();

export const isForceUpdateEvent = (tr: Transaction) =>
  tr.effects.some((e) => e.is(forceUpdateEffect));

export const isForceUpdateEventState = (prev: EditorState, next: EditorState) =>
  getScrollState(prev) !== getScrollState(next);

export const scrollState = StateField.define<number>({
  create: () => 0,
  update: (value, tr) => {
    if (tr.effects.some((e) => e.is(forceUpdateEffect))) {
      return value + 1;
    }
    return value;
  },
});

export const getScrollState = (state: EditorState) => state.field(scrollState);

export const debouncedScrollListener = (delay = 150) => {
  let scrollTimeout: number | null = null;

  return [
    scrollState,
    EditorView.domEventHandlers({
      scroll: (event, view) => {
        if (scrollTimeout !== null) {
          clearTimeout(scrollTimeout);
        }

        scrollTimeout = window.setTimeout(() => {
          requestAnimationFrame(() => {
            view.dispatch({
              effects: [forceUpdateEffect.of()],
            });
          });
        }, delay);
      },
    }),
  ];
};
