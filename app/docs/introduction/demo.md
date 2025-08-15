---
sidebar: false
layout: page
---

<div id="root"></div>

<style>
  #root {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
  }
  .cm-editor {
    padding: 0px 0px 10px 0px;
    width: 1000px;
    height: 100%;
    outline: 0 !important;
  }
  .ͼ2 .cm-gutters {
    background-color: transparent;
    border-width: 0 !important;
  }
  :root {
    --bg-color: #e2e2e2;
    --text-color: #000;
    --bg-hover-color: #cdcdcd;

  }
  :root.dark {
    --bg-color: #4b4b4b;
    --text-color: #fff;
    --bg-hover-color: #343434ff;
  }
  #test-button-wrap {
    position: fixed;
    bottom: 20px;
    left: 20px;
    z-index: 1000;
    display: flex;
    flex-direction: row;
    gap: 10px;

    .test-btn {
      padding: 10px 20px;
      background-color: var(--bg-color);
      color: var(--text-color);
      border-radius: 6px;
      border: none;
      cursor: pointer;
    }
    .test-btn:hover {
      background-color: var(--bg-hover-color);
    }
  }
</style>

<script setup>
  import { useData } from 'vitepress'
  import { onMounted, onUnmounted, watch } from 'vue';
  import { purrmd, purrmdTheme } from 'purrmd';
  import { EditorView } from '@codemirror/view';
  import { basicSetup } from 'codemirror';

  const documentText = __INIT_DOCUMENT;
  const { isDark } = useData();
  let view = null;
  let sourceMode = false;

  const createEditor = (isDarkMode, sourceMode) => {
    if (view) {
      view.destroy();
      view = null;
    }
    view = new EditorView({
      doc: documentText,
      parent: document.getElementById('root'),
      extensions: [
        basicSetup,
        EditorView.lineWrapping,
        purrmd({
          formattingDisplayMode: sourceMode ? 'show' : 'auto',
        }),
        purrmdTheme({
          mode: isDarkMode ? 'dark' : 'light',
        }),
      ],
    });
  }

  watch(isDark, (newVal) => {
    createEditor(newVal, sourceMode);
  })

  onMounted(() => {
    createEditor(isDark.value, sourceMode);
    const appendTestBtn = (text, onClick) => {
      const root = document.getElementById('root');
      const btnWrapId = 'test-button-wrap';
      if (!document.getElementById(btnWrapId)) {
        const wrap = document.createElement('div');
        wrap.id = btnWrapId;
        root.appendChild(wrap);
      }
      const btnWrap = document.getElementById(btnWrapId);
      const btn = document.createElement('button');
      btn.innerHTML = text;
      btn.className = 'test-btn';
      btn.onclick = onClick;
      btnWrap.appendChild(btn);
    };

    appendTestBtn('Source Mode', (e) => {
      e.preventDefault();
      sourceMode = !sourceMode;
      createEditor(isDark.value, sourceMode);
    });
  });

  onUnmounted(() => {
    if (view) {
      view.destroy();
      view = null;
    }
  });
</script>

