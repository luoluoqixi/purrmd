# 斜线菜单配置

使用 `defaultSlashMenu` 配置斜线菜单设置

```ts
purrmd({
  defaultSlashMenu: {
    ...
  },
})
```

### 斜线菜单开关 - `show`

`true` | `false` | `undefined` 是否显示斜线菜单

### 打开菜单的字符 - `openKey`

`string` | `undefined` 默认为 `"/"`

### 斜线菜单标题 - `title`

`boolean` | `string` | `undefined` 如果设置为 `false`，则不显示标题，默认：`"Insert Menu"`

### 默认命令配置 - `defaultCommands`

如 heading1：

- `'show'` 菜单是否显示
- `'label'` 菜单显示的名字

```ts
heading1?: {
  show?: boolean;
  label?: string;
}
```


### 自定义斜线菜单命令 - `customCommands`

`SlashCommand[]` | `undefined`

```ts
interface SlashCommand {
  label: string;
  command?: (view: EditorView) => void;
}
```

### 根节点的 class - `className`

`string` | `undefined` 默认：`undefined`

### 标题 class - `classNameTitle`

`string` | `undefined` 默认：`undefined`

### 菜单容器的 class - `classNameContent`

`string` | `undefined` 默认：`undefined`

### 菜单项的 class - `classNameItem`

`string` | `undefined` 默认：`undefined`

### 菜单项选中时的 class - `classNameItemActive`

`string` | `undefined` 默认：`undefined`
