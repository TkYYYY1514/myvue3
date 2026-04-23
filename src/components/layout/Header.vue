<template>
    <div class="header-container">
        <div>
            <el-button class="menu-button" 
                @click="menuStore.toggleCollapse">
                <el-icon  v-if="!menuStore.isCollapse"><ArrowLeft /></el-icon>
                <el-icon v-else ><ArrowRight /></el-icon>
            </el-button>
            <!-- 折叠 -->
            
            <el-button class="menu-button" 
                @click="refresh">
                <el-icon ><Refresh /></el-icon>
            </el-button>
            <!-- 刷新 -->
             
            <span class="breadcrumb-text">{{ breadcrumb }}</span>
     


        </div> <!-- 左侧 -->
       

        <h3 style="margin:0px 10px;">header</h3>
         
        <div>
            <el-button class="menu-button" 
                @click="toggleFullScreen">
                <el-icon  v-if="!isFullScreen"><FullScreen /></el-icon>
                <el-icon v-else ><Close /></el-icon>
                <!--  全屏 -->
            </el-button>

            <el-button class="menu-button" 
                @click="toggleDark">
                <el-icon  v-if="themeStore.themeMode !== 'dark'"><Moon /></el-icon>
                <el-icon v-else ><Sunny /></el-icon>
                <!--  亮/暗主题切换 -->
            </el-button>

            <el-button class="menu-button" 
                @click="handleLogout">
                  <el-icon ><Setting /></el-icon>
                <!-- 设置 (跳转首页面，测试用)-->
            </el-button>

            <!-- <el-avatar
              src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
            />伪头像 -->
     
        </div> <!-- 右侧 -->
        
       
    </div>
    
     <div >
           <el-tabs
                ref="tabsRef"
                v-model="tabsStore.activeTab"
                type="card"
                @tab-remove="tabsStore.removeTab"
                @tab-click="tabsStore.clickTab"
                >
            <el-tab-pane
                    v-for="(tab, index) in tabsStore.tabsList"
                    :key="tab.path"
                    :label="tab.title"
                    :name="tab.path"
                    :closable="tabsStore.tabsList.length > 1"
                />
            </el-tabs>
     </div> <!-- 标签栏 -->
     
</template>

<script setup>
import { useMenuStore } from '@/stores/menu'
import { inject ,computed} from 'vue'
import { ref } from 'vue'
import { useTabsStore } from '@/stores/tabs'
import {  Moon, Sunny, FullScreen } from '@element-plus/icons-vue'
import { useThemeStore } from '@/stores/theme'
import { useRouter, useRoute } from 'vue-router'
import { usePermissionStore } from '@/stores/permission' 
import { useUserStore } from '@/stores/user'
import { ElMessage, ElMessageBox } from 'element-plus'
import { onMounted, watch } from 'vue'
    import Sortable from 'sortablejs'

const menuStore = useMenuStore()//控制菜单状态
const isFullScreen = ref(false)//控制全屏状态
const reloadPage = inject('reloadPage')//接受父组件方法
const tabsStore = useTabsStore()//标签
const tabsRef = ref(null)//拖拽

const themeStore = useThemeStore()//主题：白天黑夜
const router = useRouter()
const route = useRoute()//获取当前路由信息

const userStore = useUserStore()
const permissionStore = usePermissionStore()


let sortable = null

function initSortable() {
  // 找到标签栏容器
  const nav = tabsRef.value?.$el.querySelector('.el-tabs__nav')
  if (!nav) return

  // 防止重复创建
  if (sortable) sortable.destroy()

  sortable = Sortable.create(nav, {
    animation: 200,
    onEnd(e) {
      const oldIndex = e.oldIndex
      const newIndex = e.newIndex

      // 改变数组顺序
      const tab = tabsStore.tabsList.splice(oldIndex, 1)[0]
      tabsStore.tabsList.splice(newIndex, 0, tab)
    }
  })
}
onMounted(() => {
  setTimeout(initSortable, 100)
})

// 标签增删时重新初始化
watch(
  () => tabsStore.tabsList.length,
  () => {
    setTimeout(initSortable, 100)
  }
)



const handleLogout  = () => {
    ElMessageBox.confirm('确定要退出登录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        // 1. 清除用户信息
        userStore.logouAction()
        
        // 2. 清除权限信息
        permissionStore.clearPermissions()
        
        // 3. 清除标签页
        tabsStore.clearTabs()
        
        // 4. 跳转到登录页
        router.push('/auth/login')
        
        
        ElMessage.success('已退出登录')
    }).catch(() => {
        // 用户取消
    })
}
const toggleFullScreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().then(() => {
      isFullScreen.value = true
    })
  } else {
    document.exitFullscreen().then(() => {
      isFullScreen.value = false
    })
  }
}//控制全屏按钮


// 【新增】计算面包屑路径：主路由 / 当前页面
const breadcrumb = computed(() => {
  // 1. 获取所有匹配的路由记录
  const matched = route.matched
  
  // 2. 过滤并映射标题
  const paths = matched
    .filter(item => {
      // 排除掉根重定向 '/' 
      if (item.path === '/') return false
      // 排除掉没有 title 且没有 name 的匿名路由
      if (!item.meta?.title && !item.name) return false
      return true
    })
    .map(item => {
      // 优先显示 meta.title，如果没有则显示 name (并将首字母大写或保持原样)
      return item.meta?.title || item.name
    })

  // 3. 用 ' / ' 连接
  return paths.join(' / ')
})



const toggleDark = () => {
    if (themeStore.themeMode === 'dark') {
      themeStore.setTheme('light')
    } else {
      themeStore.setTheme('dark')
    }
}//控制主题模式按钮

const refresh = () => {
  reloadPage() //使用父组件的方法key++，实现路由销毁->创建 //provide,inject
}

</script>


<style scoped>
/* 拖拽样式 */
:deep(.el-tabs__item) {
  cursor: grab;
}
:deep(.el-tabs__item:active) {
  cursor: grabbing;
}


.menu-button {
  border: none !important;

  box-shadow: none !important;
  padding: 0 8px !important;
}
:deep(.el-icon) {
  font-size: 18px; /* 图标大小， */
  -webkit-text-stroke: 1.2px currentColor; /* 加粗 */
  transition: all 0.4s ease;
}
.menu-button:hover :deep(.el-icon) {
  transform: rotate(360deg);
}/* 旋转 360度 */

.header-container{
    display: flex;
    justify-content: space-between;
    padding: 10px 10px;
}

.breadcrumb-text {
  margin-left: 15px;
  font-size: 14px;
  color: #909399; /* 浅灰色 */
}
.breadcrumb-text span {
  color: #303133; /* 当前页深色 */
  font-weight: bold;
}


</style>