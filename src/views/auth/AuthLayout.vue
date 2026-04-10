<template>
    <div class="auth-container">
        <!-- 左侧页面 -->
        <div class = "left-section">
             <h1>项目管理平台</h1>
            <div></div>
        </div>

        <!-- 右侧表单 -->
        <div  class="right-section">
            <router-view class="form-slide-in"/>
        </div>

    </div>
</template>

<style scoped>
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
    background-color: #f5f5f5;
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
  animation: slideIn 1s 0.2s ease-out forwards; /* 0.2s 延迟，更有层次 */
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