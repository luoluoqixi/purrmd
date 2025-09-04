# Feature Configuration

Use `featuresConfigs` to configure features

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

#### Supported configurations:

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

### Blockquote - `Blockquote`

No configuration available

```ts
interface BlockquoteConfig {}
```

### Code Block - `CodeBlock`

- `onCodeBlockInfoClick` Click event for the language button in the upper right corner of the code block

```ts
interface CodeBlockConfig {
  onCodeBlockInfoClick?: (lang: string, code: string, event: MouseEvent) => void;
}
```

### Emphasis - `Emphasis`

No configuration available

```ts
interface EmphasisConfig {}
```

### Heading - `Heading`

No configuration available

```ts
interface HeadingConfig {}
```

### Highlight - `Highlight`

No configuration available

```ts
interface HighlightConfig {}
```

### Horizontal Rule - `HorizontalRule`

- `onClick` Click event for horizontal rule

```ts
interface HorizontalRuleConfig {
  onClick?: (event: MouseEvent, view: EditorView, node: SyntaxNodeRef) => void;
}
```

### Image - `Image`

- `proxyURL` Proxy URL. The URL obtained through this method will be rendered to the img element.

- `imageAlwaysShow` Whether to always display images, even when Markdown tags (`[]()`) are shown.

- `NoImageAvailableLabel` Prompt text when the image is unavailable. Default: `"No image available"`.

- `ImageLoadFailedLabel` Prompt text when the image fails to load. Default: ``(url) => `Image failed to load: ${url}`` `.

- `onImageDown` Image click event

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

### Inline Code - `InlineCode`

No configuration available

```ts
interface InlineCodeConfig {}
```

### Link - `Link`

- `clickToOpenInSource` How to open links in source mode:
  - `'controlOrCommand'` Hold Control or Command key and click to open the link
  - `'click'` Click to open the link
  - `'none'` Do not open the link

- `clickToOpenInSource` How to open links in preview mode:
  - `'controlOrCommand'` Hold Control or Command key and click to open the link
  - `'click'` Click to open the link
  - `'none'` Do not open the link

- `onLinkClickSource` Link click event in source mode

- `onLinkClickPreview` Link click event in preview mode

```ts
interface LinkConfig {
  clickToOpenInSource?: 'controlOrCommand' | 'click' | 'none';
  clickToOpenInPreview?: 'controlOrCommand' | 'click' | 'none';
  onLinkClickSource?: (url: string, event: MouseEvent) => void;
  onLinkClickPreview?: (url: string, event: MouseEvent) => void;
}
```

### List - `List`

- `taskItemReadonly` Whether task lists are read-only

- `onTaskItemChecked` Task list checked event

```ts
export interface ListConfig {
  taskItemReadonly?: boolean;
  onTaskItemChecked?: (checked: boolean, event: Event) => void;
}
```

### Strikethrough - `Strikethrough`

No configuration available

```ts
interface StrikethroughConfig {}
```

### Strong - `Strong`

No configuration available

```ts
interface StrongConfig {}
```
