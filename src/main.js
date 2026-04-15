import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'//图标
import 'element-plus/theme-chalk/dark/css-vars.css'//暗黑模式

const app = createApp(App)
const pinia = createPinia() 

if (import.meta.env.DEV) {
  import('./mock')
}//引入mock数据

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

app.use(router)
app.use(ElementPlus)
app.use(pinia) 
app.mount('#app')