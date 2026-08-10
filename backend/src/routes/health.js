import {Router} from 'express'

const router = Router()

router.get('/health',(req,res) => {
    res.json({
        status: '我是傻子',
        timestamp: new Date().toLocaleString('zh-CN',{timeZone:'Asia/ShangHai'}),
        service:'myvue3-backend',
        uptime:process.uptime()
    })
})

export default router
