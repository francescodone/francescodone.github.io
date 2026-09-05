import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@shell': path.resolve(import.meta.dirname, 'src/shell'),
      '@sections': path.resolve(import.meta.dirname, 'src/sections'),
      '@shared': path.resolve(import.meta.dirname, 'src/shared'),
    },
  },
  base: '/',
})
