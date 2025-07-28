import { readFileSync } from 'fs';
import path from 'path';
import { defineConfig } from 'vite';

const loadFileDefine = (file: string) => {
  return JSON.stringify(readFileSync(path.resolve(__dirname, file), { encoding: 'utf8' }));
};

export default defineConfig({
  appType: 'spa',
  plugins: [],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  define: {
    __INIT_DOCUMENT: loadFileDefine('assets/doc.md'),
    __INIT_DOCUMENT_ZH: loadFileDefine('assets/doc.zh-CN.md'),
  },
});
