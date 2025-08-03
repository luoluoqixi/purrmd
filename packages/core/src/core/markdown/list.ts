import { syntaxTree } from '@codemirror/language';
import { EditorState, Extension, type Range, StateField } from '@codemirror/state';
import { Decoration, DecorationSet, EditorView } from '@codemirror/view';

import { FormattingDisplayMode } from '../types';
import { isSelectRange } from '../utils';

export const listClass = {
  bulletListItemFormattingHide: 'purrmd-cm-formatting-bullet-list-item-hide',
  bulletListItemFormatting: 'purrmd-cm-formatting-bullet-list-item',
  orderedListItemFormatting: 'purrmd-cm-formatting-ordered-list-item',
  listFormatting: 'purrmd-cm-formatting-list',
};

function updateListDecorations(
  mode: FormattingDisplayMode,
  config: ListConfig | undefined,
  state: EditorState,
): DecorationSet {
  const decorations: Range<Decoration>[] = [];
  syntaxTree(state).iterate({
    enter(node) {
      if (node.type.name === 'ListMark') {
        // BulletList(ListItem(ListMark()))
        const parent = node.node.parent;
        if (parent && parent.name === 'ListItem') {
          const root = parent.parent;
          if (root) {
            const cursor = node.node.cursor();
            if (!cursor.nextSibling() || cursor.name !== 'Task') {
              let decoration: Range<Decoration> | undefined;
              if (root.name === 'BulletList') {
                // 无序列表
                if (mode !== 'show' && !isSelectRange(state, node)) {
                  decoration = Decoration.mark({
                    class: listClass.bulletListItemFormattingHide,
                  }).range(node.from, node.to);
                } else {
                  decoration = Decoration.mark({
                    class: listClass.bulletListItemFormatting,
                  }).range(node.from, node.to);
                }
              } else if (root.name === 'OrderedList') {
                // 有序列表
                decoration = Decoration.mark({
                  class: listClass.orderedListItemFormatting,
                }).range(node.from, node.to);
              }
              if (decoration) {
                decorations.push(decoration);
              }
            }
          }
        }
      } else if (node.type.name === 'TaskMarker') {
        // BulletList(ListItem(Task(TaskMarker())))
        const parent = node.node.parent;
        if (parent && parent.name === 'Task') {
          const item = parent.parent;
          if (item && item.name === 'ListItem') {
            const root = item.parent;
            if (root) {
              if (root.name === 'BulletList') {
                // 无序任务列表
              } else if (root.name === 'OrderedList') {
                // 有序任务列表
              }
            }
          }
        }
      }
    },
  });
  return Decoration.set(decorations, true);
}

export function list(mode: FormattingDisplayMode, config?: ListConfig): Extension {
  const listPlugin = StateField.define<DecorationSet>({
    create(state) {
      return updateListDecorations(mode, config, state);
    },

    update(deco, tr) {
      if (tr.docChanged || tr.selection) {
        return updateListDecorations(mode, config, tr.state);
      }
      return deco.map(tr.changes);
    },

    provide: (f) => [EditorView.decorations.from(f)],
  });
  return listPlugin;
}

export interface ListConfig {}
