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
  // width: {
  //   type: [String, Number],
  //   default: '600px'
  // },
  // height: {
  //   type: [String, Number],
  //   default: '400px'
  // },
  theme: {
    type: String,
    default: undefined
  }
})

// ===== 当 height="100%" 时，用 flex: 1 撑满而非 height: 100% =====
const containerStyle = computed(() => {
  if (props.height === '100%') {
    return { width: props.width }
  }
  return { width: props.width, height: props.height }
})

const chartRef = ref(null)
let chartInstance = null
const isDark = ref(false)

let resizeObserver = null
let darkModeObserver = null
let initRetryTimer = null

// ===== 暂存：容器就绪前的 option 变更 =====
let pendingOption = null

// ===== 检测深色模式 =====
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

// ===== 函数安全的深拷贝 =====
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

// ===== 注入主题颜色 =====
const injectThemeColors = (option) => {
  const colors = getThemeColors()
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
        if (axis.axisLabel && !axis.axisLabel.color) axis.axisLabel.color = colors.axisLabelColor
        if (axis.nameTextStyle && !axis.nameTextStyle.color) axis.nameTextStyle.color = colors.textColor
        if (axis.axisLine?.lineStyle && !axis.axisLine.lineStyle.color) axis.axisLine.lineStyle.color = colors.axisLineColor
        if (axis.splitLine?.lineStyle && !axis.splitLine.lineStyle.color) axis.splitLine.lineStyle.color = colors.splitLineColor
      }
    })
  }

  // 4. Y轴
  if (newOption.yAxis) {
    const yAxis = Array.isArray(newOption.yAxis) ? newOption.yAxis : [newOption.yAxis]
    yAxis.forEach(axis => {
      if (axis) {
        if (axis.axisLabel && !axis.axisLabel.color) axis.axisLabel.color = colors.axisLabelColor
        if (axis.nameTextStyle && !axis.nameTextStyle.color) axis.nameTextStyle.color = colors.textColor
        if (axis.axisLine?.lineStyle && !axis.axisLine.lineStyle.color) axis.axisLine.lineStyle.color = colors.axisLineColor
        if (axis.splitLine?.lineStyle && !axis.splitLine.lineStyle.color) axis.splitLine.lineStyle.color = colors.splitLineColor
      }
    })
  }

  // 5. 3D 坐标轴
  ;['xAxis3D', 'yAxis3D', 'zAxis3D'].forEach(axisName => {
    if (newOption[axisName]) {
      const axis = newOption[axisName]
      if (axis.axisLabel && !axis.axisLabel.color) axis.axisLabel.color = colors.axisLabelColor
      if (axis.nameTextStyle && !axis.nameTextStyle.color) axis.nameTextStyle.color = colors.textColor
      if (axis.axisLine?.lineStyle && !axis.axisLine.lineStyle.color) axis.axisLine.lineStyle.color = colors.axisLineColor
      if (axis.splitLine?.lineStyle && !axis.splitLine.lineStyle.color) axis.splitLine.lineStyle.color = colors.splitLineColor
    }
  })

  // 6. Series label（ECharts 5.x 废弃了 label.textStyle，使用扁平属性）
  if (newOption.series) {
    newOption.series.forEach(series => {
      if (series.label) {
        if (!series.label.color) series.label.color = colors.textColor
        // 兼容旧版 textStyle（如果存在）
        if (series.label.textStyle && !series.label.textStyle.color) {
          series.label.textStyle.color = colors.textColor
        }
      }
    })
  }

  // 7. VisualMap
  if (newOption.visualMap) {
    if (!newOption.visualMap.textStyle) newOption.visualMap.textStyle = {}
    if (!newOption.visualMap.textStyle.color) newOption.visualMap.textStyle.color = colors.textColor
  }

  return newOption
}

// ===== 核心修复：容器有尺寸时才初始化 =====
const tryInitChart = () => {
  if (chartInstance) return true
  if (!chartRef.value) return false

  // ⚠️ 容器没有宽高 → 跳过，等 ResizeObserver 触发后再试
  const rect = chartRef.value.getBoundingClientRect()
  if (rect.width === 0 || rect.height === 0) {
    return false
  }

  let theme = props.theme
  if (theme === undefined) {
    checkDark()
    theme = isDark.value ? 'dark' : undefined
  }

  chartInstance = echarts.init(chartRef.value, theme)
  const finalOption = injectThemeColors(pendingOption || props.option)
  chartInstance.setOption(finalOption)
  pendingOption = null
  return true
}

// ===== 尺寸变化处理 =====
const handleResize = () => {
  if (chartInstance) {
    chartInstance.resize()
  } else {
    // 容器有尺寸了但 chart 还没初始化 → 现在初始化
    tryInitChart()
  }
}

// ===== 监听 option 变化 =====
watch(
  () => props.option,
  (newOption) => {
    if (chartInstance) {
      const finalOption = injectThemeColors(newOption)
      chartInstance.setOption(finalOption)
    } else {
      // 还没初始化，暂存 option
      pendingOption = newOption
    }
  },
  { deep: true }
)

watch(
  () => props.theme,
  () => {
    if (chartInstance) {
      chartInstance.dispose()
      chartInstance = null
    }
    tryInitChart()
  }
)

watch(
  () => [props.width, props.height],
  () => {
    handleResize()
  }
)

onMounted(() => {
  // ===== 尝试立即初始化（容器可能还没尺寸，会跳过） =====
  const initialized = tryInitChart()

  if (!initialized) {
    // ===== 轮询重试：每 200ms 检查一次容器尺寸，最多 20 次（4 秒） =====
    // 解决路由切换/Transition 动画导致容器尺寸暂为 0 的问题
    let attempts = 0
    const retry = () => {
      if (tryInitChart()) return
      attempts++
      if (attempts < 20) {
        initRetryTimer = setTimeout(retry, 200)
      }
    }
    initRetryTimer = setTimeout(retry, 200)
  }

  // ===== ResizeObserver =====
  if (chartRef.value) {
    resizeObserver = new ResizeObserver(() => {
      handleResize()
    })
    resizeObserver.observe(chartRef.value)
  }

  // ===== 深色模式监听 =====
  darkModeObserver = new MutationObserver(() => {
    if (props.theme === undefined) {
      checkDark()
      if (chartInstance) {
        chartInstance.dispose()
        chartInstance = null
      }
      tryInitChart()
    }
  })
  darkModeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class']
  })
})

onUnmounted(() => {
  clearTimeout(initRetryTimer)
  resizeObserver?.disconnect()
  darkModeObserver?.disconnect()
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }
  pendingOption = null
})
</script>

<style scoped>
.echarts-container {
  box-sizing: border-box;
  min-height: 200px;
}

.echarts-container.echarts-flex {
  flex: 1;
  min-height: 0;
  width: 100%;
  height: auto;
}
</style>
