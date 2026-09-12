import { syntaxTree, syntaxTreeAvailable } from '@codemirror/language';
import {
  EditorState,
  type Extension,
  StateEffect,
  StateField,
  Transaction,
} from '@codemirror/state';
import { EditorView, ViewPlugin, ViewUpdate } from '@codemirror/view';

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

export const getScrollState = (state: EditorState) => state.field(scrollState, false) || 0;

/**
 * Refresh decorations once the asynchronously parsed initial viewport is available.
 *
 * Most PurrMD decorations are derived from the syntax tree. CodeMirror creates that
 * tree incrementally, so the initial decoration set can be incomplete on slower
 * devices. A later parser transaction doesn't change the document or selection, and
 * therefore normally wouldn't cause those decorations to be rebuilt.
 */
export const initialParseUpdate = (): Extension =>
  ViewPlugin.fromClass(
    class {
      private completed = false;
      private animationFrame: number | null = null;

      constructor(private readonly view: EditorView) {}

      update(update: ViewUpdate) {
        if (
          this.completed ||
          syntaxTree(update.startState) === syntaxTree(update.state) ||
          !syntaxTreeAvailable(update.state, update.view.viewport.to)
        ) {
          return;
        }

        this.completed = true;
        this.animationFrame = requestAnimationFrame(() => {
          this.animationFrame = null;
          this.view.dispatch({ effects: [forceUpdateEffect.of()] });
        });
      }

      destroy() {
        if (this.animationFrame !== null) {
          cancelAnimationFrame(this.animationFrame);
        }
      }
    },
  );

export const debouncedScrollListener = (delay = 150) => {
  let scrollTimeout: number | null = null;

  return EditorView.domEventHandlers({
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
  });
};
