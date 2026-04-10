<template>
    
    
    <el-menu :default-active="route.path" :collapse="menuStore.isCollapse" style="transition: all 0.01s ease;"
    :unique-opened="true" router >
        <h5 style=" text-align: center;"> Sidebar</h5>

        <el-sub-menu index="submenu-1">
            <template #title>
                <el-icon><PieChart /></el-icon>
                <span>仪表盘</span>
            </template>
                <el-menu-item index="/dashboard/console">工作台</el-menu-item>
                <el-menu-item index="/dashboard/analysis">分析页</el-menu-item>
                <el-menu-item index="/dashboard/ecommerce">电子商务</el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="submenu-2">
            <template #title>
                <el-icon><Reading /></el-icon>
                <span>模板中心</span>
            </template>
                <el-menu-item index="/template/cards">卡片</el-menu-item>
                <el-menu-item index="2-2">横幅</el-menu-item>
                <el-menu-item index="2-3">图表</el-menu-item>
                <el-menu-item index="2-4">地图</el-menu-item>
                <el-menu-item index="2-5">地图</el-menu-item>
                <el-menu-item index="2-6">聊天</el-menu-item>
                <el-menu-item index="2-7">日历</el-menu-item>
                <el-menu-item index="2-8">定价</el-menu-item>
        </el-sub-menu>
        
        <el-sub-menu index="submenu-3">
            <template #title>
                <el-icon><Edit /></el-icon>
                <span>组件中心</span>
            </template>
                <el-menu-item index="3-1">卡片</el-menu-item>
                <el-menu-item index="3-2">横幅</el-menu-item>
                <el-menu-item index="3-3">图表</el-menu-item>
                <el-menu-item index="3-4">地图</el-menu-item>
                <el-menu-item index="3-5">聊天</el-menu-item>
                <el-menu-item index="3-6">日历</el-menu-item>
                <el-menu-item index="3-7">定价</el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="submenu-4">
            <template #title>
                <el-icon><User /></el-icon>
                <span>系统管理</span>
            </template>
                <el-menu-item index="4-1">用户管理</el-menu-item>
                <el-menu-item index="4-2">角色管理</el-menu-item>
                
        </el-sub-menu>

        
                
   </el-menu>
   
</template>

<script setup>
import { useMenuStore } from '@/stores/menu'
import { useTabsStore } from '@/stores/tabs'
import { useRoute} from 'vue-router'
import { watch } from 'vue'

const menuStore = useMenuStore()

const tabsStore = useTabsStore()
const route = useRoute()

// 监听路由变化，同步更新标签页和激活状态
watch(
    () => route.fullPath,
    () =>{
        tabsStore.addTab(route)
    },
    { immediate: true }
)




</script>

<style  scoped>

</style>