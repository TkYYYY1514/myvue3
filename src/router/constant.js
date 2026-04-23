export const constantRoutes = [
    {
        path: '/',
        redirect:'/auth/login'
    },
    {
        path: '/auth',
        component: () => import('@/views/auth/AuthLayout.vue'),
        children: [
          { path: 'login', component: () => import('@/views/auth/Login.vue') },
          { path: 'register', component: () => import('@/views/auth/Register.vue') }
        ]
    },
    {
      path: '/401',
      component: () => import('@/views/error/401.vue')
    },
    {
      path: '/404',
      component: () => import('@/views/error/404.vue')
    }


]