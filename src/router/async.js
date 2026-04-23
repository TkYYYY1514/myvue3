import MainLayout from '@/components/layout/MainLayout.vue'
import { resolveDirective } from 'vue'

export const asyncRouteTemplates ={
    dashboard:{
        path:'/dashboard',
        component: () => import('@/components/layout/MainLayout.vue'), 
        
        meta:{
            title: '仪表盘', 
            icon: 'PieChart', 
            permission: 'dashboard:view' 
        },
        children:[
            {
                path:'',
                redirect:'console'
            },
            {   path: 'console',
                name:'console',
                component: () => import('@/views/dashboard/console.vue'), 
                 meta: { title: '控制台' }
            },
            {   path: 'analysis',
                name:'analysis',
                 component: () => import('@/views/dashboard/analysis.vue'), 
                 meta: { title: '分析页' } 
            },
            {   path: 'ecommerce', 
                name:'ecommerce',
                component: () => import('@/views/dashboard/ecommerce.vue'),
                 meta: { title: '电子商务' } 
            }
        ]
    },
    template:{
        path:'/template',
        component: () => import('@/components/layout/MainLayout.vue'), 
 
        meta:{
            title: '模板中心', 
            icon: 'Reading', 
            permission: 'template:view' 
        },
        children:[
            { 
                path: '',
                redirect: 'cards'
            },
            {   path: 'cards',
                name:'cards',
                component: () => import('@/views/template/cards.vue'), 
                 meta: { title: '卡片' }
            },
            {   path: 'charts',
                name:'charts',
                 component: () => import('@/views/template/charts.vue'), 
                 meta: { title: '分析页' } 
            }
        ]
    },
    system:{
        path:'/system',
        component: () => import('@/components/layout/MainLayout.vue'), 
   
        meta:{
            title: '系统管理', 
            icon: 'User', 
            permission: 'system:view' 
        },
        children:[
            { 
                path: '',
                redirect: 'user'
            },
            {   path: 'user',
                name:'user',
                component: () => import('@/views/system/user.vue'), 
                 meta: { title: '用户管理',
                    permission: 'user:view'
                  }
            },
            {   path: 'role',
                name:'role',
                 component: () => import('@/views/system/role.vue'), 
                 meta: { title: '角色管理',
                    permission: 'role:view'
                  } 
            } 
        ]
    }
}


//菜单顺序
export const menuOrder = [
    'dashboard',
    'template',
    'system'
]

// 检查权限
export function  filterRoutes(permissions) {
    const  result = []

    for (const key of menuOrder){
        const routeTemplate  = asyncRouteTemplates[key]
        if(!routeTemplate ) continue

        //
        const route = { ...routeTemplate }
        
        //检查路由的权限,通过比较路由是否设置权限与用户是否拥有访问页面的权限
        const needPermission = route.meta?.permission//不存在不报错=> ?. 可选链
        if(needPermission && !permissions.includes(needPermission)) continue

        if(route.children){
            const filteredChildren = route.children.filter(child => {
                const childNeedPermission = child.meta?.permission
                return !childNeedPermission || permissions.includes(childNeedPermission)
            })
            route.children = filteredChildren
        }

        result.push(route)
    }
    return result
}


