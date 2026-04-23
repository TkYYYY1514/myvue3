import { defineStore } from 'pinia'
import { filterRoutes } from '@/router/async'

export const usePermissionStore = defineStore('permission',{
    state:() => ({
        permissions:[],
        routes:[],
        menus:[],
        addedRouteNames: []
    }),
    actions:{
        setPermissions(permissions){
            this.permissions = permissions

            this.routes = filterRoutes(permissions)

            // 生成菜单（只保留有子路由的模块）
            this.menus = this.routes.filter(route => {
                return route.children && route.children.length > 0
            })
        },

        // 清除权限
        clearPermissions(){ 
            this.permissions = []
            this.routes = []
            this.menus = []
            
        },

        // 检查是否有某个权限
        hasPermission(permission) {
            return this.permissions.includes(permission)
        },
        
        // 检查是否有任意一个权限
        hasAnyPermission(permissions) {
            return permissions.some(p => this.permissions.includes(p))
        }

        },

})