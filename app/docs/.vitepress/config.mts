import { readFileSync } from 'fs';
import path from 'path';
import { defineConfig } from 'vitepress';

const loadFileDefine = (file: string) => {
  return JSON.stringify(readFileSync(path.resolve(__dirname, file), { encoding: 'utf8' }));
};

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'PurrMD Docs',
  description: 'A WYSIWYG Markdown Editor for CodeMirror6',
  base: '/',
  vite: {
    optimizeDeps: {},
    define: {
      __INIT_DOCUMENT: loadFileDefine('../../demo/assets/doc.md'),
      __INIT_DOCUMENT_ZH: loadFileDefine('../../demo/assets/doc.zh-CN.md'),
    },
  },
  locales: {
    root: {
      lang: 'en',
      label: 'English',
    },
    zh: {
      label: '简体中文',
      lang: 'zh',
      title: 'PurrMD 文档',
      dir: 'zh',
      description: '一个基于 CodeMirror6 的所见即所得 Markdown 编辑器',
      themeConfig: {
        darkModeSwitchLabel: '主题切换',
        lightModeSwitchTitle: '切换日间模式',
        darkModeSwitchTitle: '切换夜间模式',
        nav: [
          { text: '演示', link: '/zh/introduction/demo' },
          { text: '文档', link: '/zh/introduction/' },
        ],
        sidebar: [
          {
            text: '介绍',
            items: [
              {
                text: '简介',
                link: '/zh/introduction/',
              },
              {
                text: '快速开始',
                link: '/zh/introduction/getting-started',
              },
            ],
          },
          {
            text: '指引',
            items: [
              {
                text: '功能',
                link: '/zh/guide/',
              },
            ],
          },
          {
            text: 'API',
            items: [
              {
                text: 'API 参考',
                link: '/zh/apis/',
              },
            ],
          },
        ],
      },
    },
  },

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Demo', link: '/introduction/demo' },
      { text: 'Document', link: '/introduction/' },
    ],
    sidebar: [
      {
        text: 'Introduction',
        items: [
          {
            text: 'Introduction',
            link: '/introduction/',
          },
          {
            text: 'Getting Started',
            link: '/introduction/getting-started',
          },
        ],
      },
      {
        text: 'Guide',
        items: [
          {
            text: 'Features',
            link: '/guide/',
          },
        ],
      },
      {
        text: 'APIs',
        items: [
          {
            text: 'API Reference',
            link: '/apis/',
          },
        ],
      },
    ],
    socialLinks: [{ icon: 'github', link: 'https://github.com/luoluoqixi/purrmd' }],
  },
});
