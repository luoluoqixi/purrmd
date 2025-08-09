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
</style>

<script setup>
  import { onMounted } from 'vue';
  import { purrmd, purrmdTheme } from 'purrmd';
  import { EditorView } from '@codemirror/view';
  import { basicSetup } from 'codemirror';

  const documentText = __INIT_DOCUMENT_ZH;

  onMounted(() => {
    const view = new EditorView({
      doc: documentText,
      parent: document.getElementById('root'),
      extensions: [
        basicSetup,
        EditorView.lineWrapping,
        purrmd({
          formattingDisplayMode: 'auto',
        }),
        purrmdTheme({
          mode: 'light',
        }),
      ],
    });
  });
</script>

