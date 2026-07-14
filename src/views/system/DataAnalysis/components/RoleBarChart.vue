<template>
  <ECharts :option="option" width="100%" height="100%" />
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  data: {
    type: Array,
    required: true,
    default: () => []
  }
})

const option = ref({
  title: {
    text: '角色身份分布',
    left: 'center',
    top: 10,
    textStyle: {
      fontSize: 18,
      fontWeight: 'bold'
    }
  },
  tooltip: {
    trigger: 'axis',
    formatter: '{b}<br/>{a}: {c} 人'
  },
  xAxis: {
    type: 'value',
    name: '人数'
  },
  yAxis: {
    type: 'category',
    data: []
  },
  series: [
    {
      name: '人数',
      type: 'bar',
      data: [],
      barWidth: 30,
      itemStyle: {
        borderRadius: [0, 4, 4, 0],
        color: '#409EFF'
      },
      label: {
        show: true,
        position: 'right',
        formatter: '{c}人'
      },
      emphasis: {
        itemStyle: {
          color: '#c8eb39'
        }
      }
    }
  ]
})

// ===== 添加防御性检查 =====
watch(
  () => props.data,
  (newData) => {
    if (!newData || !Array.isArray(newData) || newData.length === 0) {
      option.value.yAxis.data = []
      option.value.series[0].data = []
      return
    }
    option.value.yAxis.data = newData.map(item => item.name)
    option.value.series[0].data = newData.map(item => item.value)
  },
  { deep: true, immediate: true }
)
</script>