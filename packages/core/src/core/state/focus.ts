import { EditorState, StateField, Transaction } from '@codemirror/state';
import { EditorView } from '@codemirror/view';

export const focusState = StateField.define({
  create: () => false,
  update: (value, tr) => {
    if (tr.isUserEvent('cm-focus')) return true;
    if (tr.isUserEvent('cm-blur')) return false;
    return value;
  },
});

export const focusListener = EditorView.updateListener.of((update) => {
  if (update.focusChanged) {
    requestAnimationFrame(() => {
      update.view.dispatch({
        userEvent: update.view.hasFocus ? 'cm-focus' : 'cm-blur',
      });
    });
  }
});

export const hasFocus = (state: EditorState) => state.field(focusState);

export const isFocusEvent = (tr: Transaction) =>
  tr.isUserEvent('cm-focus') || tr.isUserEvent('cm-blur');

export const isFocusEventState = (prev: EditorState, next: EditorState) =>
  prev.field(focusState) !== next.field(focusState);
