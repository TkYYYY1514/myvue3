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
    />

    <!-- 滚动到底部按钮 - absolute 定位在 chat-main 内 -->
    <transition name="fade">
      <div
        v-if="showScrollButton"
        class="scroll-to-bottom-btn"
        @click="doScrollToBottom"
        title="滚动到底部"
      >
        <el-icon><ArrowDown /></el-icon>
        <span v-if="newMessageCount > 0" class="badge">{{ newMessageCount }}</span>
      </div>
    </transition>

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
import { ref, watch, onMounted } from 'vue'
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
const newMessageCount = ref(0)
let lastMessageCount = 0

const doScrollToBottom = () => {
  messageListRef.value?.scrollToBottom()
  showScrollButton.value = false
  newMessageCount.value = 0
  lastMessageCount = messages.value.length
}

// 发送消息时触发自动滚动
const handleSend = () => {
  sendMessage(() => {
    messageListRef.value?.scrollToBottom()
    showScrollButton.value = false
    newMessageCount.value = 0
    lastMessageCount = messages.value.length
  })
}

const handleQuickQuestion = (text) => {
  sendQuickQuestion(text, () => {
    messageListRef.value?.scrollToBottom()
    showScrollButton.value = false
    newMessageCount.value = 0
    lastMessageCount = messages.value.length
  })
}

// 监听消息数量变化
watch(() => messages.value.length, (newLen, oldLen) => {
  if (newLen <= oldLen) return
  const el = messageListRef.value?.messageListRef
  if (!el) return

  const { scrollTop, scrollHeight, clientHeight } = el
  const atBottom = scrollHeight - scrollTop - clientHeight < 10

  if (!atBottom) {
    showScrollButton.value = true
    newMessageCount.value = newLen - lastMessageCount
  }
})

onMounted(() => {
  loadFromLocal()
  checkHealth()
  lastMessageCount = messages.value.length
})
</script>

<style scoped>
.ai-chat-page {
  display: flex;
  flex-direction: column;
  height: 95%;
  background: #f7f8fa;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  position: relative;
}

/* ========== 滚动到底部按钮 ========== */
.scroll-to-bottom-btn {
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 48px;
  height: 48px;
  background: #ffffff;
  border-radius: 50%;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(0, 0, 0, 0.06);
  color: #4f6ef7;
  font-size: 20px;
  z-index: 50;
  user-select: none;
}

.scroll-to-bottom-btn:hover {
  background: #4f6ef7;
  color: #ffffff;
  transform: translateX(-50%) scale(1.1);
  box-shadow: 0 6px 24px rgba(79, 110, 247, 0.4);
}

.scroll-to-bottom-btn:active {
  transform: translateX(-50%) scale(0.95);
}

.scroll-to-bottom-btn .badge {
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  background: #f56c6c;
  color: #ffffff;
  font-size: 11px;
  font-weight: bold;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #ffffff;
  animation: badgePulse 1.5s ease-in-out infinite;
}

@keyframes badgePulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

/* 按钮淡入淡出动画 */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateX(-50%) scale(0.8) translateY(10px);
}
</style>
