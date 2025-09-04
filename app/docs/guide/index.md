# Features

### Display Mode - `formattingDisplayMode`

Configure Markdown display mode
> Click `Source Mode` in the [Demo](/introduction/demo) to see the effect

```ts
purrmd({
  formattingDisplayMode: 'show',
})
```

Supported configurations:

- `'auto'` Default, automatically displays Markdown markers when the cursor is near Markdown syntax

  ```text
  Bold1 Bold2 **Bo|ld3**
  ```

- `'show'` Always displays Markdown markers, regardless of cursor position

  ```text
  **Bold1** **Bold2** **Bo|ld3**

  ```

### Feature Toggle - `features`

All features are enabled by default. Pass `false` to disable specific features.

```ts
purrmd({
  features: {
    // Disable CodeBlock and Image
    [PurrMDFeatures.CodeBlock]: false,
    [PurrMDFeatures.Image]: false,
  },
})
```

### Feature Configuration - `featuresConfigs`

Markdown feature configuration

For detailed configuration, see: [Feature Configuration](./feature-configs.md)

```ts
purrmd({
  featuresConfigs: {
    // Configure Link feature settings
    [PurrMDFeatures.Link]: {
      onLinkClickPreview: (url, event) => console.log(`点击Link ${url} 预览模式`),
    },
  },
})
```

### Shortcut Toggle - `addKeymap`

Set to `false` to disable all default shortcuts.


### Default Shortcuts - `defaultKeymaps`

Configure default shortcuts

```ts
purrmd({
  // Default is true, set to false to disable all default shortcuts
  addKeymap: true,
  defaultKeymaps: {
    // Customize bold and italic shortcuts
    strong: 'Mod-b',
    italic: 'Mod-i',
    // Disable highlight and strikethrough shortcuts
    highlight: false,
    strikethrough: false,
  },
})
```


### Slash Menu - `defaultSlashMenu`

Configure slash menu settings. For details, see: [Slash Menu Configuration](./slash-menu-config.md)

```ts
purrmd({
  defaultSlashMenu: {
    // Whether to enable the slash menu, default is true
    show: true,
  },
})
```

### Custom `@codemirror/lang-markdown` Extension Configuration - `markdownExtConfig`

PurrMD uses `@codemirror/lang-markdown` for Markdown parsing. Use this option to customize the configuration.

For specific configuration types, see: [@codemirror/lang-markdown Documentation](https://github.com/codemirror/lang-markdown?tab=readme-ov-file#api-reference)

```ts
purrmd({
  markdownExtConfig: {
    // Disable @codemirror/lang-markdown's default Enter key behavior for inserting empty lines
    addKeymap: false,
    // Customize @codemirror/lang-markdown extensions
    extensions: [
      ...
    ],
  },
})
```

### Theme Configuration

See [Theme Configuration](./theme-config.md)
