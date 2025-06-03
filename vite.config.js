import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    tailwindcss(),
  ],
  server:{
    watch: {
      ignored: ['**/server/**']
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./view', import.meta.url))
    },
  },
})
