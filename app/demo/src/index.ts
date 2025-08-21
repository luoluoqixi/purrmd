import { syntaxTree } from '@codemirror/language';
import { EditorView } from '@codemirror/view';
import { basicSetup } from 'codemirror';
import { purrmd, purrmdTheme } from 'purrmd';

import './index.css';

let editor: EditorView | null = null;
let sourceMode = false;
let themeMode: 'light' | 'dark' = 'light';

const language = navigator.language;
const documentText = language === 'zh-CN' ? __INIT_DOCUMENT_ZH : __INIT_DOCUMENT;

const createEditor = (sourceMode: boolean) => {
  if (editor) {
    editor.destroy();
    editor = null;
  }
  const view = new EditorView({
    doc: documentText,
    parent: document.getElementById('root')!,
    extensions: [
      basicSetup,
      EditorView.lineWrapping,
      purrmd({
        formattingDisplayMode: sourceMode ? 'show' : 'auto',
      }),
      purrmdTheme({
        mode: themeMode,
      }),
    ],
  });
  console.log(view);
  console.log(syntaxTree(view.state).toString());
  editor = view;
  return view;
};

const appendTestBtn = (text: string, onClick: (e: MouseEvent) => void) => {
  const root = document.getElementById('root')!;
  const btnWrapId = 'test-button-wrap';
  if (!document.getElementById(btnWrapId)) {
    const wrap = document.createElement('div');
    wrap.id = btnWrapId;
    root.appendChild(wrap);
  }
  const btnWrap = document.getElementById(btnWrapId)!;
  const btn = document.createElement('button');
  btn.innerHTML = text;
  btn.className = 'test-btn';
  btn.onclick = onClick;
  btnWrap.appendChild(btn);
};

appendTestBtn('Source Mode', (e) => {
  e.preventDefault();
  sourceMode = !sourceMode;
  createEditor(sourceMode);
});

appendTestBtn('Dark Mode', (e) => {
  e.preventDefault();
  themeMode = themeMode === 'light' ? 'dark' : 'light';
  createEditor(sourceMode);
});

createEditor(sourceMode);
