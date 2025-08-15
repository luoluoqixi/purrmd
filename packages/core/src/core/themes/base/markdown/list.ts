/* eslint-disable quote-props */
import { markdownLanguage } from '@codemirror/lang-markdown';
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { Extension } from '@codemirror/state';
import { EditorView } from '@codemirror/view';

import { markdownTags } from '@/core/common/tags';
import { listClass as list } from '@/core/markdown';

export const listClass = list;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const listBaseTheme = (dark: boolean): Extension => {
  const theme = EditorView.baseTheme({
    '.cm-content': {
      '--purrmd-formatting-bullet-list-opacity': '1',
      '--purrmd-formatting-ordered-list-opacity': '1',

      '--purrmd-formatting-bullet-list-item-color': 'var(--purrmd-formatting-color)',
      '--purrmd-formatting-bullet-list-item-point-color': 'var(--purrmd-formatting-color)',
      '--purrmd-formatting-ordered-list-item-color': 'var(--purrmd-formatting-color)',
      '--purrmd-formatting-bullet-list-task-color': 'var(--purrmd-formatting-color)',
      '--purrmd-formatting-ordered-list-task-color': 'var(--purrmd-formatting-color)',

      '--purrmd-checkbox-list-height': '2rem',
      '--purrmd-checkbox-height': '1.0rem',
      '--purrmd-checkbox-color': '#fff',
      '--purrmd-checkbox-border-color': 'var(--purrmd-primary-color)',
      '--purrmd-checkbox-checked-color': 'var(--purrmd-primary-color)',
      '--purrmd-checkbox-checked-border-color': 'var(--purrmd-primary-color)',
    },
    [`.${listClass.bulletListItemFormattingHide} .${listClass.listFormatting},
      .${listClass.bulletListItemFormatting} .${listClass.listFormatting},
      .${listClass.bulletListCheckboxFormatting} .${listClass.listFormatting}`]: {
      display: 'inline-block',
      position: 'relative',
    },
    [`.${listClass.bulletListItemFormattingHide} .${listClass.listFormatting}`]: {
      color: 'transparent',
    },
    [`.${listClass.bulletListItemFormatting} .${listClass.listFormatting},
      .${listClass.bulletListCheckboxFormatting} .${listClass.listFormatting}`]: {
      color: 'var(--purrmd-formatting-bullet-list-item-color)',
      opacity: 'var(--purrmd-formatting-bullet-list-opacity)',
    },
    [`.${listClass.bulletListCheckboxFormatting} .${listClass.taskFormatting}`]: {
      color: 'var(--purrmd-formatting-bullet-list-task-color)',
      opacity: 'var(--purrmd-formatting-bullet-list-opacity)',
    },
    [`.${listClass.orderedListCheckboxFormatting} .${listClass.taskFormatting}`]: {
      color: 'var(--purrmd-formatting-ordered-list-task-color)',
      opacity: 'var(--purrmd-formatting-ordered-list-opacity)',
    },
    [`.${listClass.bulletListItemFormattingHide} .${listClass.listFormatting}::after,
      .${listClass.bulletListItemFormatting} .${listClass.listFormatting}::after`]: {
      position: 'absolute',
      content: '"•"',
      left: 0,
    },
    [`.${listClass.bulletListItemFormattingHide} .${listClass.listFormatting}::after`]: {
      color: 'var(--purrmd-formatting-bullet-list-item-point-color)',
    },
    [`.${listClass.orderedListItemFormatting} .${listClass.listFormatting},
      .${listClass.orderedListCheckboxFormatting} .${listClass.listFormatting}`]: {
      color: 'var(--purrmd-formatting-ordered-list-item-color)',
      opacity: 'var(--purrmd-formatting-ordered-list-opacity)',
    },
    [`.${listClass.bulletListItemFormatting} .${listClass.listFormatting}::after`]: {
      color: 'transparent',
    },

    [`.${listClass.bulletListCheckboxFormatting},
      .${listClass.orderedListCheckboxFormatting}`]: {
      display: 'inline-block',
      height: 'var(--purrmd-checkbox-list-height)',
      lineHeight: 'var(--purrmd-checkbox-list-height)',
      padding: '0',
      margin: '0',
      boxSizing: 'border-box',
      verticalAlign: 'middle',
      alignItems: 'center',
    },
    [`.${listClass.checkboxFormatting}[type=checkbox]`]: {
      appearance: 'none',
      boxSizing: 'border-box',
      margin: '0',
      padding: '0',

      width: 'var(--purrmd-checkbox-height)',
      height: 'var(--purrmd-checkbox-height)',

      border: '1px solid var(--purrmd-checkbox-border-color)',
      borderRadius: '4px',
      backgroundColor: 'var(--purrmd-checkbox-color)',
      position: 'relative',
      verticalAlign: 'middle',
      transition: 'box-shadow 0.15s ease-in-out',

      top: '-0.2em',
      // marginInlineStart: '0.85em',
      // marginInlineEnd: '0.25em',
    },
    [`.${listClass.checkboxFormatting}[type=checkbox]:checked`]: {
      backgroundColor: 'var(--purrmd-checkbox-checked-color)',
      borderColor: 'var(--purrmd-checkbox-checked-border-color)',
    },
    [`.${listClass.checkboxFormatting}[type=checkbox]:checked:after`]: {
      content: '""',
      top: '-1px',
      insetInlineStart: '-1px',
      position: 'absolute',
      width: 'var(--purrmd-checkbox-height)',
      height: 'var(--purrmd-checkbox-height)',
      display: 'block',
      backgroundColor: 'white',
      '-webkit-mask-position': '52% 52%',
      '-webkit-mask-size': '65%',
      '-webkit-mask-repeat': 'no-repeat',
      '-webkit-mask-image':
        'url("data:image/svg+xml,%3Csvg%20width%3D%2212px%22%20height%3D%2210px%22%20viewBox%3D%220%200%2012%208%22%20version%3D%221.1%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20xmlns:xlink%3D%22http%3A//www.w3.org/1999/xlink%22%3E%3Cg%20stroke%3D%22none%22%20stroke-width%3D%221%22%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20transform%3D%22translate(-4.000000%2C%20-6.000000)%22%20fill%3D%22%23000000%22%3E%3Cpath%20d%3D%22M8.1043257%2C14.0367999%20L4.52468714%2C10.5420499%20C4.32525014%2C10.3497722%204.32525014%2C10.0368095%204.52468714%2C9.8424863%20L5.24777413%2C9.1439454%20C5.44721114%2C8.95166768%205.77142411%2C8.95166768%205.97086112%2C9.1439454%20L8.46638057%2C11.5903727%20L14.0291389%2C6.1442083%20C14.2285759%2C5.95193057%2014.5527889%2C5.95193057%2014.7522259%2C6.1442083%20L15.4753129%2C6.84377194%20C15.6747499%2C7.03604967%2015.6747499%2C7.35003511%2015.4753129%2C7.54129009%20L8.82741268%2C14.0367999%20C8.62797568%2C14.2290777%208.3037627%2C14.2290777%208.1043257%2C14.0367999%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
    },
  });
  const highlightStyle = HighlightStyle.define(
    [
      {
        tag: markdownTags.listTag,
        class: listClass.listFormatting,
      },
      {
        tag: markdownTags.taskTag,
        class: listClass.taskFormatting,
      },
    ],
    {
      scope: markdownLanguage,
    },
  );
  return [syntaxHighlighting(highlightStyle), theme];
};
