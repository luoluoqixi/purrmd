import { Prec } from '@codemirror/state';
import { EditorView, KeyBinding, ViewPlugin, ViewUpdate, keymap } from '@codemirror/view';

import {
  insertBlockquote,
  insertCodeBlock,
  insertHeading1,
  insertHeading2,
  insertHeading3,
  insertHeading4,
  insertHeading5,
  insertHeading6,
  insertHorizontalRule,
  insertImage,
  insertLink,
  insertOrderedList,
  insertTable,
  insertTaskList,
  insertUnorderedList,
} from '../command/command';
import { slashMenuClass } from '../themes/base/slashMenu';
import { DefaultSlashMenuConfig } from '../types';

export interface SlashCommand {
  label: string;
  command?: (view: EditorView) => void;
}

function isSlashBeforeCursor(view: EditorView) {
  const pos = view.state.selection.main.from;
  if (pos === 0) return false;
  const line = view.state.doc.lineAt(pos);
  const textBeforeCursor = view.state.doc.sliceString(line.from, pos);
  return /^\s*\/$/.test(textBeforeCursor);
}

export const slashMenu = (
  commands: SlashCommand[],
  {
    title,
    className,
    classNameItem,
    classNameItemActive,
    classNameTitle,
    classNameContent,
  }: DefaultSlashMenuConfig,
) =>
  ViewPlugin.fromClass(
    class {
      view: EditorView;
      menu: HTMLDivElement | null = null;
      items: HTMLDivElement[] = [];
      selectedIndex = 0;
      menuVisible = false;
      classItemActiveCustom: string;
      classItemCustom: string;

      constructor(view: EditorView) {
        this.view = view;
        this.createMenu();
        this.classItemActiveCustom = classNameItemActive || '';
        this.classItemCustom = classNameItem || '';
      }

      createMenu() {
        this.menu = document.createElement('div');
        this.menu.style.position = 'absolute';
        this.menu.style.display = 'none';
        const classCustom = className || '';
        const classTitleCustom = classNameTitle || '';
        const classContentCustom = classNameContent || '';

        this.menu.className = `${classCustom} ${slashMenuClass.slashMenu}`;

        if (title !== false) {
          const titleText = typeof title === 'string' && title.length > 0 ? title : 'Insert Menu';
          const titleDom = document.createElement('div');
          titleDom.textContent = titleText;
          titleDom.className = `${classTitleCustom} ${slashMenuClass.slashMenuTitle}`;
          this.menu.appendChild(titleDom);
        }

        const content = document.createElement('div');
        content.className = `${classContentCustom} ${slashMenuClass.slashMenuContent}`;
        this.menu.appendChild(content);

        commands.forEach((cmd, index) => {
          const item = document.createElement('div');
          item.textContent = cmd.label;
          item.className = `${this.classItemCustom} ${slashMenuClass.slashMenuItem}`;

          item.addEventListener('mousedown', (e) => {
            e.preventDefault();
            this.callCommand(cmd);
            this.closeMenu();
          });

          item.addEventListener('mouseenter', () => {
            this.setSelectedIndex(index);
          });

          content.appendChild(item);
          this.items.push(item);
        });

        this.view.scrollDOM.appendChild(this.menu);
      }

      update(update: ViewUpdate) {
        const view = update.view;
        if (isSlashBeforeCursor(view)) {
          this.openMenu();
        } else {
          this.closeMenu();
        }
      }

      openMenu() {
        if (!this.menu) return;
        const pos = this.view.state.selection.main.from;
        requestAnimationFrame(() => {
          const coords = this.view.coordsAtPos(pos);
          if (!coords) return;

          const scrollBox = this.view.scrollDOM.getBoundingClientRect();
          const top = coords.bottom - scrollBox.top + this.view.scrollDOM.scrollTop;
          const left = coords.left - scrollBox.left + this.view.scrollDOM.scrollLeft;

          this.menuVisible = true;
          this.menu!.style.top = `${top}px`;
          this.menu!.style.left = `${left}px`;
          this.menu!.style.display = 'block';
          this.selectedIndex = 0;
          this.menu!.scrollTop = 0;
          this.highlightSelected();
        });
      }

      closeMenu() {
        if (!this.menu) return;
        this.menu.style.display = 'none';
        this.menuVisible = false;
        this.selectedIndex = 0;
      }

      highlightSelected() {
        if (!this.menu) return;
        this.items.forEach((child, i) => {
          const isSelected = i === this.selectedIndex;
          if (isSelected) {
            child.className = `${classNameItem || ''} ${slashMenuClass.slashMenuItem} ${this.classItemActiveCustom} ${slashMenuClass.slashMenuItemActive}`;
          } else {
            child.className = `${classNameItem || ''} ${slashMenuClass.slashMenuItem}`;
          }
        });
      }

      selectNext() {
        if (!this.menu || this.menu.style.display !== 'block') return;
        const selectedIndex = (this.selectedIndex + 1) % this.items.length;
        this.setSelectedIndex(selectedIndex);
      }

      selectPrev() {
        if (!this.menu || this.menu.style.display !== 'block') return;
        const selectedIndex = (this.selectedIndex - 1 + this.items.length) % this.items.length;
        this.setSelectedIndex(selectedIndex);
      }

      setSelectedIndex(index: number) {
        if (this.selectedIndex === index) return;
        this.selectedIndex = index;
        this.highlightSelected();
        const selectedEl = this.items[index];
        if (selectedEl) {
          selectedEl.scrollIntoView({ block: 'nearest' });
        }
      }

      confirmSelected() {
        if (!this.menu || this.menu.style.display !== 'block') return;
        const cmd = commands[this.selectedIndex];
        this.callCommand(cmd);
        this.closeMenu();
      }

      callCommand(cmd: SlashCommand) {
        const { state, dispatch } = this.view;
        const pos = state.selection.main.from;
        const line = state.doc.lineAt(pos);

        const match = line.text.match(/^(\s*)\/$/);
        if (match) {
          const slashPos = line.from + match[0].length;
          dispatch(
            state.update({
              changes: { from: line.from, to: slashPos, insert: match[1] },
              selection: { anchor: line.from + match[1].length },
              userEvent: 'input.delete',
            }),
          );
        }
        cmd?.command?.(this.view);
      }

      destroy() {
        this.menu?.remove();
      }
    },
  );

export const slashMenuPlugin = (config: DefaultSlashMenuConfig) => {
  const cmdConf = config.defaultCommands || {};
  const commands = [
    cmdConf.heading1?.show !== false && {
      label: cmdConf.heading1?.label || 'Heading 1',
      command: insertHeading1,
    },
    cmdConf.heading2?.show !== false && {
      label: cmdConf.heading2?.label || 'Heading 2',
      command: insertHeading2,
    },
    cmdConf.heading3?.show !== false && {
      label: cmdConf.heading3?.label || 'Heading 3',
      command: insertHeading3,
    },
    cmdConf.heading4?.show !== false && {
      label: cmdConf.heading4?.label || 'Heading 4',
      command: insertHeading4,
    },
    cmdConf.heading5?.show !== false && {
      label: cmdConf.heading5?.label || 'Heading 5',
      command: insertHeading5,
    },
    cmdConf.heading6?.show !== false && {
      label: cmdConf.heading6?.label || 'Heading 6',
      command: insertHeading6,
    },
    cmdConf.unorderedList?.show !== false && {
      label: cmdConf.unorderedList?.label || 'Unordered List',
      command: insertUnorderedList,
    },
    cmdConf.orderedList?.show !== false && {
      label: cmdConf.orderedList?.label || 'Ordered List',
      command: insertOrderedList,
    },
    cmdConf.taskList?.show !== false && {
      label: cmdConf.taskList?.label || 'Task List',
      command: insertTaskList,
    },
    cmdConf.table?.show !== false && {
      label: cmdConf.table?.label || 'Table',
      command: insertTable,
    },
    cmdConf.blockquote?.show !== false && {
      label: cmdConf.blockquote?.label || 'Quote',
      command: insertBlockquote,
    },
    cmdConf.image?.show !== false && {
      label: cmdConf.image?.label || 'Image',
      command: insertImage,
    },
    cmdConf.link?.show !== false && {
      label: cmdConf.link?.label || 'Link',
      command: insertLink,
    },
    cmdConf.codeBlock?.show !== false && {
      label: cmdConf.codeBlock?.label || 'Code Block',
      command: insertCodeBlock,
    },
    cmdConf.horizontalRule?.show !== false && {
      label: cmdConf.horizontalRule?.label || 'Divider',
      command: insertHorizontalRule,
    },
  ].filter((x) => x !== false) as SlashCommand[];
  if (config.customCommands) {
    for (const customCmd of config.customCommands) {
      if (customCmd && customCmd.label) {
        commands.push(customCmd);
      }
    }
  }
  const plugin = slashMenu(commands, config);
  const slashMenuKeymap: KeyBinding[] = [
    {
      key: 'ArrowDown',
      run: (view: EditorView) => {
        const p = view.plugin(plugin);
        if (p && p.menuVisible) {
          p.selectNext();
          return true;
        }
        return false;
      },
    },
    {
      key: 'ArrowUp',
      run: (view: EditorView) => {
        const p = view.plugin(plugin);
        if (p && p.menuVisible) {
          p.selectPrev();
          return true;
        }
        return false;
      },
    },
    {
      key: 'Enter',
      run: (view: EditorView) => {
        const p = view.plugin(plugin);
        if (p && p.menuVisible) {
          p.confirmSelected();
          return true;
        }
        return false;
      },
    },
    {
      key: 'Escape',
      run: (view: EditorView) => {
        const p = view.plugin(plugin);
        if (p && p.menuVisible) {
          p.closeMenu();
          return true;
        }
        return false;
      },
    },
  ];
  return [Prec.high(keymap.of(slashMenuKeymap)), plugin];
};
