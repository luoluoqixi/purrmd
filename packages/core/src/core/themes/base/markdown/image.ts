import { Extension } from '@codemirror/state';
import { EditorView } from '@codemirror/view';

import { imageClass as image } from '@/core/markdown';

export const imageClass = image;

export const imageBaseTheme = (): Extension => {
  const theme = EditorView.baseTheme({
    '.cm-content': {
      '--purrmd-formatting-blockquote-color': 'inherit',
      '--purrmd-formatting-blockquote-border-thickness': '2px',
      '--purrmd-formatting-blockquote-border-color': 'grey',
    },
    [`.${imageClass.imageWrap}, .${imageClass.imageLinkWrap}`]: {},
    [`.${imageClass.imageWrap}`]: {
      display: 'block',
      position: 'relative',
      width: '100%',
      maxWidth: '100%',
      boxSizing: 'border-box',
      margin: '0',
      padding: '0 0.5rem 0 0',
    },
    [`.${imageClass.imageLinkWrap}`]: {
      display: 'inline-block',
    },
    [`.${imageClass.image}`]: {
      maxWidth: '100%',
      height: 'auto',
    },
  });
  return theme;
};
