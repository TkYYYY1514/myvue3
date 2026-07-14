<template>
  <div class="my-echarts" v-loading="loading" element-loading-text="数据加载中...">
    <ChartControls @update:visible="handleVisibleChange" />

    <Gridstack
      v-model:layout="layoutData"
      :options="gridOptions"
      class="gridstack-container"
      @change="onLayoutChange"
    >
      <GridstackItem
        v-for="item in chartItems"
        :key="item.id"
        :id="item.id"
      >
        <div class="chart-card">
          <component
            :is="item.component"
            :data="item.chartData"
            :key="item.id"
          />
        </div>
      </GridstackItem>
    </Gridstack>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { getRoles } from '@/api/role'
import { getUserList } from '@/api/user'

import GenderPieChart from './components/GenderPieChart.vue'
import RoleBarChart from './components/RoleBarChart.vue'
import GenderRole3DChart from './components/GenderRole3DChart.vue'
import ChartControls from './components/ChartControls.vue'

// ============ 加载状态 ============
const loading = ref(true)

// ============ 数据存储 ============
const genderData = ref([])
const roleData = ref([])
const genderRoleData = ref([])

// ============ 组件与数据映射（使用 id 作为唯一 key） ============
const componentMap = {
  pie: GenderPieChart,
  bar: RoleBarChart,
  '3d': GenderRole3DChart
}

// id → 图表类型映射（Gridstack 不保留自定义属性，所以用 id 确定类型）
const idToChartType = {
  pie: 'pie',
  bar: 'bar',
  chart3D: '3d'
}

// ============ GridStack 配置 ============
const gridOptions = {
  column: 12,
  margin: 10,
  cellHeight: 100,
  minRow: 1,
  float: false,
  disableDrag: false,
  disableResize: false
}

// ============ 布局数据（只存 id、位置、大小、类型） ============
const defaultLayout = [
  { id: 'pie', x: 0, y: 0, w: 6, h: 4, type: 'pie' },
  { id: 'bar', x: 6, y: 0, w: 6, h: 4, type: 'bar' },
  { id: 'chart3D', x: 0, y: 4, w: 12, h: 7, type: '3d' }
]

const layoutData = ref([...defaultLayout])

// ============ 可见性控制 ============
const visibleMap = ref({
  pie: true,
  bar: true,
  chart3D: true
})

// ============ 可见的图表列表 ============
const visibleCharts = computed(() => {
  return layoutData.value.filter(item => visibleMap.value[item.id] !== false)
})

// ============ 可见图表列表（含组件和数据的派生列表） ============
const chartItems = computed(() => {
  return visibleCharts.value.map(item => {
    // ⚠️ 关键修复：使用 item.id 而非 item.type 来确定组件和数据
    // Gridstack 的 change 事件返回的 items 不包含自定义 type 属性
    const chartType = idToChartType[item.id] || 'pie'

    let chartData
    switch (chartType) {
      case 'pie':
        chartData = genderData.value
        break
      case 'bar':
        chartData = roleData.value
        break
      case '3d':
        chartData = genderRoleData.value
        break
      default:
        chartData = genderData.value
    }

    return {
      id: item.id,
      x: item.x,
      y: item.y,
      w: item.w,
      h: item.h,
      type: chartType,
      component: componentMap[chartType] || GenderPieChart,
      chartData
    }
  })
})

// ============ 布局变化（只保存必要的字段） ============
const onLayoutChange = (newLayout) => {
  // ⚠️ 重要：Gridstack 的 change 事件不包含自定义 type 属性，
  // 所以需要从 defaultLayout 或 idToChartType 中恢复 type
  const cleanLayout = newLayout.map(item => {
    const defaultItem = defaultLayout.find(d => d.id === item.id)
    return {
      id: item.id,
      x: item.x,
      y: item.y,
      w: item.w,
      h: item.h,
      type: idToChartType[item.id] || defaultItem?.type || item.id
    }
  })
  layoutData.value = cleanLayout
  saveLayout(cleanLayout)
}

// ============ 保存布局 ============
const saveLayout = (data) => {
  try {
    const toSave = (data || layoutData.value).map(item => {
      const defaultItem = defaultLayout.find(d => d.id === item.id)
      return {
        id: item.id,
        x: item.x,
        y: item.y,
        w: item.w,
        h: item.h,
        type: idToChartType[item.id] || defaultItem?.type || item.id
      }
    })
    localStorage.setItem('chart_layout', JSON.stringify(toSave))
  } catch (e) {
    console.warn('保存布局失败:', e)
  }
}

// ============ 加载布局 ============
const loadLayout = () => {
  try {
    const saved = localStorage.getItem('chart_layout')
    if (!saved) return

    const parsed = JSON.parse(saved)
    if (!Array.isArray(parsed) || parsed.length === 0) return

    // 验证并恢复（使用 idToChartType 确保 type 正确）
    const validIds = defaultLayout.map(item => item.id)
    const filtered = parsed.filter(item => validIds.includes(item.id))
    
    if (filtered.length > 0) {
      const restored = filtered.map(item => ({
        id: item.id,
        x: item.x,
        y: item.y,
        w: item.w,
        h: item.h,
        type: idToChartType[item.id] || defaultLayout.find(d => d.id === item.id)?.type || item.id
      }))
      layoutData.value = restored
    }
  } catch (e) {
    console.warn('加载布局失败:', e)
  }
}

// ============ 开关变化 ============
const handleVisibleChange = (newVisibleMap) => {
  visibleMap.value = newVisibleMap
}

// ============ 获取数据 ============
const fetchData = async () => {
  loading.value = true

  try {
    const userRes = await getUserList({ page: 1, pageSize: 100000 })
    const userList = userRes.data.list || []

    const roleRes = await getRoles()
    const roleList = roleRes.data.list || []

    if (userList.length === 0) {
      ElMessage.warning('暂无用户数据')
      return
    }

    // 性别分布
    const genderMap = { 男: 0, 女: 0 }
    userList.forEach(user => {
      if (user.gender === 1) genderMap.男++
      else if (user.gender === 0) genderMap.女++
    })
    genderData.value = [
      { name: '男', value: genderMap.男 },
      { name: '女', value: genderMap.女 }
    ]

    // 角色分布
    const roleCountMap = {}
    roleList.forEach(role => {
      roleCountMap[role.roleName] = 0
    })
    userList.forEach(user => {
      user.roles?.forEach(userRole => {
        if (roleCountMap.hasOwnProperty(userRole.roleName)) {
          roleCountMap[userRole.roleName]++
        }
      })
    })
    const sortedRoles = Object.entries(roleCountMap).sort((a, b) => b[1] - a[1])
    roleData.value = sortedRoles.map(([name, value]) => ({ name, value }))

    // 性别 × 角色
    const comboMap = {}
    roleList.forEach(role => {
      comboMap[`男_${role.roleName}`] = 0
      comboMap[`女_${role.roleName}`] = 0
    })

    userList.forEach(user => {
      const genderKey = user.gender === 1 ? '男' : '女'
      user.roles?.forEach(userRole => {
        const key = `${genderKey}_${userRole.roleName}`
        if (comboMap.hasOwnProperty(key)) {
          comboMap[key]++
        }
      })
    })

    const roleNames = roleList.map(r => r.roleName)
    const genders = ['男', '女']
    
    const result = []
    roleNames.forEach(role => {
      genders.forEach(gender => {
        const key = `${gender}_${role}`
        result.push({
          gender: gender,
          role: role,
          value: comboMap[key] || 0
        })
      })
    })
    genderRoleData.value = result

  } catch (error) {
    ElMessage.error('获取数据失败')
    console.error(error)
  } finally {
    loading.value = false
  }
}

// ============ 生命周期 ============
onMounted(() => {
  loadLayout()
  fetchData()
})
</script>

<style scoped>
.my-echarts {
  width: 100%;
  height: 100%;
  padding: 10px;
  box-sizing: border-box;
  min-height: 400px;
}

.gridstack-container {
  min-height: 700px;
  background: transparent;
}

.chart-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 12px;
  padding: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  box-sizing: border-box;
  overflow: hidden;
  border: 2px solid transparent;
  transition: border-color 0.2s;
}

.chart-card > :deep(*) {
  flex: 1;
  min-height: 0;
}

.chart-card:hover {
  border-color: #409EFF;
}

:deep(.grid-stack-placeholder) {
  background: rgba(64, 158, 255, 0.1);
  border: 2px dashed #409EFF;
  border-radius: 12px;
  opacity: 0.6;
}

html.dark .chart-card {
  background: #1a1a2e;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
  border-color: transparent;
}
</style>