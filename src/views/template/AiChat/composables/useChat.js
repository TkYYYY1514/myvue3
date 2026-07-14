import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { aiApi } from '@/api/ai'

// Markdown 渲染配置
import { marked } from 'marked'
import hljs from 'highlight.js'

// 自定义 renderer：代码块高亮 + 左上角语言标签
// 兼容 marked v4 (code, lang) 和 v5+ ({ text, lang }) 两种 API
const renderer = new marked.Renderer()
renderer.code = function (...args) {
  let code = ''
  let lang = ''
  if (args.length === 1 && typeof args[0] === 'object') {
    // marked v5+: 接收 { text, lang }
    code = args[0].text || ''
    lang = args[0].lang || ''
  } else {
    // marked v4: 接收 (code, lang)
    code = args[0] || ''
    lang = args[1] || ''
  }

  const langAttr = lang ? ` data-lang="${lang}"` : ''
  let highlighted = code
  if (lang && hljs.getLanguage(lang)) {
    try {
      highlighted = hljs.highlight(code, { language: lang }).value
    } catch (e) {
      console.error('Highlight error:', e)
    }
  } else {
    try {
      highlighted = hljs.highlightAuto(code).value
    } catch (e) {
      console.error('Auto highlight error:', e)
    }
  }
  return `<pre${langAttr}><code class="language-${lang || ''}">${highlighted}</code></pre>`
}

marked.setOptions({
  gfm: true,
  breaks: true,
  pedantic: false,
  sanitize: false,
  smartLists: true,
  smartypants: false,
  renderer
})

const STORAGE_KEY = 'ai_chat_history'

export function useChat() {
  // ========== 核心状态 ==========
  const messages = ref([])
  const inputText = ref('')
  const isLoading = ref(false)
  const isConnected = ref(false)
  const showSystemPrompt = ref(false)
  const systemPrompt = ref(localStorage.getItem('ai_system_prompt') || '')

  // 快捷问题
  const quickQuestions = [
    '你好，介绍一下自己',
    '如何学习编程？',
    '帮我写一段代码',
    '今天有什么新闻？'
  ]

  // ========== Markdown 渲染 ==========
  const renderMarkdown = (content) => {
    if (!content) return ''
    try {
      return marked(content)
    } catch (e) {
      console.error('Markdown render error:', e)
      return content.replace(/\n/g, '<br>')
    }
  }

  // ========== 系统提示词 ==========
  const saveSystemPrompt = () => {
    localStorage.setItem('ai_system_prompt', systemPrompt.value)
    ElMessage.success('系统提示词已保存')
    showSystemPrompt.value = false
  }

  const resetSystemPrompt = () => {
    systemPrompt.value = ''
    localStorage.removeItem('ai_system_prompt')
    ElMessage.success('已重置')
    showSystemPrompt.value = false
  }

  // ========== 本地存储 ==========
  const saveToLocal = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        messages: messages.value,
        systemPrompt: systemPrompt.value,
        updatedAt: new Date().toISOString()
      }))
    } catch (e) {
      console.error('保存失败:', e)
    }
  }

  const loadFromLocal = () => {
    try {
      const data = localStorage.getItem(STORAGE_KEY)
      if (data) {
        const parsed = JSON.parse(data)
        messages.value = parsed.messages || []
        if (parsed.systemPrompt && !systemPrompt.value) {
          systemPrompt.value = parsed.systemPrompt
        }
      }
    } catch (e) {
      console.error('加载失败:', e)
    }
  }

  // ========== 消息发送 ==========
  const sendMessage = async (scrollCallback) => {
    const text = inputText.value.trim()
    if (!text || isLoading.value) return

    if (!isConnected.value) {
      ElMessage.error('后端服务未连接')
      return
    }

    // 添加用户消息
    messages.value.push({
      role: 'user',
      content: text,
      timestamp: new Date().toISOString()
    })
    inputText.value = ''
    scrollCallback?.()
    saveToLocal()

    isLoading.value = true

    // 添加 AI 消息占位
    const aiIndex = messages.value.length
    messages.value.push({
      role: 'assistant',
      content: '',
      timestamp: new Date().toISOString()
    })

    // 准备对话历史 - 只保留有内容的消息
    const chatMessages = messages.value
      .filter(m => m.content)
      .map(m => ({ role: m.role, content: m.content }))

    let saveTimer = null

    // 发送流式请求
    await aiApi.sendMessageStream(
      chatMessages,
      systemPrompt.value,
      // 接收数据块
      (chunk) => {
        messages.value[aiIndex].content += chunk

        clearTimeout(saveTimer)
        saveTimer = setTimeout(() => {
          if (messages.value[aiIndex].content) {
            saveToLocal()
          }
        }, 2000)
      },
      // 完成回调
      () => {
        isLoading.value = false
        clearTimeout(saveTimer)
        saveToLocal()
        scrollCallback?.()
      },
      // 错误回调
      (error) => {
        isLoading.value = false
        clearTimeout(saveTimer)
        messages.value[aiIndex].content = '❌ 请求失败，请重试'
        saveToLocal()
        ElMessage.error(error)
        scrollCallback?.()
      }
    )
  }

  // ========== 快捷问题 ==========
  const sendQuickQuestion = (text, scrollCallback) => {
    inputText.value = text
    sendMessage(scrollCallback)
  }

  // ========== 清空对话 ==========
  const clearMessages = () => {
    if (messages.value.length === 0) return
    ElMessageBox.confirm('确定清空所有对话吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      messages.value = []
      saveToLocal()
      ElMessage.success('已清空')
    }).catch(() => {})
  }

  // ========== 健康检查 ==========
  const checkHealth = async () => {
    try {
      await aiApi.checkHealth()
      isConnected.value = true
    } catch {
      isConnected.value = false
    }
  }

  // ========== 工具方法 ==========
  const formatTime = (timestamp) => {
    if (!timestamp) return ''
    const date = new Date(timestamp)
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  }

  return {
    // 状态
    messages,
    inputText,
    isLoading,
    isConnected,
    showSystemPrompt,
    systemPrompt,
    quickQuestions,

    // 方法
    renderMarkdown,
    saveSystemPrompt,
    resetSystemPrompt,
    sendMessage,
    sendQuickQuestion,
    clearMessages,
    checkHealth,
    formatTime,
    saveToLocal,
    loadFromLocal
  }
}
