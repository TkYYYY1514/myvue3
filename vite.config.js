import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(),
    viteMockServe({
      mockPath: 'mock',
      enable: true, // 👈 关键！让 mock 打包后也能运行
    }),
  ],
  base: '/myvue3/',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
