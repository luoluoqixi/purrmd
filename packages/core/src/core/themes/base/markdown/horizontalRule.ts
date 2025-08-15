import { markdownLanguage } from '@codemirror/lang-markdown';
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { Extension } from '@codemirror/state';
import { EditorView } from '@codemirror/view';

import { markdownTags } from '@/core/common/tags';
import { horizontalRuleClass as horizontalRule } from '@/core/markdown';

export const horizontalRuleClass = horizontalRule;

export const horizontalRuleBaseTheme = (): Extension => {
  const theme = EditorView.baseTheme({
    '.cm-content': {
      // '--purrmd-horizontal-rule-color': '#ccc',
      '--purrmd-horizontal-rule-color': 'inherit',
      '--purrmd-horizontal-rule-height': '1px',
      '--purrmd-formatting-horizontal-rule-color': 'var(--purrmd-formatting-color)',
      '--purrmd-formatting-horizontal-rule-opacity': 'var(--purrmd-formatting-opacity)',
    },
    [`.${horizontalRuleClass.horizontalRuleFormatting} .${horizontalRuleClass.contentSeparator},
      .${horizontalRuleClass.horizontalRule} .${horizontalRuleClass.contentSeparator}`]: {
      display: 'inline-block',
      height: '1em',
      margin: 0,
      color: 'transparent',
    },
    [`.${horizontalRuleClass.horizontalRuleFormatting} .${horizontalRuleClass.contentSeparator}`]: {
      color: 'var(--purrmd-formatting-horizontal-rule-color)',
      opacity: 'var(--purrmd-formatting-horizontal-rule-opacity)',
    },
    [`.${horizontalRuleClass.horizontalRule} .${horizontalRuleClass.contentSeparator}`]: {
      display: 'inline-block',
      width: '100%',
      padding: '0 0 0 0',
      lineHeight: 'inherit',
      verticalAlign: 'middle',

      position: 'relative',
    },
    [`.${horizontalRuleClass.horizontalRule} .${horizontalRuleClass.contentSeparator}::before`]: {
      display: 'block',
      content: '""',
      boxShadow: 'none',
      filter: 'none',
      borderTop:
        'var(--purrmd-horizontal-rule-height) solid var(--purrmd-horizontal-rule-color, #ccc)',
      height: '1px',
      padding: '0',
      margin: '0',

      position: 'absolute',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
      width: '100%',
    },
  });
  const highlightStyle = HighlightStyle.define(
    [
      {
        tag: markdownTags.contentSeparator,
        class: horizontalRuleClass.contentSeparator,
      },
    ],
    {
      scope: markdownLanguage,
    },
  );
  return [syntaxHighlighting(highlightStyle), theme];
};
