import { Extension } from '@codemirror/state';
import { EditorView } from '@codemirror/view';

export const slashMenuClass = {
  slashMenu: 'purrmd-slash-menu',
  slashMenuTitle: 'purrmd-slash-menu-title',
  slashMenuContent: 'purrmd-slash-menu-content',
  slashMenuItem: 'purrmd-slash-menu-item',
  slashMenuItemActive: 'purrmd-slash-menu-item-active',
};

export const slashMenuBaseTheme = (dark: boolean): Extension => {
  const baseTheme = EditorView.baseTheme({
    '.cm-content': {},
    [`.${slashMenuClass.slashMenu}`]: {
      position: 'absolute',
      background: 'var(--purrmd-slash-bg-color)',
      color: 'var(--purrmd-slash-text-color)',
      border: dark ? '1px solid #555' : '1px solid #ccc',
      borderRadius: '4px',
      boxShadow: dark ? '0 2px 8px rgba(0,0,0,0.5)' : '0 2px 8px rgba(0,0,0,0.15)',
      padding: '2px 0',
      zIndex: '1000',
      width: '200px',
    },
    [`.${slashMenuClass.slashMenuItem}`]: {
      padding: '4px 12px',
      cursor: 'pointer',
      background: 'transparent',
      color: 'inherit',
    },
    [`.${slashMenuClass.slashMenuItem}.${slashMenuClass.slashMenuItemActive}`]: {
      background: 'var(--purrmd-slash-hover-bg-color)',
      color: 'var(--purrmd-slash-hover-color)',
    },
    [`.${slashMenuClass.slashMenuTitle}`]: {
      padding: '6px 12px',
      fontWeight: 'bold',
      fontSize: '12px',
      color: dark ? '#aaa' : '#888',
    },
    [`.${slashMenuClass.slashMenuTitle}`]: {
      padding: '6px 12px',
      fontWeight: 'bold',
      fontSize: '12px',
      color: dark ? '#aaa' : '#888',
      height: '24px',
    },
    [`.${slashMenuClass.slashMenuContent}`]: {
      maxHeight: '300px',
      overflowY: 'auto',
    },
  });
  const theme = EditorView.theme({
    '&': {
      '--purrmd-slash-bg-color': dark ? '#2f2f2f' : '#f3f3f3',
      '--purrmd-slash-text-color': dark ? '#f3f3f3' : '#2f2f2f',
      '--purrmd-slash-hover-bg-color': 'var(--purrmd-primary-color)',
      '--purrmd-slash-hover-color': '#f3f3f3',
    },
  });
  return [theme, baseTheme];
};
