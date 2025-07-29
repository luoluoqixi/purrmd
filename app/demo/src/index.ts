import { EditorView } from '@codemirror/view';
import { basicSetup } from 'codemirror';
import { purrmd } from 'purrmd';

import './index.css';

const view = new EditorView({
  doc: __INIT_DOCUMENT,
  parent: document.getElementById('root')!,
  extensions: [basicSetup, EditorView.lineWrapping, purrmd()],
});

console.log(view);
