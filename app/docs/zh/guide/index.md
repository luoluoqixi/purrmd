# 功能

### 显示模式 - `formattingDisplayMode`

配置 Markdown 显示模式
> 可在 [演示](/zh/introduction/demo) 中点击 `源码模式` 查看效果

```ts
purrmd({
  formattingDisplayMode: 'show',
})
```

支持的配置：

- `'auto'` 默认，当光标在 Markdown 语法周围时自动显示 Markdown 标记

  ```text
  粗体1 粗体2 **粗|体3**
  ```

- `'show'` 始终显示 Markdown 标记，不管光标在哪

  ```text
  **粗体1** **粗体2** **粗|体3**

  ```

### 功能开关 - `features`

默认开启全部功能，如需关闭可传递 `false`

```ts
purrmd({
  features: {
    // 禁用 CodeBlock 和 Image
    [PurrMDFeatures.CodeBlock]: false,
    [PurrMDFeatures.Image]: false,
  },
})
```

### 功能配置 - `featuresConfigs`

Markdown 功能配置

具体配置请查看：[功能配置](./feature-configs.md)

```ts
purrmd({
  featuresConfigs: {
    // 配置 Link 功能配置
    [PurrMDFeatures.Link]: {
      onLinkClickPreview: (url, event) => console.log(`点击Link ${url} 预览模式`),
    },
  },
})
```

### 快捷键开关 - `addKeymap`

设置为 `false` 可禁用所有默认快捷键。


### 默认快捷键 - `defaultKeymaps`

配置默认快捷键

```ts
purrmd({
  // 默认为 true, 设置为 false 可禁用所有默认快捷键
  addKeymap: true,
  defaultKeymaps: {
    // 自定义 加粗、 斜体 的快捷键
    strong: 'Mod-b',
    italic: 'Mod-i',
    // 禁用 高亮、删除线 的快捷键
    highlight: false,
    strikethrough: false,
  },
})
```


### 斜线菜单 - `defaultSlashMenu`

配置斜线菜单设置，详情查看：[斜线菜单配置](./slash-menu-config.md)

```ts
purrmd({
  defaultSlashMenu: {
    // 是否启用斜线菜单, 默认为 true
    show: true,
  },
})
```

### 自定义 `@codemirror/lang-markdown` 扩展配置 - `markdownExtConfig`

PurrMD 底层使用 `@codemirror/lang-markdown` 来解析 Markdown，可以通过此自动自定义配置

具体配置类型请查看：[@codemirror/lang-markdown 文档](https://github.com/codemirror/lang-markdown?tab=readme-ov-file#api-reference)

```ts
purrmd({
  markdownExtConfig: {
    // 禁用 @codemirror/lang-markdown 默认的 enter 键插入空行
    addKeymap: false,
    // 自定义 @codemirror/lang-markdown 扩展
    extensions: [
      ...
    ],
  },
})
```

### 命令

请查看：[命令](./commands.md)

### 主题配置

请查看 [主题配置](./theme-config.md)
