import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'//图标
import 'element-plus/theme-chalk/dark/css-vars.css'//暗黑模式
import zhCn from 'element-plus/dist/locale/zh-cn.mjs' //中文包
import VueVirtualScroller from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import vCountTo from './directives/vCountTo'
const app = createApp(App)
const pinia = createPinia() 

// if (import.meta.env.DEV) {
//   import('./mock')
// }//仅测试引入mock数据

import permission from './directives/permission'

import './mock'


app.directive('count-to', vCountTo)
//动态数字滚动效果指令
app.directive('permission', permission)
//权限指令

// 全局注册所有图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// ---  防止主题闪烁 ---
const savedMode = localStorage.getItem('themeMode') || 'auto'
let isDark = false

if (savedMode === 'dark') {
  isDark = true
} else if (savedMode === 'auto') {
  isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
}

if (isDark) {
  document.documentElement.classList.add('dark')
} else {
  document.documentElement.classList.remove('dark')
}


//没有token强制跳转登陆界面
const token = localStorage.getItem('token')
if (!token && !window.location.hash.includes('/auth')) {
  window.location.hash = '#/auth/login'
}

// 使用插件时传入 locale
app.use(ElementPlus, {
  locale: zhCn,
})

app.use(VueVirtualScroller)

app.use(router)

app.use(pinia) 
app.mount('#app')