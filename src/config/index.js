// ============================================
//  全局配置读取出口（前端统一从这里获取后端地址）
//  实际地址在 public/config.js 中维护
//  修改 public/config.js 后刷新页面即可生效
// ============================================

// 读取 public/config.js 中定义的全局配置，带默认值兜底
const APP_CONFIG = window.APP_CONFIG || {}

const API_HOST = APP_CONFIG.API_HOST || '121.41.23.8'
const API_PORT = APP_CONFIG.API_PORT || '3000'

// HTTP 接口基础地址（如：http://121.41.23.8:3000）
export const API_BASE_URL = `http://${API_HOST}:${API_PORT}`

// WebSocket 基础地址（如：ws://121.41.23.8:3000）
export const WS_BASE_URL = `ws://${API_HOST}:${API_PORT}`

// 接口请求基础路径（含 /api 前缀）
// - 开发环境：走 Vite 代理（相对路径 /api，可避免跨域）
// - 生产部署（GitHub Pages / 云服务器静态托管）：走完整后端地址
export const API_BASE = import.meta.env.DEV ? '/api' : `${API_BASE_URL}/api`

// 主机与端口（按需直接使用）
export { API_HOST, API_PORT }
