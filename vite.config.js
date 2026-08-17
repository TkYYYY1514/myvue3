import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import fs from 'node:fs'
import path from 'node:path'

// ============================================
//  从 public/config.js 中解析后端服务地址
//  与前端运行时使用同一份配置，避免两处维护
// ============================================
function resolveApiTarget() {
  try {
    const configPath = path.resolve(process.cwd(), 'public/config.js')
    const content = fs.readFileSync(configPath, 'utf-8')
    const hostMatch = content.match(/API_HOST\s*:\s*['"]([^'"]+)['"]/)
    const portMatch = content.match(/API_PORT\s*:\s*['"]([^'"]+)['"]/)
    const host = hostMatch ? hostMatch[1] : '121.41.23.8'
    const port = portMatch ? portMatch[1] : '3000'
    return `http://${host}:${port}`
  } catch {
    // 读取失败时使用默认值兜底
    return 'http://121.41.23.8:3000'
  }
}

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
        target: resolveApiTarget(), // 后端服务地址（读取自 public/config.js）
        changeOrigin: true
        // 不需要 rewrite，保持原路径直接转发
      }
    }
  }
})
