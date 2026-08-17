// src/api/ai.js
import request from '@/utils/request'

// 统一走 Vite 代理，避免跨域问题
// Vite 配置中已将 /api 代理到后端（地址见 public/config.js）
const API_BASE = '/api'

export const aiApi = {
  // 非流式 - 走 Vite 代理
  sendMessage(messages, systemPrompt = '') {
    return request({
      url: '/api/ai/chat',
      method: 'post',
      data: { messages, systemPrompt }
    })
  },

  // 流式请求 - 走 Vite 代理（避免跨域问题）
  async sendMessageStream(messages, systemPrompt, onChunk, onComplete, onError) {
    try {
      const response = await fetch(`${API_BASE}/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ messages, systemPrompt })
      })

      if (!response.ok) {
        // 尝试读取错误信息
        let errorMsg = '请求失败'
        try {
          const errData = await response.json()
          errorMsg = errData.message || `服务器错误 (${response.status})`
        } catch {
          errorMsg = `服务器错误 (${response.status})`
        }
        throw new Error(errorMsg)
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) {
          // 正常结束
          if (onComplete) onComplete()
          break
        }

        buffer += decoder.decode(value, { stream: true })

        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          const trimmedLine = line.trim()
          if (!trimmedLine) continue

          if (trimmedLine.startsWith('data: ')) {
            const data = trimmedLine.slice(6)
            if (data === '[DONE]') {
              if (onComplete) onComplete()
              return
            }
            try {
              const json = JSON.parse(data)
              const content = json.choices?.[0]?.delta?.content
              if (content && onChunk) {
                onChunk(content)
              }
            } catch (e) {
              // 忽略解析错误（如非 JSON 数据行）
              console.warn('[SSE] 解析行失败:', trimmedLine.slice(0, 100))
            }
          }
        }
      }
    } catch (error) {
      console.error('流式请求失败:', error)
      if (onError) onError(error.message || '请求失败')
    }
  },

  // 健康检查 - 走 Vite 代理
  async checkHealth() {
    const res = await fetch(`${API_BASE}/health`)
    if (!res.ok) throw new Error('服务不可用')
    return res.json()
  }
}
