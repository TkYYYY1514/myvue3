import axios from 'axios'
import { ElMessage } from 'element-plus'

const service = axios.create({
    baseURL: '/api',
    timeout: 5000//超时时间
})

service.interceptors.response.use(
    response =>{
        const res = response.data//获取后端返回数据

        if(res.code !== 200){
            ElMessage.error(res.message || 'Error')
            return Promise.reject(new Error(res.message || 'Error'))
        }else{
            return res
        }
    },
    error =>{ 
        ElMessage.error(error.message || 'Network Error')
        return Promise.reject(error)
    }

)

export default service