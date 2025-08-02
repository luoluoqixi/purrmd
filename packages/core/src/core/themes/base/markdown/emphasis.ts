import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { Extension } from '@codemirror/state';
import { EditorView } from '@codemirror/view';

import { markdownTags } from '@/core/common/tags';

export const emphasisClass = {
  emphasis: 'purrmd-cm-emphasis',
  emphasisFormatting: 'purrmd-cm-formatting-emphasis',
};

export const emphasisBaseTheme = (): Extension => {
  const theme = EditorView.baseTheme({
    '.cm-content': {
      '--purrmd-emphasis-style': 'italic',
    },
    [`.${emphasisClass.emphasis}`]: {
      fontStyle: 'var(--purrmd-emphasis-style)',
    },
  });
  const highlightStyle = HighlightStyle.define([
    { class: emphasisClass.emphasis, tag: markdownTags.emphasis },
    { class: emphasisClass.emphasisFormatting, tag: markdownTags.emphasisTag },
  ]);
  return [syntaxHighlighting(highlightStyle), theme];
};
