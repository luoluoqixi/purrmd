# Theme Configuration

Configure theme settings

```ts
purrmdTheme({
  ...
}),
```

### Theme Mode - `mode`

- `'light'` Default theme, light mode

- `'dark'` Default theme, dark mode

- `'dracula'` Dracula theme, dark mode

- `'base'` Only includes essential base theme


### Primary Color - `primaryColor`

- `string` | `undefined` Primary color, only supported when `mode` is `'light'` | `'dark'` | `'dracula'`


### Markdown Marker Color - `formattingColor`

- `string` | `undefined` Markdown marker color, defaults to `primaryColor`


### Markdown Marker Opacity - `formattingOpacity`

- `string` | `undefined` Markdown marker opacity, defaults to `'0.8'`


### Dark Mode - `isDark`

- `boolean` | `undefined` Whether it is dark mode, defaults to following the `mode` setting


### CSS Variables

Supports using CSS variables to override the themeSupports using CSS variables to override the theme

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
// Primary color
--purrmd-primary-color
// Marker color
--purrmd-formatting-color
// Marker opacity
--purrmd-formatting-opacity

// ...

```

For more CSS variables, refer to:
[packages/core/src/core/themes/base/markdown](https://github.com/luoluoqixi/purrmd/tree/main/packages/core/src/core/themes/base/markdown)
