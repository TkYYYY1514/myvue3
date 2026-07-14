<template>
    <div class="chart-controls" :class="{ 'dark-mode': isDark }">
      <el-switch
        v-for="item in chartList"
        :key="item.key"
        v-model="item.visible"
        :active-text="item.label"
        size="small"
        style="--el-switch-on-color: #409EFF; --el-switch-off-color: #dcdfe6;"
        @change="handleChange"
      />
    </div>
    <div>
      

    </div>

  </template>
  
  <script setup>
  import { ref, onMounted, onUnmounted } from 'vue'
  
  const chartList = ref([
    {
      key: 'pie',
      label: '性别分布',
      visible: true
    },
    {
      key: 'bar',
      label: '角色分布',
      visible: true
    },
    {
      key: 'chart3D',
      label: '3D 分布',
      visible: true
    }
  ])
  
  const visibleMap = ref({})
  const isDark = ref(false)
  
  // ===== 检测深色模式 =====
  const checkDark = () => {
    isDark.value = document.documentElement.classList.contains('dark')
  }
  
  let observer = null
  
  onMounted(() => {
    checkDark()
    observer = new MutationObserver(checkDark)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    })
  })
  
  onUnmounted(() => {
    observer?.disconnect()
  })
  
  const updateVisibleMap = () => {
    const map = {}
    chartList.value.forEach(item => {
      map[item.key] = item.visible
    })
    visibleMap.value = map
  }
  updateVisibleMap()
  
  const handleChange = () => {
    updateVisibleMap()
    emit('update:visible', visibleMap.value)
  }
  
  const emit = defineEmits(['update:visible'])
  
  defineExpose({
    chartList,
    visibleMap
  })
  </script>
  
  <style scoped>
  .chart-controls {
    display: flex;
    flex-wrap: wrap;
    gap: 24px;
    align-items: center;
  }
  
  .chart-controls .el-switch {
    --el-switch-core-width: 50px;
  }
  
  .chart-controls .el-switch :deep(.el-switch__label) {
    font-size: 12px;
    font-weight: 300;
    margin-left: 4px;
    color: #333;           /* 默认浅色模式 */
    transition: color 0.3s ease;
  }
  
  /* ===== 深色模式文字颜色 ===== */
  .chart-controls.dark-mode .el-switch :deep(.el-switch__label) {
    color: #e0e0e0 !important;
  }
  
  @media (max-width: 768px) {
    .chart-controls {
      gap: 12px;
      padding: 12px 16px;
    }
  }
  </style>