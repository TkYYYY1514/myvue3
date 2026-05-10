<template>
    <!-- 1. 定义一个容器，必须给宽高，否则 echarts 无法渲染 -->
    <div ref="chartRef" :style="{ width: '400px', height: '400px' }"></div>
  </template>
  
  <script setup>
  import { ref, onMounted, onUnmounted, watch } from 'vue'
  import * as echarts from 'echarts'
  
  // --- 2. 接收父组件传来的配置项 ---
  const props = defineProps({
    option: {
      type: Object,
      required: true // 必须传配置，否则画不出图
    }
  })
  
  // --- 3. 定义变量 ---
  const chartRef = ref(null) // DOM 节点引用
  let chartInstance = null   // ECharts 实例
  
  // --- 4. 初始化图表的方法 ---
  const initChart = () => {
    if (!chartRef.value) return
    
    // 初始化
    chartInstance = echarts.init(chartRef.value)
    // 设置配置项
    chartInstance.setOption(props.option)
  }
  
  // --- 5. 监听窗口大小变化 (实现自适应) ---
  const handleResize = () => {
    if (chartInstance) {
      chartInstance.resize()
    }
  }
  
  // --- 6. 监听配置项变化 (实现数据更新) ---
  watch(
    () => props.option,
    (newOption) => {
      if (chartInstance) {
        chartInstance.setOption(newOption)
      }
    },
    { deep: true } // 深度监听，确保对象内部属性变化也能捕获
  )
  
  // --- 7. 生命周期钩子 ---
  onMounted(() => {
    initChart() // 页面加载好后，画图
    window.addEventListener('resize', handleResize) // 监听窗口变化
  })
  
  onUnmounted(() => {
    window.removeEventListener('resize', handleResize) // 移除监听
    if (chartInstance) {
      chartInstance.dispose() // 销毁实例，防止内存泄漏
      chartInstance = null
    }
  })
  </script>
  
  <style scoped>
  /* 这里可以写默认样式，比如加个背景色之类的 */
  </style>