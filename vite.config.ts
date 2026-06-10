import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  base: './',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // GitHub Pages 兼容：生成相对路径引用
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
})
