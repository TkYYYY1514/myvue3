<template>
  <!-- ===== 外层容器 ===== -->
  <div class="page-wrapper">
    <!-- ===== 按钮区域（固定，不滚动） ===== -->
    <div class="btn-top">
      <ChartControls @update:visible="handleVisibleChange"
      @update:showCCC="handleShowCCC" />
    </div>

    <!-- ===== 滚动区域（只滚动图表） ===== -->
    <div class="scroll-area" v-loading="loading" element-loading-text="数据加载中...">
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
            <ChartRenderer
              :config="item.config"
              :data="item.chartData"
              :key="item.id"
            />
          </div>
        </GridstackItem>
      </Gridstack>

        <!-- ===== 右侧添加面板  (未实现)===== -->
        <!-- <AddPanel class="right-panel" :class="{ open: showCCC }" /> -->

        
    </div>
    
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { getRoles } from '@/api/role'
import { getUserList } from '@/api/user'
// import AddPanel from './components/AddPanel.vue'  // ← 导入
import ChartRenderer from '@/components/common/ChartRenderer.vue'
import ChartControls from './components/ChartControls.vue'
import { chartConfigMap, idToChartType } from './chartConfigs'

// 添加面板
const showCCC = ref(false)

const handleShowCCC = (val) => {
  showCCC.value = val
}


// ============ 加载状态 ============
const loading = ref(true)

// ============ 数据存储 ============
const genderData = ref([])
const roleData = ref([])
const genderRoleData = ref([])

// ============ GridStack 配置 ============
const GRID_COLUMN = 200
const GRID_MARGIN = 10
let cellSize = 6  // 默认值

// 计算格子大小
const calcCellSize = (containerWidth) => {
  return (containerWidth - GRID_MARGIN * (GRID_COLUMN - 1)) / GRID_COLUMN
}

// 使用
const gridOptions = {
  column: GRID_COLUMN,
  margin: GRID_MARGIN,
  cellHeight: cellSize,
  minRow: 1,
  float: false,
  disableDrag: false,
  disableResize: false
}

// ============ 布局数据 ============
const defaultLayout = [
  { id: 'pie', x: 0, y: 0, w: 50, h: 10 },
  { id: 'bar', x: 60, y: 0, w: 50, h: 10 },
  { id: 'chart3D', x: 0, y: 40, w: 40, h: 20 }
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

// ============ 可见图表列表（配置 + 数据的派生列表） ============
const chartItems = computed(() => {
  return visibleCharts.value.map(item => {
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
      config: chartConfigMap[chartType],
      chartData
    }
  })
})

// ============ 布局变化 ============
const onLayoutChange = (changedItems) => {
  const updatedLayout = layoutData.value.map(existing => {
    const changed = changedItems.find(item => item.id === existing.id)
    if (changed) {
      return {
        id: changed.id,
        x: changed.x,
        y: changed.y,
        w: changed.w,
        h: changed.h
      }
    }
    return { ...existing }
  })
  layoutData.value = updatedLayout
  saveLayout(updatedLayout)
}

// ============ 保存布局 ============
const saveLayout = (data) => {
  try {
    const toSave = (data || layoutData.value).map(item => ({
      id: item.id,
      x: item.x,
      y: item.y,
      w: item.w,
      h: item.h
    }))
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

    const validIds = defaultLayout.map(item => item.id)
    const filtered = parsed.filter(item => validIds.includes(item.id))

    if (filtered.length > 0) {
      layoutData.value = filtered.map(item => ({
        id: item.id,
        x: item.x,
        y: item.y,
        w: item.w,
        h: item.h
      }))
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
/* ===== 外层容器：占满视口 ===== */
.page-wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--el-bg-color, #f5f7fa);
}

/* ===== 按钮区域：固定高度，不滚动 ===== */
.btn-top {
  flex-shrink: 0;
  padding: 3px 20px;
  background: var(--el-bg-color, #fff);
  border-bottom: 1px solid var(--el-border-color-light, #e4e7ed);
  z-index: 10;
}

/* ===== 滚动区域：占满剩余空间，内部滚动 ===== */
.scroll-area {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 16px;
  box-sizing: border-box;
}

.gridstack-container {
  min-height: 700px;
  background: transparent;
}

.chart-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #eae8e8;
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

/* ===== 深色模式 ===== */
html.dark .page-wrapper {
  background: #1a1a2e;
}

html.dark .btn-top {
  background: #1a1a2e;
  border-bottom-color: #333;
}

html.dark .chart-card {
  background: #000000;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
  border-color: transparent;
}


</style>