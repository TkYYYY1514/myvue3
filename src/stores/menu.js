import { defineStore } from 'pinia'

export const useMenuStore = defineStore('menu', {
  state: () => ({
    isCollapse: true,   // 侧边栏 折叠状态（控制宽度）
    isHidden: false      // 侧边 和 头部  隐藏状态（控制 v-show）
  }),
  actions: {
    // 切换折叠
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    // 切换隐藏（原来的 xo）
    toggleHidden() {
      this.isHidden = !this.isHidden
    }
  }
})