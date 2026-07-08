import Koa from 'koa'
import Router from 'koa-router'
import bodyParser from 'koa-bodyparser'
import cors from '@koa/cors'
import 'dotenv/config'

const app = new Koa()
const router = new Router()

app.use(cors())
app.use(bodyParser())

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY

// ============ 健康检查 ============
router.get('/api/health', async (ctx) => {
  ctx.body = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'myvue3-backend',
    uptime: process.uptime()
  }
})

// ============ AI 对话 ============
router.post('/api/ai/chat', async (ctx) => {
  try {
    const { messages } = ctx.request.body
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages,
        temperature: 0.7,
        max_tokens: 2000
      })
    })
    ctx.body = await response.json()
  } catch (error) {
    ctx.status = 500
    ctx.body = { error: error.message }
  }
})

app.use(router.routes())
app.use(router.allowedMethods())

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`✅ 后端运行在 http://localhost:${PORT}`)
  console.log(`✅ 健康检查: http://localhost:${PORT}/api/health`)
})