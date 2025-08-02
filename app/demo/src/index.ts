import { syntaxTree } from '@codemirror/language';
import { EditorView } from '@codemirror/view';
import { basicSetup } from 'codemirror';
import { purrmd, purrmdTheme } from 'purrmd';

import './index.css';

const language = navigator.language;
const documentText = language === 'zh-CN' ? __INIT_DOCUMENT_ZH : __INIT_DOCUMENT;

const view = new EditorView({
  doc: documentText,
  parent: document.getElementById('root')!,
  extensions: [
    basicSetup,
    EditorView.lineWrapping,
    purrmd({
      visibilityMarksMode: 'auto',
    }),
    purrmdTheme({
      mode: 'light',
    }),
  ],
});

console.log(view);

console.log(syntaxTree(view.state).toString());
