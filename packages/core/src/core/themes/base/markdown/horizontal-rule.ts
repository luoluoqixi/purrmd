import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { Extension } from '@codemirror/state';
import { EditorView } from '@codemirror/view';

import { markdownTags } from '@/core/common/tags';
import { horizontalRuleClass as horizontalRule } from '@/core/markdown';

export const horizontalRuleClass = horizontalRule;

export const horizontalRuleBaseTheme = (): Extension => {
  const theme = EditorView.baseTheme({
    '.cm-content': {
      '--purrmd-horizontal-rule-color': '#ccc',
      '--purrmd-horizontal-rule-height': '2px',
      '--purrmd-formatting-horizontal-rule-color': 'inherit',
    },
    [`.${horizontalRuleClass.horizontalRule}`]: {
      display: 'inline-block',
      width: '100%',
      height: '1em',
      padding: '0',
    },
    [`.${horizontalRuleClass.horizontalRule} hr`]: {
      all: 'unset',
      display: 'block',
      borderBottom:
        'var(--purrmd-horizontal-rule-height) solid var(--purrmd-horizontal-rule-color, #ccc)',
      height: '0.52em',
    },
    [`.${horizontalRuleClass.horizontalRuleFormatting}`]: {
      display: 'inline-block',
      color: 'var(--purrmd-formatting-horizontal-rule-color)',
      height: '1em',
      margin: 0,
    },
  });
  const highlightStyle = HighlightStyle.define([
    {
      tag: markdownTags.contentSeparator,
      class: horizontalRuleClass.horizontalRuleFormatting,
    },
  ]);
  return [syntaxHighlighting(highlightStyle), theme];
};
