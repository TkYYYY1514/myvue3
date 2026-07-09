import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import 'dotenv/config'

const app = new Hono()

// CORS 中间件
app.use('/api/*', cors())

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY

// 健康检查
app.get('/api/health', (c) => {
  return c.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'myvue3-backend',
    uptime: process.uptime()
  })
})

// AI 对话 - 流式输出
app.post('/api/ai/chat', async (c) => {
  try {
    const { messages, systemPrompt } = await c.req.json()

    // 构建消息列表
    const chatMessages = []
    if (systemPrompt) {
      chatMessages.push({ role: 'system', content: systemPrompt })
    }
    if (messages && messages.length > 0) {
      chatMessages.push(...messages)
    }

    console.log(`[AI] 请求 DeepSeek, 消息数: ${chatMessages.length}`)
    // console.log(`[AI] 请求 DeepSeek, 提示词: ${systemPrompt}`)
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: chatMessages,
        stream: true,
        temperature: 0.1,
        max_tokens: 2000
      })
    })

    // 检查 DeepSeek API 响应状态
    if (!response.ok) {
      const errorText = await response.text()
      console.error(`[AI] DeepSeek API 错误: ${response.status}`, errorText)
      return c.json(
        { code: response.status, message: `DeepSeek API 错误: ${errorText}` },
        response.status
      )
    }

    // ✅ Hono 使用 Web Standard API，Web ReadableStream 直接可用，无需转换！
    return new Response(response.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'X-Accel-Buffering': 'no'
      }
    })

  } catch (error) {
    console.error('[AI] 请求失败:', error)
    return c.json({ code: 500, message: error.message }, 500)
  }
})

const PORT = process.env.PORT || 3001
// const PORT = 3001 
serve(
  { fetch: app.fetch, port: Number(PORT) },
  (info) => {
    console.log(`后端运行在 http://localhost:${info.port}`)
    console.log(`健康检查: http://localhost:${info.port}/api/health`)
  }
)
