# Getting Started

### Installation

```bash
# npm
npm install --save purrmd codemirror @codemirror/view
# pnpm
pnpm add purrmd codemirror @codemirror/view
# yarn
yarn add purrmd codemirror @codemirror/view
```

### Basic Usage

```javascript
import { EditorView } from '@codemirror/view';
import { basicSetup } from 'codemirror';
import { purrmd, purrmdTheme } from 'purrmd';

const view = new EditorView({
  doc: '# Hello PurrMD',
  parent: document.getElementById('root')!,
  extensions: [
    basicSetup,
    purrmd(),
    purrmdTheme(),
  ],
});
```
