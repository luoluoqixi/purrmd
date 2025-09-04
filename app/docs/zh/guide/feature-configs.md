# 功能配置

使用 `featuresConfigs` 配置功能

```ts
purrmd({
  featuresConfigs: {
    [PurrMDFeatures.Link]: {
      ...
    },
    ...
  },
})
```

#### 支持的配置：

```ts
interface PurrMDFeatureConfig {
  [PurrMDFeatures.Blockquote]?: BlockquoteConfig;
  [PurrMDFeatures.CodeBlock]?: CodeBlockConfig;
  [PurrMDFeatures.Emphasis]?: EmphasisConfig;
  [PurrMDFeatures.Heading]?: HeadingConfig;
  [PurrMDFeatures.Highlight]?: HighlightConfig;
  [PurrMDFeatures.HorizontalRule]?: HorizontalRuleConfig;
  [PurrMDFeatures.Image]?: ImageConfig;
  [PurrMDFeatures.InlineCode]?: InlineCodeConfig;
  [PurrMDFeatures.Link]?: LinkConfig;
  [PurrMDFeatures.List]?: ListConfig;
  [PurrMDFeatures.Strikethrough]?: StrikethroughConfig;
  [PurrMDFeatures.Strong]?: StrongConfig;
}
```

### 引用 - `Blockquote`

暂无配置

```ts
interface BlockquoteConfig {}
```

### 代码块 - `CodeBlock`

- `onCodeBlockInfoClick` 代码块右上角的语言按钮点击事件

```ts
interface CodeBlockConfig {
  onCodeBlockInfoClick?: (lang: string, code: string, event: MouseEvent) => void;
}
```

### 斜体 - `Emphasis`

暂无配置

```ts
interface EmphasisConfig {}
```

### 标题 - `Heading`

暂无配置

```ts
interface HeadingConfig {}
```

### 高亮 - `Highlight`

暂无配置

```ts
interface HighlightConfig {}
```

### 水平分割线 - `HorizontalRule`

- `onClick` 水平分割线点击事件

```ts
interface HorizontalRuleConfig {
  onClick?: (event: MouseEvent, view: EditorView, node: SyntaxNodeRef) => void;
}
```

### 图片 - `Image`

- `proxyURL` 代理URL，将通过此方法拿到的 URL 渲染到 img

- `imageAlwaysShow` 是否始终显示图片，即使当 Markdown 标签 （`[]()`） 已显示时

- `NoImageAvailableLabel` 当图片不可用时的提示文本，默认： `"No image available"`

- `ImageLoadFailedLabel` 当图片加载失败时的提示文本，默认：``(url) => `Image failed to load: ${url}` ``

- `onImageDown` 图片点击事件

```ts
interface ImageConfig {
  proxyURL?: (url: string) => string;
  imageAlwaysShow?: boolean;
  NoImageAvailableLabel?: string;
  ImageLoadFailedLabel?: (url: string) => string;
  onImageDown?: (
    e: MouseEvent,
    url: string | null | undefined,
    rawUrl: string | null | undefined,
  ) => void;
}
```

### 内联代码 - `InlineCode`

暂无配置

```ts
interface InlineCodeConfig {}
```

### 链接 - `Link`

- `clickToOpenInSource` 源码模式下，链接打开方式
  - `'controlOrCommand'` 按住 Control 或 Command 键并点击鼠标打开链接
  - `'click'` 点击鼠标打开链接
  - `'none'` 不打开链接

- `clickToOpenInPreview` 预览模式下，链接打开方式
  - `'controlOrCommand'` 按住 Control 或 Command 键并点击鼠标打开链接
  - `'click'` 点击鼠标打开链接
  - `'none'` 不打开链接

- `onLinkClickSource` 源码模式下，链接点击事件

- `onLinkClickPreview` 预览模式下，链接点击事件

```ts
interface LinkConfig {
  clickToOpenInSource?: 'controlOrCommand' | 'click' | 'none';
  clickToOpenInPreview?: 'controlOrCommand' | 'click' | 'none';
  onLinkClickSource?: (url: string, event: MouseEvent) => void;
  onLinkClickPreview?: (url: string, event: MouseEvent) => void;
}
```

### 列表 - `List`

- `taskItemReadonly` 任务列表是否是只读

- `onTaskItemChecked` 任务列表 Checked 事件

```ts
export interface ListConfig {
  taskItemReadonly?: boolean;
  onTaskItemChecked?: (checked: boolean, event: Event) => void;
}
```

### 删除线 - `Strikethrough`

暂无配置

```ts
interface StrikethroughConfig {}
```

### 粗体 - `Strong`

暂无配置

```ts
interface StrongConfig {}
```
