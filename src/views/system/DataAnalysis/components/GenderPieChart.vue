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
    text: '用户性别分布',
    left: 'center',
    top: 10,
    textStyle: {
      fontSize: 18,
      fontWeight: 'bold'
    }
  },
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b}: {c} 人 ({d}%)'
  },
  legend: {
    orient: 'vertical',
    icon: 'rect',
    left: 'left',
    top: 'top'
  },
  series: [
    {
      name: '用户性别',
      type: 'pie',
      radius: ['40%', '70%'],
      center: ['50%', '55%'],
      label: {
        show: true,
        formatter: '{b}\n{d}%'
      },
      itemStyle: {
        borderRadius: 8,
        borderColor: '#fff',
        borderWidth: 2
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 16,
          fontWeight: 'bold'
        },
        itemStyle: {
          shadowBlur: 10,
          shadowColor: 'rgba(0, 0, 0, 0.3)'
        }
      },
      data: []
    }
  ]
})

// ===== 添加防御性检查 =====
watch(
  () => props.data,
  (newData) => {
    if (!newData || !Array.isArray(newData)) {
      option.value.series[0].data = []
      return
    }
    option.value.series[0].data = newData
  },
  { deep: true, immediate: true }
)
</script>