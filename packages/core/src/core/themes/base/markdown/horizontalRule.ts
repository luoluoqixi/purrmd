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
      '--purrmd-horizontal-rule-height': '1px',
      '--purrmd-formatting-horizontal-rule-color': 'inherit',
    },
    [`.${horizontalRuleClass.horizontalRule}`]: {
      display: 'inline-block',
      width: '100%',
      padding: '0 0 1px 0',
      lineHeight: 'inherit',
      verticalAlign: 'middle',
    },
    [`.${horizontalRuleClass.horizontalRule} hr`]: {
      all: 'unset',
      display: 'block',
      boxShadow: 'none',
      filter: 'none',
      borderTop:
        'var(--purrmd-horizontal-rule-height) solid var(--purrmd-horizontal-rule-color, #ccc)',
      height: '0px',
      padding: '0',
      margin: '0',
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
