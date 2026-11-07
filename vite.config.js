import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  esbuild: {
    jsx: 'automatic',
  },
  server: {
    port: 3000,
    host: true
  }
});
