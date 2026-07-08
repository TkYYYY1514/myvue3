import Mock from 'mockjs'
import './modules/user'
import './modules/role'

// if (import.meta.env.PROD) {
//     throw new Error('Mock 数据不应该在生产环境中被引入')
// }

Mock.setup({ timeout: '300-600' })

console.log('Mock 服务已启动')

// 添加这段：暴露数据到 window
// import('./data/index.js').then(module => {
//     window.__MOCK_DATA__ = {
//       users: module.allUsers,
//       roles: module.roleListData
//     }
//     console.log('📦 数据已暴露，执行 downloadMockData() 下载')
    
//     // 添加下载函数到 window
//     window.downloadMockData = function() {
//       const data = window.__MOCK_DATA__
//       const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
//       const url = URL.createObjectURL(blob)
//       const a = document.createElement('a')
//       a.href = url
//       a.download = 'mock-data.json'
//       a.click()
//       URL.revokeObjectURL(url)
//       console.log('✅ 下载完成')
//     }
//   })