<template>
  <ECharts :option="chartOption" width="100%" height="100%" />
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  /** 图表配置对象，需包含 createOption() 和 updateOption(option, data) */
  config: {
    type: Object,
    required: true
  },
  /** 原始数据，由 config.updateOption 处理注入到 option 中 */
  data: {
    type: Array,
    default: () => []
  }
})

// ===== 由配置对象创建初始 option =====
const chartOption = ref(props.config.createOption())

// ===== 数据变化时，由配置对象的 updateOption 更新 option =====
watch(
  () => props.data,
  (newData) => {
    props.config.updateOption(chartOption.value, newData)
  },
  { deep: true, immediate: true }
)
</script>
