import { Extension } from '@codemirror/state';
import { EditorView } from '@codemirror/view';

import { imageClass as image } from '@/core/markdown';

export const imageClass = image;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const imageBaseTheme = (dark: boolean): Extension => {
  const theme = EditorView.baseTheme({
    '.cm-content': {
      '--purrmd-image-fallback-border-radius': '0.5rem',
      '--purrmd-image-fallback-bg-color': dark ? '#ffffff1a' : '#0000001a',
      '--purrmd-image-fallback-color': 'inherit',
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
    [`.${imageClass.imageDom}`]: {
      maxWidth: '100%',
      height: 'auto',
    },
    [`.${imageClass.imageFallback}`]: {
      display: 'inline-block',
      fontStyle: 'italic',
      color: 'var(--purrmd-image-fallback-color)',
      backgroundColor: 'var(--purrmd-image-fallback-bg-color)',
      borderRadius: 'var(--purrmd-image-fallback-border-radius)',
      padding: '0 1.5rem',
    },
  });
  return theme;
};
