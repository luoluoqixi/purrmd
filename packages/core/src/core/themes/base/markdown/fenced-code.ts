import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { Extension } from '@codemirror/state';
import { EditorView } from '@codemirror/view';

import { markdownTags } from '@/core/common/tags';

export const fencedCodeClass = {
  fencedCode: 'purrmd-cm-fenced-code',
};

export const fencedCodeBaseTheme = (): Extension => {
  const theme = EditorView.baseTheme({
    '.cm-content': {},
  });
  const highlightStyle = HighlightStyle.define([
    { class: fencedCodeClass.fencedCode, tag: markdownTags.fencedCode },
  ]);
  return [syntaxHighlighting(highlightStyle), theme];
};
