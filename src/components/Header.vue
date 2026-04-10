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
             
            <el-button class="menu-button" 
                @click="menuStore.toggleCollapse">
                <el-icon  v-if="!menuStore.isCollapse"><Loading /></el-icon>
                <el-icon v-else ><Loading /></el-icon>
            </el-button>


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
                <el-icon  v-if="!isDark"><Moon /></el-icon>
                <el-icon v-else ><Sunny /></el-icon>
                <!--  亮/暗主题切换 -->
            </el-button>

            <el-button class="menu-button" 
                @click="menuStore.toggleCollapse">
                <el-icon  v-if="!menuStore.isCollapse"><Setting /></el-icon>
                <el-icon v-else ><Setting /></el-icon>
                <!-- 设置 -->
            </el-button>

            <!-- <el-avatar
              src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
            />伪头像 -->
     
        </div> <!-- 右侧 -->
        
       
    </div>
    
     <div >
           <el-tabs
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
import { inject } from 'vue'
import { ref } from 'vue'
import { useTabsStore } from '@/stores/tabs'
import { Fold, Moon, Sunny, FullScreen } from '@element-plus/icons-vue'

const menuStore = useMenuStore()//控制菜单状态
const isFullScreen = ref(false)//控制全屏状态
const reloadPage = inject('reloadPage')//接受父组件方法

const tabsStore = useTabsStore()//标签

const isDark = ref(false)//控制主题状态,亮暗



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

// 切换暗黑模式
const toggleDark = () => {
  isDark.value = !isDark.value
  
  // 给 html 标签添加/移除 dark 类
  if (isDark.value) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

const refresh = () => {
  reloadPage() //使用父组件的方法key++，实现路由销毁->创建 //provide,inject
}

</script>


<style scoped>

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



</style>