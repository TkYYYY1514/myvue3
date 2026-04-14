import { createRouter, createWebHashHistory } from 'vue-router'
import AuthLayout from '../views/auth/AuthLayout.vue'
import MainLayout from '../components/MainLayout.vue'
const routes = [
    {
        path: '/',
        redirect: '/auth/login'
    },//重定向默认路由

    {
        path: '/auth',
        component: AuthLayout,
        children: [
            {
                path: 'login',
                component: () => import('../views/auth/Login.vue')
            },
            {
                path: 'register',
                component: () => import('../views/auth/Register.vue')
            }
        ]
    },//登陆注册路由

    {
        path: '/dashboard',
        component: MainLayout,
        children: [
            {
                path: 'console',
                component: () => import('../views/dashboard/console.vue'),
                meta:{
                    title: '工作台'
                }
            },
            {
                path: 'analysis',
                component: () => import('../views/dashboard/analysis.vue'),
                meta:{
                    title: '分析页'
                }
            },
            {
                path: 'ecommerce',
                component: () => import('../views/dashboard/ecommerce.vue'),
                meta:{
                    title: '电子商务'
                }
            }

        ]
    },//仪表盘页面

    {
        path: '/template',
        component: MainLayout,
        children: [
            {
                path: 'cards',
                component: () => import('../views/template/cards.vue'),
                meta:{
                    title: '卡片'
                }
            },
            
            {
                path: 'charts',
                component: () => import('../views/template/charts.vue'),
                meta:{
                    title: '图表'
                }
            }
        ]
    },//模板中心页面
    
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token')

    //需要认证，mainlayout下的所有路由
    const requireAuth = to.matched.some(record => 
        record.component?.name === 'MainLayout'||
        to.path.startsWith('/dashboard') ||
        to.path.startsWith('/template')    
    )

    if(requireAuth && !token){
        //未登录跳转登陆页
        next('/auth/login')
    }else{
        next()
    }

})


export default router