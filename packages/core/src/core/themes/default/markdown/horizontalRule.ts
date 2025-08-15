import { Extension } from '@codemirror/state';
import { EditorView } from '@codemirror/view';

export const horizontalRuleTheme = (dark: boolean): Extension => {
  const theme = EditorView.theme(
    {
      '.cm-content': {
        '--purrmd-formatting-horizontal-rule-color': 'var(--purrmd-formatting-color)',
        '--purrmd-horizontal-rule-color': 'inherit',
      },
    },
    {
      dark,
    },
  );
  return theme;
};
