import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue' 

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(),
  ],
  // 根据环境变量动态设置base：GitHub Pages用'/myvue3/'，其他平台用'/'
  base: process.env.DEPLOY_TARGET === 'github' ? '/myvue3/' : '/',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
