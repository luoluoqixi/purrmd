# Slash Menu Configuration

Use `defaultSlashMenu` to configure slash menu settings

```ts
purrmd({
  defaultSlashMenu: {
    ...
  },
})
```

### Slash Menu Toggle - `show`

`true` | `false` | `undefined` Whether to show the slash menu

### Character to Open the Menu - `openKey`

`string` | `undefined` Default: `"/"`

### Slash Menu Title - `title`

`boolean` | `string` | `undefined` If set to `false`, the title will not be displayed. Default: `"Insert Menu"`

### Default Command Configuration - `defaultCommands`

Example for heading1:

- `'show'` Whether the menu item is displayed
- `'label'` The display name of the menu item

```ts
heading1?: {
  show?: boolean;
  label?: string;
}
```


### Custom Slash Menu Commands - `customCommands`

`SlashCommand[]` | `undefined`

```ts
interface SlashCommand {
  label: string;
  command?: (view: EditorView) => void;
}
```

### Root Node Class - `className`

`string` | `undefined` Default: `undefined`

### Title Class - `classNameTitle`

`string` | `undefined` Default: `undefined`

### Menu Container Class - `classNameContent`

`string` | `undefined` Default: `undefined`

### Menu Item Class - `classNameItem`

`string` | `undefined` Default: `undefined`

### Active Menu Item Class - `classNameItemActive`

`string` | `undefined` Default: `undefined`
