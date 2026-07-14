<template>
  <div
    ref="chartRef"
    class="echarts-container"
    :class="{ 'echarts-flex': props.height === '100%' }"
    :style="containerStyle"
  ></div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  option: {
    type: Object,
    required: true
  },
  width: {
    type: [String, Number],
    default: '400px'
  },
  height: {
    type: [String, Number],
    default: '400px'
  },
  theme: {
    type: String,
    default: undefined
  }
})

// ===== 当 height="100%" 时，使用 flex: 1 撑满父容器而非 height: 100% =====
// 避免 Gridstack 异步布局下百分比高度计算为 0 的问题
const containerStyle = computed(() => {
  if (props.height === '100%') {
    return { width: props.width }
  }
  return { width: props.width, height: props.height }
})

const chartRef = ref(null)
let chartInstance = null
const isDark = ref(false)

const checkDark = () => {
  isDark.value = document.documentElement.classList.contains('dark')
}

// ===== 获取主题颜色 =====
const getThemeColors = () => {
  const dark = isDark.value
  return {
    textColor: dark ? '#e0e0e0' : '#333',
    subTextColor: dark ? '#999' : '#666',
    axisLineColor: dark ? '#555' : '#ccc',
    splitLineColor: dark ? '#333' : '#eee',
    axisLabelColor: dark ? '#e0e0e0' : '#333'
  }
}

// ===== 函数安全的深拷贝（保留函数、日期等） =====
const safeDeepClone = (obj) => {
  if (obj === null || obj === undefined) return obj
  if (typeof obj === 'function') return obj
  if (obj instanceof Date) return new Date(obj.getTime())
  if (obj instanceof RegExp) return new RegExp(obj.source, obj.flags)
  if (Array.isArray(obj)) return obj.map(safeDeepClone)
  if (typeof obj === 'object') {
    const cloned = {}
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        cloned[key] = safeDeepClone(obj[key])
      }
    }
    return cloned
  }
  return obj
}

// ===== 注入主题颜色（不剥离函数） =====
const injectThemeColors = (option) => {
  const colors = getThemeColors()
  // 使用函数安全的深拷贝，保留所有 formatter 函数
  const newOption = safeDeepClone(option)

  // 1. Title
  if (newOption.title) {
    if (!newOption.title.textStyle) newOption.title.textStyle = {}
    if (!newOption.title.textStyle.color) {
      newOption.title.textStyle.color = colors.textColor
    }
  }

  // 2. Legend
  if (newOption.legend) {
    if (!newOption.legend.textStyle) newOption.legend.textStyle = {}
    if (!newOption.legend.textStyle.color) {
      newOption.legend.textStyle.color = colors.textColor
    }
  }

  // 3. X轴
  if (newOption.xAxis) {
    const xAxis = Array.isArray(newOption.xAxis) ? newOption.xAxis : [newOption.xAxis]
    xAxis.forEach(axis => {
      if (axis) {
        if (axis.axisLabel && !axis.axisLabel.color) {
          axis.axisLabel.color = colors.axisLabelColor
        }
        if (axis.nameTextStyle && !axis.nameTextStyle.color) {
          axis.nameTextStyle.color = colors.textColor
        }
        if (axis.axisLine && axis.axisLine.lineStyle && !axis.axisLine.lineStyle.color) {
          axis.axisLine.lineStyle.color = colors.axisLineColor
        }
        if (axis.splitLine && axis.splitLine.lineStyle && !axis.splitLine.lineStyle.color) {
          axis.splitLine.lineStyle.color = colors.splitLineColor
        }
      }
    })
  }

  // 4. Y轴
  if (newOption.yAxis) {
    const yAxis = Array.isArray(newOption.yAxis) ? newOption.yAxis : [newOption.yAxis]
    yAxis.forEach(axis => {
      if (axis) {
        if (axis.axisLabel && !axis.axisLabel.color) {
          axis.axisLabel.color = colors.axisLabelColor
        }
        if (axis.nameTextStyle && !axis.nameTextStyle.color) {
          axis.nameTextStyle.color = colors.textColor
        }
        if (axis.axisLine && axis.axisLine.lineStyle && !axis.axisLine.lineStyle.color) {
          axis.axisLine.lineStyle.color = colors.axisLineColor
        }
        if (axis.splitLine && axis.splitLine.lineStyle && !axis.splitLine.lineStyle.color) {
          axis.splitLine.lineStyle.color = colors.splitLineColor
        }
      }
    })
  }

  // 5. 3D 坐标轴 (xAxis3D, yAxis3D, zAxis3D)
  ;['xAxis3D', 'yAxis3D', 'zAxis3D'].forEach(axisName => {
    if (newOption[axisName]) {
      const axis = newOption[axisName]
      if (axis.axisLabel && !axis.axisLabel.color) {
        axis.axisLabel.color = colors.axisLabelColor
      }
      if (axis.nameTextStyle && !axis.nameTextStyle.color) {
        axis.nameTextStyle.color = colors.textColor
      }
      if (axis.axisLine && axis.axisLine.lineStyle && !axis.axisLine.lineStyle.color) {
        axis.axisLine.lineStyle.color = colors.axisLineColor
      }
      if (axis.splitLine && axis.splitLine.lineStyle && !axis.splitLine.lineStyle.color) {
        axis.splitLine.lineStyle.color = colors.splitLineColor
      }
    }
  })

  // 6. Series 中的 label
  if (newOption.series) {
    newOption.series.forEach(series => {
      if (series.label && !series.label.color) {
        series.label.color = colors.textColor
      }
      // 3D 图表的 label 在 textStyle 里
      if (series.label && series.label.textStyle && !series.label.textStyle.color) {
        series.label.textStyle.color = colors.textColor
      }
    })
  }

  // 7. VisualMap
  if (newOption.visualMap) {
    if (!newOption.visualMap.textStyle) newOption.visualMap.textStyle = {}
    if (!newOption.visualMap.textStyle.color) {
      newOption.visualMap.textStyle.color = colors.textColor
    }
  }

  return newOption
}

const initChart = () => {
  if (!chartRef.value) return

  let theme = props.theme
  if (theme === undefined) {
    checkDark()
    theme = isDark.value ? 'dark' : undefined
  }

  chartInstance = echarts.init(chartRef.value, theme)
  const finalOption = injectThemeColors(props.option)
  chartInstance.setOption(finalOption)
}

const reInitChart = () => {
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }
  initChart()
}

// ===== 监听配置变化 =====
watch(
  () => props.option,
  (newOption) => {
    if (chartInstance) {
      const finalOption = injectThemeColors(newOption)
      chartInstance.setOption(finalOption)
    }
  },
  { deep: true }
)

watch(
  () => props.theme,
  () => {
    reInitChart()
  }
)

let resizeObserver = null
let darkModeObserver = null

const handleResize = () => {
  if (chartInstance) {
    chartInstance.resize()
  }
}

watch(
  () => [props.width, props.height],
  () => {
    if (chartInstance) {
      chartInstance.resize()
    }
  }
)

onMounted(() => {
  initChart()

  // ===== 使用 ResizeObserver 监听容器尺寸变化（Gridstack 拖拽/缩放时触发） =====
  if (chartRef.value) {
    resizeObserver = new ResizeObserver(() => {
      handleResize()
    })
    resizeObserver.observe(chartRef.value)
  }

  // ===== 监听深色模式变化 =====
  darkModeObserver = new MutationObserver(() => {
    if (props.theme === undefined) {
      reInitChart()
    }
  })
  darkModeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class']
  })
})

onUnmounted(() => {
  resizeObserver?.disconnect()
  darkModeObserver?.disconnect()
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }
})
</script>

<style scoped>
.echarts-container {
  box-sizing: border-box;
  min-height: 200px;
}

/* 当 height="100%" 时，用 flex: 1 撑满父容器 */
.echarts-container.echarts-flex {
  flex: 1;
  min-height: 0;
  width: 100%;
  height: auto;
}
</style>