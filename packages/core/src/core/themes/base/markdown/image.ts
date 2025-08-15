import { Extension } from '@codemirror/state';
import { EditorView } from '@codemirror/view';

import { imageClass as image } from '@/core/markdown';

export const imageClass = image;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const imageBaseTheme = (dark: boolean): Extension => {
  const theme = EditorView.baseTheme({
    '.cm-content': {},
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
    [`.${imageClass.imageDom}`]: {
      maxWidth: '100%',
      height: 'auto',
    },
  });
  return theme;
};
