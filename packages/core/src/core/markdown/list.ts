import { syntaxTree } from '@codemirror/language';
import { Extension, type Range } from '@codemirror/state';
import {
  Decoration,
  DecorationSet,
  EditorView,
  ViewPlugin,
  ViewUpdate,
  WidgetType,
} from '@codemirror/view';

import { FormattingDisplayMode } from '../types';
import { isSelectRange } from '../utils';

export const listClass = {
  listFormatting: 'purrmd-cm-formatting-list',
  taskFormatting: 'purrmd-cm-formatting-task',

  checkboxFormatting: 'purrmd-cm-formatting-checkbox',
  bulletListItemFormattingHide: 'purrmd-cm-formatting-bullet-list-item-hide',
  bulletListItemFormatting: 'purrmd-cm-formatting-bullet-list-item',
  orderedListItemFormatting: 'purrmd-cm-formatting-ordered-list-item',
  bulletListTaskFormatting: 'purrmd-cm-formatting-bullet-list-task',

  bulletListCheckboxFormatting: 'purrmd-cm-formatting-bullet-list-checkbox',
  orderedListCheckboxFormatting: 'purrmd-cm-formatting-ordered-list-checkbox',
};

class Checkbox extends WidgetType {
  checked: boolean;

  constructor(
    checked: boolean,
    readonly wrapClass: string | null,
    readonly onChecked?: (checked: boolean, event: Event) => void,
    readonly readonly?: boolean,
  ) {
    super();
    this.checked = checked;
  }

  toDOM() {
    const el = document.createElement('input');
    el.type = 'checkbox';
    el.className = listClass.checkboxFormatting;
    el.checked = this.checked;
    el.disabled = this.readonly === true;
    el.tabIndex = -1;
    el.onmousedown = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };
    el.onchange = (e) => {
      const checked = (e.target as HTMLInputElement).checked;
      if (this.onChecked) {
        this.onChecked(checked, e);
      }
      e.preventDefault();
      e.stopPropagation();
    };
    if (this.wrapClass) {
      const wrapper = document.createElement('span');
      wrapper.className = this.wrapClass;
      wrapper.appendChild(el);
      return wrapper;
    }
    return el;
  }

  ignoreEvent() {
    return true;
  }
}

function updateListDecorations(
  mode: FormattingDisplayMode,
  config: ListConfig | undefined,
  view: EditorView,
): DecorationSet {
  const state = view.state;
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
              const checked =
                state.doc.sliceString(node.from + 1, node.to - 1).toLowerCase() === 'x';
              let decoration: Range<Decoration> | Range<Decoration>[] | undefined;
              if (root.name === 'BulletList') {
                // 无序任务列表
                if (
                  mode !== 'show' &&
                  !isSelectRange(state, {
                    from: node.from - 2,
                    to: node.to,
                  })
                ) {
                  const pos = node.from;
                  const onChecked = (checked: boolean, e: Event) => {
                    view.dispatch({
                      changes: {
                        from: pos + 1,
                        to: pos + 2,
                        insert: checked ? 'x' : ' ',
                      },
                    });
                    if (config?.onTaskItemChecked) {
                      config?.onTaskItemChecked?.(checked, e);
                    } else {
                      e.stopPropagation();
                    }
                  };
                  decoration = Decoration.replace({
                    widget: new Checkbox(
                      checked,
                      listClass.bulletListCheckboxFormatting,
                      onChecked,
                      config?.taskItemReadonly,
                    ),
                  }).range(node.from - 2, node.to);
                } else {
                  decoration = Decoration.mark({
                    class: listClass.bulletListCheckboxFormatting,
                  }).range(node.from - 2, node.to);
                }
              } else if (root.name === 'OrderedList') {
                const cursor = parent.cursor();
                if (cursor.prevSibling() && cursor.name === 'ListMark') {
                  const from = cursor.from;
                  // 有序任务列表
                  decoration = [];
                  if (
                    mode !== 'show' &&
                    !isSelectRange(state, {
                      from,
                      to: node.to,
                    })
                  ) {
                    const pos = node.from;
                    const onChecked = (checked: boolean, e: Event) => {
                      view.dispatch({
                        changes: {
                          from: pos + 1,
                          to: pos + 2,
                          insert: checked ? 'x' : ' ',
                        },
                      });
                      if (config?.onTaskItemChecked) {
                        config?.onTaskItemChecked?.(checked, e);
                      } else {
                        e.stopPropagation();
                      }
                    };
                    decoration.push(
                      Decoration.replace({
                        widget: new Checkbox(
                          checked,
                          listClass.orderedListCheckboxFormatting,
                          onChecked,
                          config?.taskItemReadonly,
                        ),
                      }).range(node.from, node.to),
                    );
                  }
                  decoration.push(
                    Decoration.mark({
                      class: listClass.orderedListCheckboxFormatting,
                    }).range(from, node.to),
                  );
                }
              }
              if (decoration) {
                if (Array.isArray(decoration)) {
                  decorations.push(...decoration);
                } else {
                  decorations.push(decoration);
                }
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
  const listPlugin = ViewPlugin.fromClass(
    class {
      decorations: DecorationSet;

      constructor(readonly view: EditorView) {
        this.decorations = updateListDecorations(mode, config, view);
      }

      update(update: ViewUpdate) {
        if (update.docChanged || update.selectionSet || update.focusChanged) {
          this.decorations = updateListDecorations(mode, config, update.view);
        }
      }
    },
    {
      decorations: (v) => v.decorations,
    },
  );
  return listPlugin;
}

export interface ListConfig {
  taskItemReadonly?: boolean;
  onTaskItemChecked?: (checked: boolean, event: Event) => void;
}
