<template>
  <div class="controls-wrapper">
    <!-- 左侧：开关组 -->
    <div class="chart-controls" :class="{ 'dark-mode': isDark }">
      <el-switch
        v-for="item in chartList"
        :key="item.key"
        v-model="item.visible"
        :active-text="item.label"
        size="small"
        style="--el-switch-on-color: #409EFF; --el-switch-off-color: #dcdfe6;"
        @change="handleChange"
      />
    </div>

    <!-- 右侧：操作按钮 -->
    <div class="fullscreen-wrapper">
        <!-- 全屏按钮 -->
      <el-button 
        class="menu-button" 
        @click="menuStore.toggleHidden()"
      >
        <el-icon ><FullScreen /></el-icon>
      </el-button>

      <!-- 侧边添加面板 -->
      <!-- <el-button 
          class="menu-button panel-btn" 
          :class="{ 'rotated': showCCC }"
          @click="togglePanel"
        >
        <el-icon><ArrowRight /></el-icon>
      </el-button> -->

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useMenuStore } from '@/stores/menu'

const menuStore = useMenuStore()

const chartList = ref([
  {
    key: 'pie',
    label: '性别分布',
    visible: true
  },
  {
    key: 'bar',
    label: '角色分布',
    visible: true
  },
  {
    key: 'chart3D',
    label: '3D 分布',
    visible: true
  }
])

const visibleMap = ref({})
const isDark = ref(false)

const showCCC = ref(false)


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

const updateVisibleMap = () => {
  const map = {}
  chartList.value.forEach(item => {
    map[item.key] = item.visible
  })
  visibleMap.value = map
}
updateVisibleMap()

const emit = defineEmits(['update:visible', 'update:showCCC'])


const handleChange = () => {
  updateVisibleMap()
  emit('update:visible', visibleMap.value)
}




// 点击时触发
const togglePanel = () => {
  showCCC.value = !showCCC.value
  emit('update:showCCC', showCCC.value)
}

defineExpose({
  chartList,
  visibleMap
})
</script>

<style scoped>
/* ===== 外层容器：左右对齐 ===== */
.controls-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

/* ===== 右侧全屏按钮 ===== */
.fullscreen-wrapper {
  flex-shrink: 0;
}

.menu-button {
  width: 20px;
  border: none !important;
}

/* ===== 全屏按钮图标大小 ===== */
.menu-button :deep(.el-icon) {
  /* font-size: 22px; */
}

.chart-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  align-items: center;
}

.chart-controls .el-switch {
  --el-switch-core-width: 50px;
}

.chart-controls .el-switch :deep(.el-switch__label) {
  font-size: 12px;
  font-weight: 300;
  margin-left: 4px;
  color: #333;
  transition: color 0.3s ease;
}

.chart-controls.dark-mode .el-switch :deep(.el-switch__label) {
  color: #e0e0e0 !important;
}

@media (max-width: 768px) {
  .chart-controls {
    gap: 12px;
    padding: 12px 16px;
  }
}

/* ===== 面板按钮旋转动画 ===== */
.panel-btn :deep(.el-icon) {
  transition: transform 0.3s ease;
}

.panel-btn.rotated :deep(.el-icon) {
  transform: rotate(180deg);
}
</style>