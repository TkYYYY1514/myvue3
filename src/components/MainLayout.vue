<template>
  <div 
  class="common-layout theme-animate" style="height: 100vh;">
    <el-container style="display: flex;height: 100%;">
        <el-aside  :width="menuStore.isCollapse ? '64px' : '200px'"
        style="
        transition: width 0.3s ease;
        

        user-select: none;           
        -webkit-ser-select: none;   
        -moz-user-select: none;      
        -ms-user-select: none;  ">
        <!-- 字体无法选中样式 -->
            <Sidebar />
        </el-aside>
        
        
        <el-container style="flex: 1; min-width: 0; transition: all 0.3s ease;">
            <el-header style="
            height: auto;
            padding: 0;
            user-select: none;           
            -webkit-user-select: none;   
            -moz-user-select: none;      
            -ms-user-select: none; " >
                <Header />
            </el-header>
            

            <el-main  class="view"style="padding: 5px;">
                <!-- 路由动画核心：这里加 Transition//监听路由变化-->
                <router-view v-slot="{ Component }">
                  <Transition name="slide" >
                    <component :is="Component" :key="refreshKey" />
                  </Transition>
                </router-view>
            </el-main>

        </el-container>
    </el-container>
  </div>

</template>

<script setup>
import Sidebar from './Sidebar.vue'
import Header from './Header.vue'
import { useMenuStore } from '@/stores/menu'
const menuStore = useMenuStore()

import { ref, provide } from 'vue'

const refreshKey = ref(0)

// 刷新方法
const reloadPage = () => {
  refreshKey.value++
}

// 交给 header 使用
provide('reloadPage', reloadPage)

</script>

<style scoped>
/* 滚动条样式 */
.el-aside::-webkit-scrollbar {
    width:0.5px;
}

.el-aside {
    scrollbar-width: 2px;
}




/* 禁止滚动 */
.el-main {
  overflow: hidden !important;
}


/* 隐藏滚动条/横轴 */
/* 动画由 Transition 自动控制 */
.slide-enter-from { opacity: 0; transform: translateX(30px); }
.slide-enter-to { opacity: 1; transform: translateX(0); }
.slide-enter-active { transition: 0.4s; }
/* 关键帧 */
@keyframes fadeUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideIn {
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>


