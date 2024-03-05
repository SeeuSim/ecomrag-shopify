import { defineConfig } from 'vite'
import shopify from 'vite-plugin-shopify'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    shopify({
      themeRoot: 'extensions/theme-extension'
    }),
    react(),
  ],
  build: {
    rollupOptions: {
      input: './frontend/entrypoints/theme.tsx'
    },
    outDir: 'extensions/theme-extension/assets'
  }
})