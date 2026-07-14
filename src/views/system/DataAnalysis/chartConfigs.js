// ===================================================
// 图表配置文件 — 统一管理所有图表 option 和数据更新逻辑
// ===================================================
// 使用方式：传入配置 + 数据给 ChartRenderer 组件即可
// 新增图表只需在此文件添加一个配置对象
// ===================================================
import 'echarts-gl'

// ===== 饼图：用户性别分布 =====
export const genderPieConfig = {
  createOption() {
    return {
      title: {
        text: '用户性别分布',
        left: 'center',
        top: 10,
        textStyle: { fontSize: 18, fontWeight: 'bold' }
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
          label: { show: true, formatter: '{b}\n{d}%' },
          itemStyle: { borderRadius: 8, borderColor: '#fff', borderWidth: 2 },
          emphasis: {
            label: { show: true, fontSize: 16, fontWeight: 'bold' },
            itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0,0,0,0.3)' }
          },
          data: []
        }
      ]
    }
  },
  // data: [{ name, value }]
  updateOption(option, data) {
    option.series[0].data = Array.isArray(data) ? data : []
  }
}

// ===== 横向柱状图：角色身份分布 =====
export const roleBarConfig = {
  createOption() {
    return {
      title: {
        text: '角色身份分布',
        left: 'center',
        top: 10,
        textStyle: { fontSize: 18, fontWeight: 'bold' }
      },
      tooltip: {
        trigger: 'axis',
        formatter: '{b}<br/>{a}: {c} 人'
      },
      xAxis: { type: 'value', name: '人数' },
      yAxis: { type: 'category', data: [] },
      series: [
        {
          name: '人数',
          type: 'bar',
          data: [],
          barWidth: 30,
          itemStyle: { borderRadius: [0, 4, 4, 0], color: '#409EFF' },
          label: { show: true, position: 'right', formatter: '{c}人' },
          emphasis: { itemStyle: { color: '#c8eb39' } }
        }
      ]
    }
  },
  // data: [{ name, value }] → name 为角色名，value 为人数
  updateOption(option, data) {
    if (!Array.isArray(data) || data.length === 0) {
      option.yAxis.data = []
      option.series[0].data = []
      return
    }
    option.yAxis.data = data.map(item => item.name)
    option.series[0].data = data.map(item => item.value)
  }
}

// ===== 3D 柱状图：性别 × 角色分布 =====
export const genderRole3DConfig = {
  createOption() {
    return {
      title: {
        text: '性别 × 角色 三维分布',
        left: 'center',
        top: 10,
        textStyle: { fontSize: 18, fontWeight: 'bold' }
      },
      tooltip: {
        trigger: 'item',
        formatter: function (params) {
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
        axisLabel: {},
        nameTextStyle: {}
      },
      yAxis3D: {
        type: 'category',
        data: [],
        name: '角色',
        nameLocation: 'middle',
        axisLabel: {},
        nameTextStyle: {}
      },
      zAxis3D: {
        type: 'value',
        name: '人数',
        nameLocation: 'middle',
        axisLabel: {},
        nameTextStyle: {},
        splitLine: { lineStyle: {} }
      },
      visualMap: {
        max: 100,
        dimension: 'z',
        inRange: { color: ['#409EFF', '#F56C6C', '#E6A23C'] },
        textStyle: {}
      },
      series: [
        {
          type: 'bar3D',
          shading: 'lambert',
          label: {
            show: true,
            formatter: '{c}',
            textStyle: { fontSize: 12 }
          },
          data: [],
          itemStyle: { borderRadius: 4, borderColor: '#fff', borderWidth: 1 },
          encode: { x: 0, y: 1, z: 2 }
        }
      ]
    }
  },
  // data: [{ gender, role, value }]
  updateOption(option, data) {
    if (!Array.isArray(data) || data.length === 0) {
      option.xAxis3D.data = []
      option.yAxis3D.data = []
      option.series[0].data = []
      option.visualMap.max = 10
      return
    }

    try {
      const genders = [...new Set(data.map(item => item.gender))]
      const roles = [...new Set(data.map(item => item.role))]

      option.xAxis3D.data = genders
      option.yAxis3D.data = roles
      option.series[0].data = data.map(item => [item.gender, item.role, item.value])

      const maxValue = Math.max(...data.map(item => item.value))
      option.visualMap.max = maxValue > 0 ? maxValue : 10
    } catch (error) {
      console.warn('3D 图表数据更新失败:', error)
      option.xAxis3D.data = []
      option.yAxis3D.data = []
      option.series[0].data = []
    }
  }
}

// ===== 统一配置映射表 =====
export const chartConfigMap = {
  pie: genderPieConfig,
  bar: roleBarConfig,
  '3d': genderRole3DConfig
}

/** id → 图表类型 */
export const idToChartType = {
  pie: 'pie',
  bar: 'bar',
  chart3D: '3d'
}
