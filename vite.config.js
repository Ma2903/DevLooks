import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import viteCompression from 'vite-plugin-compression'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    tailwindcss(),
    // Compressão Brotli e Gzip
    viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br',
      threshold: 10240, // Apenas arquivos > 10kb
      deleteOriginFile: false,
    }),
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 10240,
      deleteOriginFile: false,
    }),
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
    minify: 'esbuild',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        // Code splitting inteligente
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('vue')) return 'vendor-vue';
            if (id.includes('sweetalert2')) return 'vendor-swal';
            if (id.includes('axios')) return 'vendor-axios';
            return 'vendor-misc';
          }
        },
        // Otimiza nomes de arquivos
        assetFileNames: (assetInfo) => {
          let extType = assetInfo.name.split('.').at(1);
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            extType = 'img';
          }
          return `assets/${extType}/[name]-[hash][extname]`;
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
      },
    },
    chunkSizeWarningLimit: 1000,
    sourcemap: false,
    // Compressão de assets
    assetsInlineLimit: 4096, // 4kb - imagens menores viram base64
  },
  // ⚡ Otimizações adicionais
  optimizeDeps: {
    include: ['vue', 'vue-router', 'axios', 'sweetalert2'],
  },
})
