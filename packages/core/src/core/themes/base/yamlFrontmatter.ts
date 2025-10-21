import { syntaxTree } from '@codemirror/language';
import { RangeSetBuilder } from '@codemirror/state';
import { Decoration, EditorView } from '@codemirror/view';

import { YamlFrontmatterConfig } from '@/core/types';

export function yamlFrontmatterStyleExtension(yamlConfig?: YamlFrontmatterConfig) {
  const yamlClass = yamlConfig?.customClass || 'purrmd-cm-yaml-frontmatter';
  const yamlIsHide = yamlConfig?.hideFrontmatter === true;

  const theme = EditorView.baseTheme({
    [`& .cm-line .${yamlClass}`]: {
      display: yamlIsHide ? 'none' : 'inline',
    },
    '.cm-gutterElement[style*="height: 0px"]': {
      display: 'none',
    },
    '.cm-gutterElement[style*="height:0px"]': {
      display: 'none',
    },
  });

  const decorator = EditorView.decorations.compute(['doc'], (state) => {
    const builder = new RangeSetBuilder<Decoration>();
    const tree = syntaxTree(state);

    tree.iterate({
      enter: (node) => {
        if (node.name === 'Frontmatter') {
          const decoration = Decoration.mark({
            class: yamlClass,
            attributes: {
              'data-yaml-frontmatter': 'true',
            },
          });

          builder.add(node.from, node.to, decoration);
        }
      },
    });

    return builder.finish();
  });

  return [decorator, theme];
}
