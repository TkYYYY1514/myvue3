<template>
  <div class="chart-wrapper">
    <ECharts :option="realtimeOption" class="chart" />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import ECharts from '@/components/common/ECharts.vue'

const props = defineProps({
  // 实时数据（数组引用由父组件维护，内部数组会被 push/shift 更新）
  chartData: {
    type: Object,
    required: true
  }
})

// ============================================
//  实时折线图配置
// ============================================
const realtimeOption = ref({
  title: { text: '实时数据趋势', textStyle: { color: '#a8b5e0', fontSize: 14 } },
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(26,26,46,0.9)',
    borderColor: '#4A90D9'
  },
  legend: {
    data: ['活跃总人数', '男', '女'],
    top: '10',
    right: 'right',
    icon: 'rect',
    itemWidth: 16,
    itemHeight: 2
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    top: '15%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    axisLine: { lineStyle: { color: '#2a2a4a' } },
    axisLabel: { color: '#7a8bb5', fontSize: 10 }
  },
  yAxis: [{
    type: 'value',
    splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } },
    axisLabel: { color: '#7a8bb5' }
  }],
  series: [
    { name: '活跃总人数', type: 'line', smooth: true, symbol: 'none', lineStyle: { color: '#4A90D9', width: 2 }, data: [] },
    { name: '男', type: 'line', smooth: true, symbol: 'none', lineStyle: { color: '#51CF66', width: 2 }, data: [] },
    { name: '女', type: 'line', smooth: true, symbol: 'none', lineStyle: { color: '#FFD93D', width: 2 }, data: [] }
  ]
})

// ============================================
//  更新实时图表（整体替换 option 触发 ECharts 更新）
// ============================================
function updateRealtimeChart() {
  realtimeOption.value = {
    ...realtimeOption.value,
    xAxis: { ...realtimeOption.value.xAxis, data: props.chartData.time },
    series: [
      { ...realtimeOption.value.series[0], data: props.chartData.value1 },
      { ...realtimeOption.value.series[1], data: props.chartData.value2 },
      { ...realtimeOption.value.series[2], data: props.chartData.value3 }
    ]
  }
}

// 数据变化时刷新图表
watch(
  () => props.chartData,
  () => updateRealtimeChart(),
  { deep: true }
)
</script>

<style scoped>
.chart-wrapper {
  flex: 1.5;
  border-radius: 1px;
  border-top: 0.5px solid #a9a9c3b0;
    border-left: 0.5px solid #a9a9c3b0;
    border-bottom: 0.5px solid #a9a9c3b0;
    border-right: none;
  padding: 16px;
  min-width: 0;
}

.chart {
  width: 100%;
  height: 100%;
}
</style>
