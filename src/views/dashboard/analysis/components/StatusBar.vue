<template>
    <div class="status-bar">
      <!-- 左侧：状态信息 -->
      <div class="left">
        <span>状态: {{ isConnected ? '🟢 已连接' : '🔴 未连接' }}</span>
        <span>数据点: {{ dataPointCount }}</span>
        <span>最新: {{ latestTimestamp || '等待中...' }}</span>
      </div>
  
      <!-- 中间：标题（居中） -->
      <div class="center">
        <span class="title">公共聊天室</span>
      </div>
  
      <!-- 右侧：在线人数 -->
      <div class="right">
        <span class="online-count">{{ onlineCount }} 人在线</span>
      </div>
    </div>
  </template>
  
  <script setup>
  defineProps({
    isConnected: { type: Boolean, default: false },
    dataPointCount: { type: Number, default: 0 },
    latestTimestamp: { type: String, default: '' },
    onlineCount: { type: Number, default: -1 }
  })
  </script>
  
  <style scoped>
  .status-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
    padding: 12px 20px;
    border-radius: 1px;
    border: 0.5px solid #a9a9c3b0;
    flex-wrap: wrap;
  }
  
  /* 左侧：状态信息 */
  .left {
    display: flex;
    gap: 10px;
    align-items: center;
    flex: 1;           /* 占剩余空间 */
    justify-content: flex-start;
  }
  
  /* 中间：标题（居中） */
  .center {
    flex: 1;           /* 占剩余空间 */
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  /* 右侧：在线人数 */
  .right {
    flex: 1;           /* 占剩余空间 */
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
  
  .title {
    font-size: 18px;
    font-weight: bold;
  }
  
  .online-count {
    color: #51CF66;
    font-size: 12px;
  }
  </style>