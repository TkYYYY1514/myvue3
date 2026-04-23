import { createRouter, createWebHashHistory } from 'vue-router'
import { constantRoutes } from './constant'
import { usePermissionStore } from '@/stores/permission'

const router = createRouter({
    history: createWebHashHistory(),
    routes: constantRoutes  // 初始只挂载静态路由
})

// 白名单：不需要登录就能访问的页面
const whiteList = ['/auth/login', '/auth/register']

router.beforeEach((to, from) => {
    const token = localStorage.getItem('token')
    const permissionStore = usePermissionStore()
    
    if (token) {
        // 已登录
        if (to.path === '/auth/login') {
            // 如果已登录还访问登录页，重定向到首页
            return '/dashboard/console'
        } else {
            // 检查是否已加载动态路由
            if (permissionStore.routes.length === 0) {
                // 从 localStorage 恢复权限（简化版）
                const savedPermissions = JSON.parse(localStorage.getItem('user_permissions') || '[]')

                if (savedPermissions.length > 0) {
                    // 重新初始化权限 Store
                    permissionStore.setPermissions(savedPermissions)
                    
                    // 重新添加动态路由
                    permissionStore.routes.forEach(route => {
                        router.addRoute(route)
                    })
                    
                    // 添加 404 兜底
                    router.addRoute({ 
                        path: '/:pathMatch(.*)*', 
                        name: 'NotFound',
                        redirect: '/404' 
                    })
                    
                    // 重入当前路由
                    return { ...to, replace: true }
                } else {
                    // 没有保存的权限，跳转登录
                    localStorage.removeItem('token')
                    return '/auth/login'
                }
            } else {
                return true
            }
        }
    } else {
        // 未登录
        if (whiteList.includes(to.path)) {
            // 在白名单中，允许访问
            return true
        } else {
            // 不在白名单，跳转登录页
            return `/auth/login?redirect=${to.path}`
        }
    }
})


export default router