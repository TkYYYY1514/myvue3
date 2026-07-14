<template>
  <header class="chat-header">
    <div class="header-content">
      <div class="header-left">
        <div class="logo">
          <el-tag 
          
          class="menu-button" type="primary">DeepSeek</el-tag>
        </div>
        <div class="header-actions">
          <!-- circle  圆形按钮属性 -->
          <el-button class="menu-button" 
          
          @click="$emit('toggle-system-prompt')" title="系统提示词">
            <el-icon><Setting /></el-icon>
          </el-button>
          <el-button class="menu-button" 
          @click="$emit('clear-messages')" title="清空对话">
            <el-icon><Delete /></el-icon>
          </el-button>
          <el-button  class="menu-button" 
          @click="$emit('toggle-sidebar')" title="隐藏侧边栏">
            <el-icon><FullScreen /></el-icon>
          </el-button>
        </div>
      </div>
      <div class="header-right">
        <el-tag :type="isConnected ? 'success' : 'danger'" size="small">
          {{ isConnected ? '已连接' : '离线' }}
        </el-tag>
        <span class="msg-count">{{ messageCount }} 条消息</span>
      </div>
    </div>
  </header>
</template>

<script setup>
import { Setting, Delete, Fold ,FullScreen} from '@element-plus/icons-vue'

defineProps({
  isConnected: { type: Boolean, default: false },
  messageCount: { type: Number, default: 0 }
})

defineEmits(['toggle-system-prompt', 'clear-messages', 'toggle-sidebar'])
</script>

<style scoped>
.chat-header {
  background: transparent;
  padding: 12px 24px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  border-bottom: 1px solid var(--chat-border, rgba(232, 236, 241, 0.5));
}

.header-content {
  width: 100%;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  font-size: 16px;
  color: var(--chat-text, #1a1a1a);
}

.header-actions {
  display: flex;
  gap: 4px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.msg-count {
  font-size: 12px;
  color: var(--chat-text-muted, #8c8f9c);
}
</style>
