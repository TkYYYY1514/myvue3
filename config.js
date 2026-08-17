// ============================================
//  后端服务地址配置（唯一修改入口）
//  修改此文件后刷新页面即可生效，无需重新构建
//  前端代码统一通过 src/config/index.js 读取
// ============================================
(function (global) {
  global.APP_CONFIG = {
    // 后端服务主机
    API_HOST: '121.41.23.8',

    // 后端服务端口
    API_PORT: '3000'
  }
})(typeof window !== 'undefined' ? window : globalThis)
