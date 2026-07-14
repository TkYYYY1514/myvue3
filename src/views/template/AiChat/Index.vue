<template>
  <div class="ai-chat-page">
    <ChatHeader
      :is-connected="isConnected"
      :message-count="messages.length"
      @toggle-system-prompt="showSystemPrompt = !showSystemPrompt"
      @clear-messages="clearMessages"
      @toggle-sidebar="menuStore.toggleHidden()"
    />

    <!-- 悬浮右侧的系统提示词面板 -->
    <SystemPrompt
      v-model="systemPrompt"
      :visible="showSystemPrompt"
      @save="saveSystemPrompt"
      @reset="resetSystemPrompt"
      @close="showSystemPrompt = false"
    />

    <MessageList
      ref="messageListRef"
      :messages="messages"
      :system-prompt="systemPrompt"
      :is-loading="isLoading"
      :quick-questions="quickQuestions"
      :render-markdown="renderMarkdown"
      :format-time="formatTime"
      @send-quick-question="handleQuickQuestion"
      @scroll-state="onScrollState"
    />

    <!-- 滚动到底部按钮 -->
    <div
      v-if="showScrollButton"
      class="scroll-to-bottom-btn"
      @click="doScrollToBottom"
      title="滚动到底部"
    >
      <el-icon><ArrowDown /></el-icon>
    </div>

    <ChatInput
      v-model="inputText"
      :disabled="isLoading"
      :has-system-prompt="!!systemPrompt"
      :message-count="messages.length"
      @send="handleSend"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ArrowDown } from '@element-plus/icons-vue'
import { useMenuStore } from '@/stores/menu'
import { useChat } from './composables/useChat'

import ChatHeader from './components/ChatHeader.vue'
import SystemPrompt from './components/SystemPrompt.vue'
import MessageList from './components/MessageList.vue'
import ChatInput from './components/ChatInput.vue'

const menuStore = useMenuStore()

const {
  messages,
  inputText,
  isLoading,
  isConnected,
  showSystemPrompt,
  systemPrompt,
  quickQuestions,
  renderMarkdown,
  saveSystemPrompt,
  resetSystemPrompt,
  sendMessage,
  sendQuickQuestion,
  clearMessages,
  checkHealth,
  formatTime,
  loadFromLocal
} = useChat()

// ========== 滚动控制 ==========
const messageListRef = ref(null)
const showScrollButton = ref(false)

const doScrollToBottom = () => {
  messageListRef.value?.scrollToBottom()
  showScrollButton.value = false
}

const onScrollState = (atBottom) => {
  showScrollButton.value = !atBottom
}

// 发送消息时，仅首次和完成时触发滚动
const handleSend = () => {
  sendMessage(() => {
    messageListRef.value?.scrollToBottom()
  })
}

const handleQuickQuestion = (text) => {
  sendQuickQuestion(text, () => {
    messageListRef.value?.scrollToBottom()
  })
}

onMounted(() => {
  loadFromLocal()
  checkHealth()
})
</script>

<style scoped>
.ai-chat-page {
  display: flex;
  flex-direction: column;
  height: 95%;
  background: var(--chat-bg, #f7f8fa);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  position: relative;
}

/* ========== 滚动到底部按钮 ========== */
.scroll-to-bottom-btn {
  position: absolute;
  bottom: 120px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: var(--chat-card-bg, #ffffff);
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
  cursor: pointer;
  color: var(--chat-text-secondary, #666);
  font-size: 18px;
  z-index: 50;
  user-select: none;
  transition: box-shadow 0.2s;
}

.scroll-to-bottom-btn:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.18);
  color: #4f6ef7;
}
</style>

<style>
/* ========== 主题变量 ========== */
:root {
  --chat-bg: #f7f8fa;
  --chat-card-bg: #ffffff;
  --chat-text: #1a1a1a;
  --chat-text-secondary: #666;
  --chat-text-muted: #8c8f9c;
  --chat-border: rgba(232, 236, 241, 0.5);
  --chat-user-bg: #e8edff;
  --chat-input-bg: #ffffff;
  --chat-input-border: #d0d5dd;
  --chat-panel-bg: #ffffff;
  --chat-panel-border: #f0f0f0;
  --chat-overlay: rgba(0, 0, 0, 0.2);
  --chat-scrollbar: #d0d5dd;
  --chat-scrollbar-hover: #b0b3be;
  --chat-markdown-bg: #ffffff;
  --chat-code-bg: #0d1117;
  --chat-code-text: #e6edf3;
  --chat-code-label: #8b949e;
  --chat-blockquote-bg: #f0f2f8;
  --chat-inline-code-bg: #f0f2f8;
}

html.dark {
  --chat-bg: #1a1a2e;
  --chat-card-bg: #2d2d4a;
  --chat-text: #e6edf3;
  --chat-text-secondary: #b0b3be;
  --chat-text-muted: #6b6f8a;
  --chat-border: rgba(255, 255, 255, 0.06);
  --chat-user-bg: #3d3d6b;
  --chat-input-bg: #2d2d4a;
  --chat-input-border: #3d3d6b;
  --chat-panel-bg: #2d2d4a;
  --chat-panel-border: rgba(255, 255, 255, 0.06);
  --chat-overlay: rgba(0, 0, 0, 0.5);
  --chat-scrollbar: #3d3d6b;
  --chat-scrollbar-hover: #5a5a8a;
  --chat-markdown-bg: #2d2d4a;
  --chat-code-bg: #0a0a1a;
  --chat-code-text: #e6edf3;
  --chat-code-label: #6b6f8a;
  --chat-blockquote-bg: rgba(79, 110, 247, 0.12);
  --chat-inline-code-bg: rgba(255, 255, 255, 0.08);
}
</style>
