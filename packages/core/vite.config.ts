import path from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { externalizeDeps } from 'vite-plugin-externalize-deps';

const outDir = 'dist';

export default defineConfig({
  appType: 'custom',
  build: {
    assetsInlineLimit: 0, // 内联base64大小限制
    chunkSizeWarningLimit: 20000, // 触发警告的chunk大小 (kb)
    reportCompressedSize: false, // gzip压缩大小报告, 禁用提高构建速度
    minify: false,
    outDir,
    sourcemap: true,
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      formats: ['es', 'cjs'],
      name: 'purrmd',
      fileName: (format) => (format === 'es' ? 'index.mjs' : 'index.cjs'),
    },
  },
  plugins: [
    externalizeDeps({
      // https://github.com/davidmyersdev/vite-plugin-externalize-deps
      deps: false,
      devDeps: true,
      nodeBuiltins: true,
      include: [/@codemirror\/*/, '@uiw/codemirror-theme-vscode', '@uiw/codemirror-theme-dracula'],
    }),
    dts({
      // root: path.resolve(__dirname, 'src'),
      rollupTypes: true,
      entryRoot: path.resolve(__dirname, 'src'),
      outDir: path.resolve(__dirname, 'dist'),
      tsconfigPath: path.resolve(__dirname, './tsconfig.json'),
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});
