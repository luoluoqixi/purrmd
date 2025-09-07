# PurrMD

一个轻量级、现代化的 Markdown 编辑器插件，提供类似 Obsidian 的流畅编辑体验。

**PurrMD** 是一个 CodeMirror6 的所见即所得 Markdown 编辑**插件**，此项目专注于 Markdown 编辑插件部分，而非完整的编辑器

[![NPM version](https://img.shields.io/npm/v/purrmd.svg?style=flat-square)](https://npmjs.org/package/purrmd) [![Build Status](https://github.com/luoluoqixi/purrmd/actions/workflows/release.yml/badge.svg)](https://github.com/luoluoqixi/purrmd/actions/workflows/release.yml)

[在线演示](https://purrmd.luoluoqixi.com/introduction/demo.html) | [文档](https://purrmd.luoluoqixi.com/introduction/)

[English](./README.md)


## [🚀 快速开始](https://purrmd.luoluoqixi.com/zh/introduction/getting-started.html)

### 安装

```bash
# npm
npm install --save purrmd codemirror @codemirror/view
# pnpm
pnpm add purrmd codemirror @codemirror/view
# yarn
yarn add purrmd codemirror @codemirror/view
```

### 基础用法

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

## ✨ 核心特性

- **所见即所得编辑** - 即时预览 Markdown 渲染效果
- **GFM 兼容** - 支持 GitHub Flavored Markdown
- **快捷键支持** - 快捷键提高编辑效率
- **斜线菜单** - 快速插入 Markdown 语法元素

## 📋 功能支持

### ✨ 基础功能

| 功能 | 语法示例 |
|------|----------|
| **标题** | `# 一级标题` ~ `###### 六级标题` |
| **粗体** | `**粗体**` |
| **斜体** | `*斜体*` |
| **删除线** | `~~删除线~~` |
| **高亮** | `==高亮==` |
| **行内代码** | `` `行内代码` `` |
| **链接** | `[text](url)` |
| **图片** | `![alt](src)` |
| **无序列表** | `- 无序列表` |
| **有序列表** | `1. 无序列表` |
| **无序任务列表** | `- [ ] 无序任务列表` |
| **有序任务列表** | `1. [ ] 有序任务列表` |
| **块引用** | `> 块引用` |
| **水平分割线** | `---` |
| **代码块** | ` ```javascript ` <br>`console.log("Hello PurrMD");`<br> ` ``` ` |


### ⌨️ 快捷键

PurrMD 提供以下快捷键来提高编辑效率：

`Ctrl+B` - 加粗

`Ctrl+I` - 斜体

`Ctrl+D` - 删除线

`Ctrl+H` - 高亮

### 🔧 斜线菜单

在编辑器中输入 / 字符可以触发斜线菜单，快速插入各种 Markdown 语法元素


## 🙏 致谢

特别感谢这些优秀项目带来的灵感：

- [HyperMD](https://github.com/laobubu/HyperMD) - 开创性的 WYSIWYG Markdown 编辑体验
- [ProseMark](https://github.com/jsimonrichard/ProseMark) - CodeMirror6 的 Markdown 实现参考
- [CodeMirror6](https://codemirror.net/) - 强大的编辑器内核

如果没有以上项目，那么就不会有PurrMD


## ❓ 常见问题

**Q：CodeMirror6 已经有了 ProseMark 为什么还会有这个项目？**

A：此编辑器实现的初衷是为我个人的笔记软件 [LonaNote](https://github.com/luoluoqixi/lonanote) 提供 MarkDown 编辑支持，自己实现编辑器功能扩展与定制会更容易一些。


**Q：是否支持 Vue/React？**

A：CodeMirror 编辑器与框架无关，可以轻松集成到任何前端框架

## 📝 许可证

[MIT license](https://github.com/luoluoqixi/purrmd/blob/main/LICENSE)
