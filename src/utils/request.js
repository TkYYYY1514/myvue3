import axios from 'axios'
import { ElMessage } from 'element-plus'

const service = axios.create({
    baseURL: '/',
    timeout: 5000
})

service.interceptors.response.use(
    response => {
        const res = response.data // 获取后端返回数据

        // 【修改点 1】兼容字符串 '200' 和数字 200
        // 如果你的 Mock 返回 code: '200'，这里也要放行
        const isSuccess = res.code == 200 

        if (!isSuccess) {
            // 只有当 code 真的不是 200 时才报错
            ElMessage.error(res.message || '系统错误')
            return Promise.reject(new Error(res.message || 'Error'))
        } else {
            // 【修改点 2】返回 res，这样 BaseForm 就能拿到 { code: 200, data: ... }
            return res
        }
    },
    error => {
        // 网络错误处理
        console.error('🔴 网络错误:', error) 
        ElMessage.error(error.message || '网络请求异常')
        return Promise.reject(error)
    }
)

export default service