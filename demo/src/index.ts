import { EditorView } from '@codemirror/view';
import { basicSetup } from 'codemirror';

import './index.css';

const view = new EditorView({
  doc: __INIT_DOCUMENT,
  parent: document.getElementById('root')!,
  extensions: [basicSetup],
});

console.log(view);
