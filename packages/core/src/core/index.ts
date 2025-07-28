import { markdown } from '@codemirror/lang-markdown';
import { languages } from '@codemirror/language-data';
import { type Extension } from '@codemirror/state';
import { GFM } from '@lezer/markdown';

export function purrmd(): Extension {
  return [
    markdown({
      codeLanguages: languages,
      extensions: [GFM],
    }),
  ];
}
