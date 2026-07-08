import Mock from 'mockjs'
import './modules/user'
import './modules/role'

// if (import.meta.env.PROD) {
//     throw new Error('Mock 数据不应该在生产环境中被引入')
// }

Mock.setup({ timeout: '300-600' })

console.log('Mock 服务已启动')