<template>
   <div class="api-doc">
     <iframe 
       src="https://api-docs.deepseek.com/zh-cn/" 
       class="deepseek-iframe"
     ></iframe>
   </div>
 </template>
 
 
  <script setup>
  // 这个页面组件不需要其他逻辑，主要靠 iframe 展示
  </script>
  
  <style scoped>
  /* 让 iframe 占满页面，显示完整的 DeepSeek 界面 */
  .deepseek-iframe {
    width: 100%;
    height: calc(100vh); /* 根据你的页面布局调整高度 */
    border: none;
    border-radius: 8px;
    background: #fff;
  }
  </style>