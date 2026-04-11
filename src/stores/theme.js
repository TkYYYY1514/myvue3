import {defineStore } from 'pinia'
import {ref,watch} from 'vue'

export const useThemeStore = defineStore('theme',()=>{
    const themeMode = ref(localStorage.getItem('themeMode') || 'auto')

    const applyThem = (mode)=>{
        let isDark =false

        switch (mode){
            case 'light':
                isDark = false
                break;
            case 'dark':
                isDark = true
                break;
            case 'auto':
                isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
                break;
        }//判断白天，黑夜，自动

        if(isDark){
            document.documentElement.classList.add('dark')
        }else{
            document.documentElement.classList.remove('dark')
        }//更改主题
    }
        watch(themeMode,(newMode)=>{
            applyThem(newMode)
            localStorage.setItem('themeMode',newMode)
        },{immediate:true})// immediate: true 保证 Store 初始化时立即执行一次，防止闪烁
        //只要themeMode改变，就会执行applyThem

        const setTheme = (mode)=>{
            if(['light','dark','auto'].includes(mode)){
                themeMode.value = mode
            }
        }

        return {
            themeMode,//'light' | 'dark' | 'auto'
            setTheme //修改方法
        }
    
})