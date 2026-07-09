<template>
  <transition name="slide-fade">
    <div v-if="visible" class="system-prompt-overlay" @click.self="$emit('close')">
      <div class="system-prompt-panel">
        <div class="panel-header">
          <span class="panel-title">
            <el-icon><Setting /></el-icon>
            系统提示词
          </span>
          <el-button size="small" text @click="$emit('close')">
            <el-icon><Close /></el-icon>
          </el-button>
        </div>

        <div class="panel-body">
          <el-input
            :model-value="modelValue"
            @update:model-value="$emit('update:modelValue', $event)"
            type="textarea"
            :rows="10"
            placeholder="设置 AI 的角色和性格，例如：你是一个专业的编程助手，擅长用 Python 解决问题。"
          />
          <div class="prompt-hint">
            提示词会告诉 AI 如何回答，影响所有对话
          </div>
        </div>

        <div class="panel-footer">
          <el-button size="small" @click="$emit('reset')">重置</el-button>
          <el-button type="primary" size="small" @click="$emit('save')">保存</el-button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { Setting, Close } from '@element-plus/icons-vue'

defineProps({
  modelValue: { type: String, default: '' },
  visible: { type: Boolean, default: false }
})

defineEmits(['update:modelValue', 'save', 'reset', 'close'])
</script>

<style scoped>
.system-prompt-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.2);
  z-index: 100;
  display: flex;
  justify-content: flex-end;
}

.system-prompt-panel {
  width: 340px;
  height: 100%;
  background: #ffffff;
  box-shadow: -4px 0 24px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  animation: panelIn 0.25s ease-out;
}

@keyframes panelIn {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
  flex-shrink: 0;
}

.panel-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 600;
  color: #1a1a1a;
}

.panel-body {
  flex: 1;
  padding: 16px 20px;
  overflow-y: auto;
}

.panel-body .el-textarea {
  height: 90%;
}

.panel-body :deep(.el-textarea__inner) {
  min-height: 200px;
  resize: vertical;
  font-size: 14px;
  line-height: 1.7;
}

.prompt-hint {
  margin-top: 12px;
  font-size: 12px;
  color: #8c8f9c;
  line-height: 1.6;
}

.panel-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 12px 20px;
  border-top: 1px solid #f0f0f0;
  flex-shrink: 0;
}

/* 入场/离场动画 */
.slide-fade-enter-active {
  transition: opacity 0.2s ease;
}
.slide-fade-leave-active {
  transition: opacity 0.15s ease;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
}
</style>
