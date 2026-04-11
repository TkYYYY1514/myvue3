<template>
    <div class="auth-container">
        <!-- 左侧页面 -->
        <div class = "left-section">
             <h1>项目管理平台</h1>
            <div></div>
        </div>

        <!-- 右侧表单 -->
        <div  class="right-section">
          <el-button class="menu-button" 
                @click="toggleDark">
                <el-icon  v-if="themeStore.themeMode !== 'dark'"><Moon /></el-icon>
                <el-icon v-else ><Sunny /></el-icon>
                <!--  亮/暗主题切换 -->
            </el-button>
            <Transition name="form-slide" mode="out-in">
              <router-view :key="$route.fullPath" class="form-slide-in"/>
            </Transition>
        </div>

    </div>
</template>

<script setup>
import { useThemeStore } from '@/stores/theme'
const themeStore = useThemeStore()

const toggleDark = () => {
    if (themeStore.themeMode === 'dark') {
      themeStore.setTheme('light')
    } else {
      themeStore.setTheme('dark')
    }
}//控制暗黑模式按钮
</script>

<style scoped>
.menu-button{
    position: absolute;
    top: 20px;
    right: 20px;
    z-index: 10; /* 确保按钮在最上层 */
}
.menu-button {
  border: none !important;

  box-shadow: none !important;
  padding: 0 8px !important;
}
:deep(.el-icon) {
  font-size: 18px; /* 图标大小， */
  -webkit-text-stroke: 1.2px currentColor; /* 加粗 */
  transition: all 0.4s ease;
}
.menu-button:hover :deep(.el-icon) {
  transform: rotate(360deg);
}/* 旋转 360度 */


.auth-container {
    display: flex;
    width: 100%;
    height: 100vh;
    overflow: hidden; /* 防止动画溢出 */
}
.left-section {
    flex: 3;
    background-color: #c1e8fe;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
.right-section {
    flex: 2;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative; /* 为绝对定位的子元素提供参照 */
}

/*  动画 */

/* 左侧标题：淡入 + 上浮 */
.left-section {
  font-size: 36px;
  color: #1a73e8;
  opacity: 0;
  transform: translateY(30px);
  animation: fadeUp 1s ease-out forwards;
}

/* 右侧表单：从右侧滑入 + 淡入 */
.right-section {
  opacity: 0;
  transform: translateX(40px);
  animation: slideIn 1s 0.2s ease-out forwards; 
}

/* 进入前状态 */
.form-slide-enter-from {
  opacity: 0;
  transform: translateX(20px); /* 从右侧一点点滑入 */
}

/* 离开后状态 */
.form-slide-leave-to {
  opacity: 0;
  transform: translateX(-20px); /* 向左侧一点点滑出 */
}

/* 进入和离开的过渡过程 */
.form-slide-enter-active,
.form-slide-leave-active {
  transition: all 0.2s ease;
}

/* 关键帧 */
@keyframes fadeUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideIn {
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>