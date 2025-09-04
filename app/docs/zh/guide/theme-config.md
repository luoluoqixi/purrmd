# 主题配置

配置主题设置

```ts
purrmdTheme({
  ...
}),
```

### 主题模式 - `mode`

- `'light'` 默认主题 亮色模式

- `'dark'` 默认主题 暗色模式

- `'dracula'` dracula 主题 暗色模式

- `'base'` 只包含必要的基础主题


### 主颜色 - `primaryColor`

- `string` | `undefined` 主颜色，只支持 `mode` 为 `'light'` | `'dark'` | `'dracula'`


### Markdown 标记颜色 - `formattingColor`

- `string` | `undefined` Markdown 标记颜色，默认为 `primaryColor`


### Markdown 标记透明度 - `formattingOpacity`

- `string` | `undefined` Markdown 标记透明度，默认为 `'0.8'`


### 暗色模式 - `isDark`

- `boolean` | `undefined` 是否是暗色模式，默认跟随 `mode`


### CSS 变量

支持使用 CSS 变量覆盖主题

```ts
const theme = EditorView.theme(
  {
    '.cm-content': {
      '--purrmd-primary-color': 'blue',
      ...
    },
  },
  {
    dark: false,
  },
);
const view = new EditorView({
  parent: document.getElementById('root')!,
  extensions: [
    theme,
    purrmd(),
    purrmdTheme(),
  ],
});
```

```scss
// 主颜色
--purrmd-primary-color
// 标记颜色
--purrmd-formatting-color
// 标记透明度
--purrmd-formatting-opacity

// ...

```

更多 CSS 变量参考：
[packages/core/src/core/themes/base/markdown](https://github.com/luoluoqixi/purrmd/tree/main/packages/core/src/core/themes/base/markdown)
