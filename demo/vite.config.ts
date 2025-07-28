import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  appType: 'spa',
  plugins: [],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});
