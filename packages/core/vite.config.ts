import fs from 'fs';
import path from 'path';
import * as sass from 'sass-embedded';
import { PluginOption } from 'vite';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { externalizeDeps } from 'vite-plugin-externalize-deps';

const outDir = 'dist';

const styleFiles = ['src/styles/base.scss'];
const styleTargetFiles = styleFiles.map(
  (f) => `${f.substring('src/'.length, f.length - '.scss'.length)}.css`,
);

async function compileScss() {
  for (let i = 0; i < styleFiles.length; i++) {
    const sourceFile = path.resolve(__dirname, styleFiles[i]);
    const targetFile = path.resolve(__dirname, outDir, styleTargetFiles[i]);
    const targetCopyFile = path.join(path.dirname(targetFile), `${path.basename(sourceFile)}`);
    const result = await sass.compileAsync(sourceFile, {
      style: 'expanded',
      verbose: true,
      sourceMap: false,
    });

    fs.mkdirSync(path.dirname(targetFile), { recursive: true });
    fs.writeFileSync(targetFile, result.css);
    fs.copyFileSync(sourceFile, targetCopyFile);
  }
}

const scssBuildPlugin: PluginOption = {
  name: 'build-scss-embedded',
  apply: 'build',
  async closeBundle() {
    console.log('[scss] Compiling scss with sass-embedded...');
    await compileScss();
    console.log('[scss] Done.');
  },
};

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
      include: [/@codemirror\/*/],
    }),
    dts({
      // root: path.resolve(__dirname, 'src'),
      rollupTypes: true,
      entryRoot: path.resolve(__dirname, 'src'),
      outDir: path.resolve(__dirname, 'dist'),
      tsconfigPath: path.resolve(__dirname, './tsconfig.json'),
    }),
    scssBuildPlugin,
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});
