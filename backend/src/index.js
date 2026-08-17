import express from  'express'
import cors from 'cors'
import 'dotenv/config'
import http from 'http'
import path from 'path'
import { fileURLToPath } from 'url'


//路由
import { initWebSocket } from './websocket/index.js'
import healthRouter from './routes/health.js'
import aiRouter from './routes/ai/index.js'
import uploadRouter from './routes/upload.js'

// const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY

const _filename = fileURLToPath(import.meta.url)
const _dirname = path.dirname(_filename)

const app = express()
const PORT = process.env.PORT

//中间件
app.use(cors())
app.use(express.json())

//静态文件服务 (让图片可以被访问)
app.use('/uploads',express.static(path.join(_dirname,'../uploads')))

//路由
app.use('/api',healthRouter) //健康检查
app.use('/api/ai',aiRouter) //AI路由
app.use('/api',uploadRouter) //上传路由


//全局错误处理
app.use((err,req,res,next) => {
    console.error('[全局错误]',err)
    res.status(500).json({code:500,message:err.message || '服务器内部错误'})
})


// 创建http服务器 + 挂载ws
const server = http.createServer(app)
initWebSocket(server)

//启动
server.listen(PORT, '0.0.0.0', () => {
    console.log(`后端运行在 http://0.0.0.0:${PORT}`)
    console.log(`ws 运行在 ws://0.0.0.0:${PORT}`)
    console.log(`健康检查: http://0.0.0.0:${PORT}/api/health`)
})