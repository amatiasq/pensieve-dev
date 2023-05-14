import { defineConfig } from 'vite';
import monacoEditorPlugin from 'vite-plugin-monaco-editor';
import solidPlugin from 'vite-plugin-solid';

export default defineConfig({
  base: '/pensieve-dev/',
  plugins: [solidPlugin(), monacoEditorPlugin({})],
  server: {
    port: 3000,
  },
  build: {
    target: 'esnext',
  },
});
