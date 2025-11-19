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
  build: {
    // 🚀 Otimizações de performance para produção
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs em produção
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        // Code splitting inteligente
        manualChunks: {
          'vendor': ['vue', 'vue-router'],
          'ui': ['sweetalert2'],
        },
      },
    },
    // Aumenta o limite para evitar warnings
    chunkSizeWarningLimit: 1000,
    // Sourcemap apenas em dev
    sourcemap: false,
  },
  // ⚡ Otimizações adicionais
  optimizeDeps: {
    include: ['vue', 'vue-router', 'axios', 'sweetalert2'],
  },
})
