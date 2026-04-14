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
                <el-icon  v-if="themeStore.themeMode !== 'dark'"><Moon /></el-icon>
                <el-icon v-else ><Sunny /></el-icon>
                <!--  亮/暗主题切换 -->
            </el-button>

            <el-button class="menu-button" 
                @click="goToHome">
                <el-icon  v-if="!menuStore.isCollapse"><Setting /></el-icon>
                <el-icon v-else ><Setting /></el-icon>
                <!-- 设置 (跳转首页面，测试用)-->
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
import {  Moon, Sunny, FullScreen } from '@element-plus/icons-vue'
import { useThemeStore } from '@/stores/theme'
import { useRouter } from 'vue-router'

const menuStore = useMenuStore()//控制菜单状态
const isFullScreen = ref(false)//控制全屏状态
const reloadPage = inject('reloadPage')//接受父组件方法
const tabsStore = useTabsStore()//标签
const themeStore = useThemeStore()//主题：白天黑夜
const router = useRouter()

const goToHome = () => {
  router.push('/auth/login') 
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