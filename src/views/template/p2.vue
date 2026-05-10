<template>

    <Transition name="fade">
      <div v-if="visible" :class="`p2-${type}`">
        <slot>
          <p>这是一条消息</p>
        </slot>
        <button @click="gb">关闭</button>
      </div>
    </Transition>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  const visible = ref(true)
  defineProps(['type'])
  
  function gb() {
    visible.value = false
  }
  </script>
  
  <style scoped>
  .p2-info {
    background-color: #e7f3ff;
    border-left: 4px solid #409eff;
  }
  
  .p2-success {
    background-color: #f0f9eb;
    border-left: 4px solid #67c23a;
  }
  
  .p2-warning {
    background-color: #fdf6ec;
    border-left: 4px solid #e6a23c;
  }
  
  .p2-error {
    background-color: #fef0f0;
    border-left: 4px solid #f56c6c;
  }
  
  /* 加上这 4 行 CSS 就有淡入淡出效果了 */
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease;
  }
  
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
  </style>