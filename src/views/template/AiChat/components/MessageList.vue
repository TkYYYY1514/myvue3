<template>
  <main class="chat-main" ref="messageListRef" @scroll="onScroll">
    <div class="chat-container">
      <!-- 空状态 -->
      <div v-if="messages.length === 0" class="empty-state">
        <el-empty description="开始对话">
          <template #image>
            <div class="empty-icon"><el-icon 
              color= "#ffffff"><Comment /></el-icon></div>
          </template>
        </el-empty>
        <div v-if="systemPrompt" class="active-prompt">
          <el-tag type="info" size="small">
            当前提示词：{{ systemPrompt.slice(0, 50) }}...
          </el-tag>
        </div>
        <div class="quick-questions">
          <el-button
            v-for="q in quickQuestions"
            :key="q"
            size="small"
            @click="$emit('send-quick-question', q)"
          >
            {{ q }}
          </el-button>
        </div>
      </div>

      <!-- 消息列表 -->
      <template v-else>
        <div
          v-for="(msg, index) in messages"
          :key="index"
          :class="['message-wrapper', msg.role]"
        >
          <div class="message-content">
            <div
              class="markdown-body"
              :class="{ 'user-message': msg.role === 'user' }"
              v-html="renderMarkdown(msg.content)"
            ></div>
            <div class="message-time">{{ formatTime(msg.timestamp) }}</div>
          </div>
        </div>

        <!-- ===== 思考中（显示秒数） ===== -->
        <!-- <div v-if="isLoading" class="message-wrapper assistant">
          <div class="message-content">
            <div class="markdown-body thinking">
              <span class="thinking-text">思考中 {{ thinkingSeconds }}s</span>
            </div>
          </div>
        </div> -->
      </template>
    </div>
  </main>
</template>

<script setup>
import { ref, watch, onUnmounted } from 'vue'
import { Setting, Comment } from '@element-plus/icons-vue'

const props = defineProps({
  messages: { type: Array, default: () => [] },
  systemPrompt: { type: String, default: '' },
  isLoading: { type: Boolean, default: false },
  quickQuestions: { type: Array, default: () => [] },
  renderMarkdown: { type: Function, default: (c) => c || '' },
  formatTime: { type: Function, default: () => '' }
})

const emit = defineEmits(['send-quick-question', 'scroll-state'])

const messageListRef = ref(null)

// ===== 思考秒数 =====
const thinkingSeconds = ref(0)
let timer = null

// 监听 isLoading，开始/停止计时
watch(
  () => props.isLoading,
  (newVal) => {
    if (newVal) {
      thinkingSeconds.value = 0
      timer = setInterval(() => {
        thinkingSeconds.value++
      }, 1000)
    } else {
      if (timer) {
        clearInterval(timer)
        timer = null
      }
    }
  }
)

// 组件卸载时清理
onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
})

const scrollToBottom = () => {
  if (messageListRef.value) {
    messageListRef.value.scrollTop = messageListRef.value.scrollHeight
  }
}

const onScroll = () => {
  if (!messageListRef.value) return
  const { scrollTop, scrollHeight, clientHeight } = messageListRef.value
  const atBottom = scrollHeight - scrollTop - clientHeight < 10
  emit('scroll-state', atBottom)
}

defineExpose({ scrollToBottom, messageListRef })
</script>


<style scoped>
.chat-main {
  flex: 1;
  overflow-y: auto;
  background: var(--chat-bg, #f7f8fa);
  padding: 0 24px;
  position: relative;
}

.chat-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px 0;
}

/* ========== 空状态 ========== */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
}

.empty-icon {
  font-size: 56px;
  margin-bottom: 8px;
}

.active-prompt {
  margin: 16px 0;
}

.quick-questions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 12px;
}

/* ========== 消息样式 ========== */
.message-wrapper {
  display: flex;
  margin-bottom: 24px;
}

.message-wrapper.user {
  justify-content: flex-end;
}

.message-wrapper.assistant {
  justify-content: flex-start;
}

.message-content {
  max-width: 85%;
  min-width: 40px;
}

.markdown-body {
  padding: 12px 18px;
  background: var(--chat-markdown-bg, #ffffff);
  border-radius: 12px;
  line-height: 1.7;
  font-size: 15px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  word-wrap: break-word;
  overflow-wrap: break-word;
  color: var(--chat-text, #1a1a1a);
}

.user-message {
  background: var(--chat-user-bg, #e8edff);
  color: var(--chat-text, #1a1a1a);
  border-radius: 12px 12px 4px 12px;
}

.message-wrapper.assistant .markdown-body {
  border-radius: 12px 12px 12px 4px;
}

.message-time {
  font-size: 11px;
  color: var(--chat-text-muted, #8c8f9c);
  padding: 4px 8px 0;
  margin-top: 2px;
}

.message-wrapper.user .message-time {
  text-align: right;
}

/* ========== 滚动条 ========== */
.chat-main::-webkit-scrollbar {
  width: 4px;
}

.chat-main::-webkit-scrollbar-track {
  background: transparent;
}

.chat-main::-webkit-scrollbar-thumb {
  background: var(--chat-scrollbar, #d0d5dd);
  border-radius: 2px;
}

.chat-main::-webkit-scrollbar-thumb:hover {
  background: var(--chat-scrollbar-hover, #b0b3be);
}

/* ========== Markdown 样式 ========== */
.markdown-body :deep(h1),
.markdown-body :deep(h2),
.markdown-body :deep(h3),
.markdown-body :deep(h4),
.markdown-body :deep(h5),
.markdown-body :deep(h6) {
  margin: 16px 0 8px 0;
  font-weight: 600;
}

.markdown-body :deep(h1) { font-size: 1.6em; }
.markdown-body :deep(h2) { font-size: 1.4em; }
.markdown-body :deep(h3) { font-size: 1.2em; }

.markdown-body :deep(p) {
  margin: 4px 0;
}

.markdown-body :deep(ul),
.markdown-body :deep(ol) {
  padding-left: 24px;
  margin: 4px 0;
}

.markdown-body :deep(li) {
  margin: 2px 0;
}

.markdown-body :deep(blockquote) {
  margin: 8px 0;
  padding: 4px 14px;
  border-left: 4px solid #4f6ef7;
  background: var(--chat-blockquote-bg, #f0f2f8);
  border-radius: 0 4px 4px 0;
}

.user-message :deep(blockquote) {
  background: rgba(79, 110, 247, 0.08);
}

/* 行内代码 */
.markdown-body :deep(code:not(pre code)) {
  background: var(--chat-inline-code-bg, #f0f2f8);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.9em;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  color: var(--chat-text, #1a1a1a);
}

.user-message :deep(code:not(pre code)) {
  background: rgba(79, 110, 247, 0.12);
}

/* 代码块：顶部留空给语言标签 */
.markdown-body :deep(pre) {
  position: relative;
  background: var(--chat-code-bg, #0d1117);
  border-radius: 8px;
  padding: 36px 16px 16px;
  margin: 8px 0;
  overflow-x: auto;
  font-size: 13px;
  line-height: 1.6;
}

.markdown-body :deep(pre code) {
  background: transparent !important;
  padding: 0 !important;
  border-radius: 0 !important;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  color: var(--chat-code-text, #e6edf3);
  font-size: 13px;
  display: block;
}

/* 代码块语言标签 - 左上角，更明显 */
.markdown-body :deep(pre)::before {
  content: attr(data-lang);
  position: absolute;
  top: 8px;
  left: 12px;
  font-size: 12px;
  font-weight: 700;
  color: var(--chat-code-label, #8b949e);
  background: rgba(255, 255, 255, 0.08);
  padding: 3px 12px;
  border-radius: 4px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  letter-spacing: 0.5px;
  text-transform: lowercase;
  pointer-events: none;
  user-select: none;
  line-height: 1.4;
}

.markdown-body :deep(pre[data-lang=""])::before {
  display: none;
}

/* 用户消息中的代码块 */
.user-message :deep(pre) {
  background: #1a1a2e;
}

.user-message :deep(pre code) {
  color: #e6edf3;
}

.user-message :deep(pre)::before {
  color: rgba(255, 255, 255, 0.5);
  background: rgba(255, 255, 255, 0.08);
}

/* 表格 */
.markdown-body :deep(table) {
  border-collapse: collapse;
  margin: 8px 0;
  width: 100%;
}

.markdown-body :deep(th),
.markdown-body :deep(td) {
  border: 1px solid #d0d7de;
  padding: 6px 12px;
  text-align: left;
}

.markdown-body :deep(th) {
  background: #f6f8fa;
  font-weight: 600;
}

.user-message :deep(th),
.user-message :deep(td) {
  border-color: rgba(0, 0, 0, 0.15);
}

.user-message :deep(th) {
  background: rgba(79, 110, 247, 0.08);
}

/* 分割线 */
.markdown-body :deep(hr) {
  border: none;
  border-top: 1px solid #d0d7de;
  margin: 12px 0;
}

/* 图片 */
.markdown-body :deep(img) {
  max-width: 100%;
  border-radius: 4px;
}

/* 链接 */
.markdown-body :deep(a) {
  color: #4f6ef7;
  text-decoration: none;
}

.markdown-body :deep(a:hover) {
  text-decoration: underline;
}

/* ========== highlight.js 样式 ========== */
.markdown-body :deep(.hljs) {
  display: block;
  overflow-x: auto;
  padding: 0;
  background: transparent;
}

.markdown-body :deep(.hljs-keyword),
.markdown-body :deep(.hljs-selector-tag),
.markdown-body :deep(.hljs-title),
.markdown-body :deep(.hljs-name) {
  color: #ff7b72;
}

.markdown-body :deep(.hljs-string),
.markdown-body :deep(.hljs-number) {
  color: #a5d6ff;
}

.markdown-body :deep(.hljs-comment) {
  color: #8b949e;
}

.markdown-body :deep(.hljs-function) {
  color: #d2a8ff;
}

.markdown-body :deep(.hljs-variable) {
  color: #ffa657;
}

.markdown-body :deep(.hljs-operator) {
  color: #ff7b72;
}

.markdown-body :deep(.hljs-built_in) {
  color: #ffa657;
}


/* ===== 思考中 ===== */
.thinking {
  padding: 12px 18px;
  background: var(--chat-markdown-bg, #ffffff);
  border-radius: 12px 12px 12px 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  min-height: 48px;
}

.thinking-text {
  font-size: 14px;
  color: var(--chat-text-muted, #8c8f9c);
}

/* 深色模式适配 */
html.dark .thinking {
  background: var(--chat-markdown-bg, #2d2d4a);
}

html.dark .thinking-text {
  color: var(--chat-text-muted, #6b6f8a);
}

</style>
