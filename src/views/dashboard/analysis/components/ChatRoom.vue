<template>
  <div class="chat-wrapper">

    

    <!-- 消息列表 -->
    <div ref="messageListRef" class="chat-messages">
      <div
        v-for="(msg, index) in messages"
        :key="index"
        :class="['chat-msg', msg.isSelf ? 'self' : 'other']"
      >
        <div class="msg-info">
          <span class="msg-nickname">{{ msg.nickname }}</span>
          <span class="msg-time">{{ msg.time }}</span>
        </div>
        <div class="msg-content">
          <!-- 图片消息 -->
          <div v-if="msg.imageUrl">
            <el-image
              style="max-width: 200px; max-height: 400px; border-radius: 8px;"
              :src="msg.imageUrl"
              :preview-src-list="[msg.imageUrl]"
              fit="cover"
            />
          </div>
          <!-- 文字消息 -->
          <div v-else>{{ msg.content }}</div>
        </div>
      </div>
    </div>

    <!-- 输入区 -->
    <div class="chat-input-area">
      <input
        :value="nickname"
        class="nickname-input"
        placeholder="昵称"
        maxlength="10"
        readonly
      />

      <!-- 隐藏的文件输入 -->
      <input
        ref="fileInput"
        type="file"
        accept="image/*"
        @change="onFileChange"
        style="display: none"
      />

      <!-- 上传按钮 -->
      <el-button @click="fileInput?.click()">
        <el-icon><Folder /></el-icon>
      </el-button>

      <input
        v-model="inputText"
        class="message-input"
        placeholder="输入消息..."
        @keyup.enter="handleSend"
      />
      <button @click="handleSend" :disabled="!isConnected">发送</button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'

const props = defineProps({
  // 聊天消息列表（父组件维护，含 isSelf 标记）
  messages: { type: Array, default: () => [] },
  // 当前用户昵称（只读展示）
  nickname: { type: String, default: '' },
  // 是否已连接服务器
  isConnected: { type: Boolean, default: false }
})

const emit = defineEmits(['send-text', 'send-image'])

// ============================================
//  输入与文件选择
// ============================================
const inputText = ref('')
const fileInput = ref(null)
const messageListRef = ref(null)

const handleSend = () => {
  if (!inputText.value.trim()) return
  emit('send-text', inputText.value.trim())
  inputText.value = ''
}

const onFileChange = (event) => {
  const file = event.target.files[0]
  if (!file) return
  emit('send-image', file)
  event.target.value = ''
}

// ============================================
//  新消息到达自动滚动到底部
// ============================================
watch(
  () => props.messages.length,
  () => {
    nextTick(() => {
      if (messageListRef.value) {
        messageListRef.value.scrollTop = messageListRef.value.scrollHeight
      }
    })
  }
)
</script>

<style scoped>
.chat-wrapper {
  flex: 3;
  border-radius: 1px;
  border: 0.5px solid #a9a9c3b0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.chat-messages {
  flex: 1;
  padding: 12px 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-height: 200px;
}

.chat-msg {
  max-width: 85%;
  padding: 6px 12px;
  border-radius: 10px;
  background: #2a2a4a;
  align-self: flex-start;
  word-break: break-word;
}

.chat-msg.self {
  align-self: flex-end;
  background: #4A90D9;
}

.msg-info {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 2px;
}

.msg-nickname {
  font-size: 11px;
  font-weight: bold;
  color: #6fc3ff;
}

.chat-msg.self .msg-nickname {
  color: #fff;
}

.msg-time {
  font-size: 9px;
  color: #7a8bb5;
}

.chat-msg.self .msg-time {
  color: rgba(255, 255, 255, 0.6);
}

.msg-content {
  color: #fff;
  font-size: 13px;
}

.chat-input-area {
  display: flex;
  gap: 6px;
  padding: 10px 12px;
  border-top: 0.5px solid #a9a9c3b0;
  flex-shrink: 0;
  flex-wrap: wrap;
}

.nickname-input {
  width: 70px;
  padding: 6px 8px;
  background: #9898a78e;
  border: none;
  border-radius: 1px;
  font-size: 12px;
}

.message-input {
  flex: 1;
  min-width: 100px;
  padding: 6px 10px;
  background: #9898a78e;
  border: none;
  border-radius: 1px;
  font-size: 13px;
}

.chat-input-area input:focus {
  outline: 1px solid #4A90D9;
}

.chat-input-area button {
  padding: 6px 16px;
  background: #4A90D9;
  border: none;
  border-radius: 1px;
  color: #fff;
  cursor: pointer;
  font-size: 13px;
}

.chat-input-area button:disabled {
  background: #2a2a4a;
  color: #7a8bb5;
  cursor: not-allowed;
}

.chat-input-area button:hover:not(:disabled) {
  background: #6FC3FF;
}
</style>
