<template>
  <footer class="chat-footer">
    <div class="footer-content">
      <div class="input-wrapper">
        <el-input
          ref="inputRef"
          :model-value="modelValue"
          @update:model-value="$emit('update:modelValue', $event)"
          type="textarea"
          :rows="1"
          placeholder="输入消息... (Shift+Enter 换行)"
          :disabled="disabled"
          @keydown="handleKeyDown"
          @input="autoResize"
        />
        <el-button
          type="primary"
          :disabled="disabled || !modelValue.trim()"
          @click="$emit('send')"
        >
          <el-icon><Promotion /></el-icon>
        </el-button>
      </div>
      
      <div class="footer-info">
        <span v-if="hasSystemPrompt">自定义提示词已启用</span>
        <span v-else>AI 回复由 DeepSeek 提供</span>
        <span>{{ messageCount }} 条消息</span>
      </div>

    </div>
  </footer>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import { Promotion } from '@element-plus/icons-vue'

const props = defineProps({
  modelValue: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  hasSystemPrompt: { type: Boolean, default: false },
  messageCount: { type: Number, default: 0 }
})

const emit = defineEmits(['update:modelValue', 'send'])

const inputRef = ref(null)

const autoResize = () => {
  const el = inputRef.value?.textarea
  if (el) {
    el.style.height = 'auto'
    el.style.height = el.scrollHeight + 'px'
  }
}

const resetHeight = () => {
  const el = inputRef.value?.textarea
  if (el) {
    el.style.height = 'auto'
    // 重置为一行的高度
    el.style.height = '44px'
  }
}

// ===== 监听 modelValue 变化，为空时重置高度 =====
watch(
  () => props.modelValue,
  (newVal) => {
    if (!newVal || newVal.trim() === '') {
      nextTick(() => {
        resetHeight()
      })
    }
  }
)

const handleKeyDown = (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    emit('send')
  }
}

defineExpose({ inputRef, autoResize, resetHeight })
</script>

<style scoped>
.chat-footer {
  flex-shrink: 0;
  background: transparent;
  padding: 8px 24px 16px;
  border-top: 1px solid var(--chat-border, rgba(232, 236, 241, 0.5));
}

.footer-content {
  max-width: 800px;
  margin: 0 auto;
}

.input-wrapper {
  display: flex;
  gap: 12px;
  align-items: flex-end;
}

.input-wrapper .el-textarea {
  flex: 1;
}

.input-wrapper .el-textarea :deep(.el-textarea__inner) {
  min-height: 44px;
  max-height: 120px;
  resize: none;
  border-radius: 8px;
  font-size: 14px;
  padding: 10px 14px;
  border-color: var(--chat-input-border, #d0d5dd);
  background: var(--chat-input-bg, #ffffff);
  transition: border-color 0.2s;
  color: var(--chat-text, #1a1a1a);
}

.input-wrapper .el-textarea :deep(.el-textarea__inner:focus) {
  border-color: #4f6ef7;
}

.input-wrapper .el-button {
  height: 44px;
  width: 44px;
  border-radius: 8px;
  border: none;
  color: #fff;
  font-size: 18px;
  flex-shrink: 0;
}

.input-wrapper .el-button:hover:not(:disabled) {
  transform: scale(1.02);
}

.input-wrapper .el-button:disabled {
  background: #d0d5dd;
  color: #8c8f9c;
}

.footer-info {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  font-size: 12px;
  color: var(--chat-text-muted, #b0b3be);
}
</style>