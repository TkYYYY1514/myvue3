import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue' 

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(),
  ],
  // GitHub Pages 部署时使用 '/myvue3/'，本地开发使用 '/'
  base: process.env.DEPLOY_TARGET === 'github' ? '/myvue3/' : '/',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
