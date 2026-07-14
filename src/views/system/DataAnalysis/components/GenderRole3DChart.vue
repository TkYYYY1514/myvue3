<template>
  <ECharts :option="option" width="100%" height="100%" />
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import 'echarts-gl'

const props = defineProps({
  data: {
    type: Array,
    required: true,
    default: () => []
  }
})

// ===== 深色模式检测 =====
const isDark = ref(false)

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

// ===== 获取主题颜色 =====
const getThemeColors = () => {
  const dark = isDark.value
  return {
    textColor: dark ? '#e0e0e0' : '#333',
    axisLineColor: dark ? '#555' : '#ccc',
    splitLineColor: dark ? '#333' : '#eee'
  }
}

const option = ref({
  title: {
    text: '性别 × 角色 三维分布',
    left: 'center',
    top: 10,
    textStyle: {
      fontSize: 18,
      fontWeight: 'bold'
    }
  },
  tooltip: {
    trigger: 'item',
    formatter: function(params) {
      // bar3D 的 params.value 是 [gender, role, count] 数组
      const val = params.value || []
      const gender = val[0] || ''
      const role = val[1] || ''
      const count = val[2] ?? 0
      return `${gender} × ${role}<br/>人数: ${count} 人`
    }
  },
  grid3D: {
    viewControl: {
      autoRotate: true,
      autoRotateSpeed: 6,
      distance: 150,
      minDistance: 80,
      maxDistance: 300,
      alpha: 25,
      beta: -30
    },
    boxWidth: 100,
    boxHeight: 60,
    boxDepth: 100
  },
  xAxis3D: {
    type: 'category',
    data: [],
    name: '性别',
    nameLocation: 'middle',
    axisLabel: {
      color: '#333'
    },
    nameTextStyle: {
      color: '#333'
    }
  },
  yAxis3D: {
    type: 'category',
    data: [],
    name: '角色',
    nameLocation: 'middle',
    axisLabel: {
      color: '#333'
    },
    nameTextStyle: {
      color: '#333'
    }
  },
  zAxis3D: {
    type: 'value',
    name: '人数',
    nameLocation: 'middle',
    axisLabel: {
      color: '#333'
    },
    nameTextStyle: {
      color: '#333'
    },
    splitLine: {
      lineStyle: { color: '#eee' }
    }
  },
  visualMap: {
    max: 100,
    dimension: 'z',
    inRange: {
      color: ['#409EFF', '#F56C6C', '#E6A23C']
    },
    textStyle: {
      color: '#333'
    }
  },
  series: [
    {
      type: 'bar3D',
      shading: 'lambert',
      label: {
        show: true,
        formatter: '{c}',
        textStyle: {
          fontSize: 12,
          color: '#333'
        }
      },
      data: [],
      itemStyle: {
        borderRadius: 4,
        borderColor: '#fff',
        borderWidth: 1
      },
      encode: {
        x: 0,
        y: 1,
        z: 2
      }
    }
  ]
})

// ===== 更新主题颜色 =====
const updateTheme = () => {
  const colors = getThemeColors()
  
  if (option.value.title) {
    option.value.title.textStyle.color = colors.textColor
  }
  
  if (option.value.xAxis3D) {
    option.value.xAxis3D.axisLabel.color = colors.textColor
    option.value.xAxis3D.nameTextStyle.color = colors.textColor
  }
  
  if (option.value.yAxis3D) {
    option.value.yAxis3D.axisLabel.color = colors.textColor
    option.value.yAxis3D.nameTextStyle.color = colors.textColor
  }
  
  if (option.value.zAxis3D) {
    option.value.zAxis3D.axisLabel.color = colors.textColor
    option.value.zAxis3D.nameTextStyle.color = colors.textColor
    if (option.value.zAxis3D.splitLine) {
      option.value.zAxis3D.splitLine.lineStyle.color = colors.splitLineColor
    }
  }
  
  if (option.value.visualMap) {
    option.value.visualMap.textStyle.color = colors.textColor
  }
  
  if (option.value.series && option.value.series.length > 0) {
    option.value.series[0].label.textStyle.color = colors.textColor
  }
}

// ===== 更新图表数据（添加防御性检查） =====
const updateChart = (data) => {
  // 防御性检查：确保 data 是数组且有数据
  if (!data || !Array.isArray(data) || data.length === 0) {
    option.value.xAxis3D.data = []
    option.value.yAxis3D.data = []
    option.value.series[0].data = []
    option.value.visualMap.max = 10
    return
  }

  try {
    const genders = [...new Set(data.map(item => item.gender))]
    const roles = [...new Set(data.map(item => item.role))]

    option.value.xAxis3D.data = genders
    option.value.yAxis3D.data = roles

    option.value.series[0].data = data.map(item => [
      item.gender,
      item.role,
      item.value
    ])

    const maxValue = Math.max(...data.map(item => item.value))
    option.value.visualMap.max = maxValue > 0 ? maxValue : 10
    
    updateTheme()
  } catch (error) {
    console.warn('3D 图表数据更新失败:', error)
    option.value.xAxis3D.data = []
    option.value.yAxis3D.data = []
    option.value.series[0].data = []
  }
}

// ===== 监听数据变化 =====
watch(
  () => props.data,
  (newData) => {
    updateChart(newData)
  },
  { deep: true, immediate: true }
)

// ===== 监听深色模式变化 =====
watch(isDark, () => {
  updateTheme()
}, { immediate: true })
</script>