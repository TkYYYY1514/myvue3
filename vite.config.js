import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: process.env.DEPLOY_TARGET === 'github' ? '/myvue3/' : '/',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  // 新增开发服务器配置     仅在开发时有效
  server: {
    // host: true,  // 允许局域网和外网访问
    // allowedHosts: ['all'], // 开发环境允许所有域名访问
    proxy: {
      // 将所有以 /api 开头的请求代理到后端
      '/api': {
        target: 'http://localhost:3000', // 后端服务地址
        changeOrigin: true
        // 不需要 rewrite，保持原路径直接转发
      }
    }
  }
})