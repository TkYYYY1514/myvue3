import {defineStore} from 'pinia'
import {ref} from 'vue'
import {useRouter} from 'vue-router'


export const useTabsStore = defineStore('tabs',()=>{
    const router = useRouter()
    const tabsList = ref([])
    const activeTab = ref('')

    //清空标签
    const clearTabs = () => {
        tabsList.value = []
        activeTab.value = ''
    }
    const addTab = (route) => {
        if (tabsList.value.some(item=>item.path === route.path)) {
            // 标签已存在，切换激活状态
            activeTab.value = route.path
            return
        }

        tabsList.value.push({
            path:route.path,
            title:route.meta.title || route.name
        })
     
        activeTab.value = route.path  // 设置当前激活的标签 
    }   
    
    const clickTab =(tab)=>{
        const path = tab.props.name
        router.push(path)
        activeTab.value = path
    }
    const removeTab = (path) => {
        tabsList.value = tabsList.value.filter(item=>item.path !== path)
        // 如果删除的是当前激活的标签，切换到最后一个标签
        if (activeTab.value === path && tabsList.value.length > 0) {
            activeTab.value = tabsList.value[tabsList.value.length - 1].path
            router.push(activeTab.value)
        }
    }

    return {
        tabsList,
        activeTab,
        addTab,
        clickTab,
        removeTab,
        clearTabs
    }
})