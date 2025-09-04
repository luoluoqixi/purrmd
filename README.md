# PurrMD

A lightweight, modern Markdown editor plugin that provides a smooth editing experience similar to Obsidian.

**PurrMD** is a WYSIWYG Markdown editing **plugin** for CodeMirror6. This project focuses on the Markdown editing plugin component rather than being a complete editor.

[Live Demo](https://purrmd.luoluoqixi.com/introduction/demo.html) | [Documentation](https://purrmd.luoluoqixi.com/introduction/)

[中文文档](./README_zh.md)


## [🚀 Quick Start](https://purrmd.luoluoqixi.com/zh/introduction/getting-started.html)

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

## ✨ Core Features

- **WYSIWYG Editing** - Instant preview of Markdown rendering
- **GFM Compatible** - Supports GitHub Flavored Markdown
- **Shortcut Support** - Hotkeys to improve editing efficiency
- **Slash Menu** - Quickly insert Markdown syntax elements

## 📋 Supported Features

### ✨ Basic Features

| Feature | Syntax Example |
|------|----------|
| **Headings** | `# H1` ~ `###### H6` |
| **Bold** | `**bold**` |
| **Italic** | `*italic*` |
| **Strikethrough** | `~~strikethrough~~` |
| **Highlight** | `==highlight==` |
| **Inline Code** | `` `code` `` |
| **Link** | `[text](url)` |
| **Image** | `![alt](src)` |
| **Bullet List** | `- Bullet List` |
| **Ordered List** | `1. Ordered List` |
| **Bullet Task List** | `- [ ] Bullet Task List` |
| **Ordered Task List** | `1. [ ] Ordered Task List` |
| **Blockquote** | `> Blockquote` |
| **Horizontal Rule** | `---` |
| **Code Block** | ` ```javascript ` <br>`console.log("Hello PurrMD");`<br> ` ``` ` |

### ⌨️ Shortcuts

PurrMD provides the following shortcuts to improve editing efficiency:

`Ctrl+B` - Bold

`Ctrl+I` - Italic

`Ctrl+D` / Strikethrough

`Ctrl+H` / Highlight

### 🔧 Slash Menu

Typing the / character in the editor triggers a slash menu, allowing quick insertion of various Markdown syntax elements


## 🙏 Acknowledgments

Special thanks to these excellent projects for inspiration:

- [HyperMD](https://github.com/laobubu/HyperMD) - Pioneering WYSIWYG Markdown editing experience
- [ProseMark](https://github.com/jsimonrichard/ProseMark) - Reference implementation for CodeMirror6 Markdown
- [CodeMirror6](https://codemirror.net/) - Powerful editor core

Without the above projects, PurrMD would not exist.


## ❓ FAQ

**Q：Since CodeMirror6 already has ProseMark, why does this project exist?**

A：The initial purpose of this editor was to provide Markdown editing support for my personal note-taking app [LonaNote](https://github.com/luoluoqixi/lonanote). Implementing it myself makes it easier to extend and customize editor features.


**Q：Does it support Vue/React?**

A：The CodeMirror editor is framework-agnostic and can be easily integrated with any frontend framework.

## 📝 License

[MIT license](https://github.com/luoluoqixi/purrmd/blob/main/LICENSE)
