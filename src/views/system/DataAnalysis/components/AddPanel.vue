<!-- AddPanel.vue -->
<template>
    <div class="add-panel-content">
      <p>右侧添加面板</p>
      <p>右侧添加面板</p>
      <p>右侧添加面板</p>
      <p>右侧添加面板</p>
      <p>右侧添加面板</p>
      <p>右侧添加面板</p>
  
      <div 
        class="drag-item"
        draggable="true"
        @dragstart="handleDragStart"
      >
        我是div001
      </div>
  
      <div 
        class="drag-item"
        draggable="true"
        @dragstart="handleDragStart"
      >
      我是div002
      </div>
    </div>
  </template>
  
  <script setup>
  const handleDragStart = (event) => {
    event.dataTransfer.setData('text/plain', 'chart')
  }
  </script>
  
  <style scoped>
  .add-panel-content {
    padding: 5px;
    color: var(--el-text-color-primary, #303133);
  }
  
  .drag-item {
    padding: 12px;
    margin-top: 8px;
    background: #409EFF;
    color: white;
    border-radius: 6px;
    text-align: center;
    cursor: grab;
    user-select: none;
  }
  </style>