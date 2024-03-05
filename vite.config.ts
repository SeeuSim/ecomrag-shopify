import path from 'path';
import { defineConfig } from 'vite';
import shopify from 'vite-plugin-shopify';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    shopify({
      themeRoot: 'extensions/theme-extension',
    }),
    react(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './frontend'),
    },
  },
  publicDir: './frontend/public',
  build: {
    rollupOptions: {
      input: './frontend/entrypoints/theme.tsx',
    },
    emptyOutDir: false,
  },
});
