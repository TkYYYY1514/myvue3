<template>
    <el-menu :default-active="route.path" 
    :collapse="menuStore.isCollapse" 
    style="transition: all 0.01s ease; padding: 1px; "
    :unique-opened="true" 
    router 
    class="sidebar-menu">

        <h5 style="text-align: center;">Sidebar</h5>

        <!-- 动态渲染菜单 -->
        <template v-for="menu in permissionStore.menus" :key="menu.path">
            <el-sub-menu :index="menu.path">
                <template #title>
                    <el-icon><component :is="menu.meta.icon" /></el-icon>
                    <span>{{ menu.meta.title }}</span>
                </template>

                <el-menu-item 
                    v-for="child in menu.children.filter(c => c.meta)" 
                    :key="child.path"
                    :index="getFullPath(menu.path, child.path)">
                    {{ child.meta?.title }}
                </el-menu-item>
            </el-sub-menu>
        </template>
   </el-menu>
</template>

<script setup>
import { useMenuStore } from '@/stores/menu'
import { useTabsStore } from '@/stores/tabs'
import { usePermissionStore } from '@/stores/permission'
import { useRoute } from 'vue-router'
import { watch } from 'vue'

const menuStore = useMenuStore()
const tabsStore = useTabsStore()
const permissionStore = usePermissionStore()
const route = useRoute()

// 获取完整路径（处理父路由和子路由的拼接）
const getFullPath = (parentPath, childPath) => {
    if (!childPath || childPath === '') return parentPath
    // 如果子路径已经是绝对路径，直接返回
    if (childPath.startsWith('/')) return childPath
    // 否则拼接父路径
    return `${parentPath}/${childPath}`
}

// 监听路由变化，同步更新标签页和激活状态
watch(
    () => route.fullPath,
    () => {
        tabsStore.addTab(route)
    },
    { immediate: true }
)
</script>

<style  scoped>
.sidebar-menu {
  /* 使用 Element Plus 的阴影变量，或者自定义 */
  box-shadow: var(--el-box-shadow-light); 
  
}

</style>