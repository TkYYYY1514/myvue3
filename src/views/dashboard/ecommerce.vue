

<template>
  <div class="container" tabindex="0" @keydown="handleKeyDown" @keyup="handleKeyUp">
    <canvas ref="canvasRef" width="600" height="400"></canvas>
    <p style="color:white; margin-top:10px;">按 ← → 移动</p>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const canvasRef = ref(null)
let intervalId = null
let frameIndex = 0
let currentAction = 'idle'  // idle | left | right
let facing = 'right'        // 🔥 新增：最后一次移动方向（left | right）
let playerX = 250

// 按键状态
const keys = { left: false, right: false }

onMounted(() => {
  const canvas = canvasRef.value
  const ctx = canvas.getContext('2d')

  const img = new Image()
  img.src = '/3.jpg'

  img.onload = function () {
    intervalId = setInterval(() => {
      // ===== 1. 更新逻辑 =====
      if (keys.left) {
        currentAction = 'left'
        facing = 'left'        // 🔥 记录方向
        playerX -= 3
      } else if (keys.right) {
        currentAction = 'right'
        facing = 'right'       // 🔥 记录方向
        playerX += 3
      } else {
        currentAction = 'idle'
        // 注意：不重置 facing，保持最后移动方向
      }

      // 边界限制
      playerX = Math.max(0, Math.min(canvas.width - 60, playerX))

      // 帧动画
      if (currentAction === 'idle') {
        frameIndex = 0
      } else {
        frameIndex = (frameIndex + 1) % 8
      }

      // ===== 2. 绘制 =====
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // 地面辅助线
      ctx.fillStyle = 'rgba(255,255,255,0.05)'
      ctx.fillRect(0, 350, canvas.width, 2)

      // 画角色
      ctx.save()
      ctx.translate(playerX + 90, 35)

      // 🔥 根据 facing 决定是否翻转（不是 currentAction）
      if (facing === 'left') {
        ctx.scale(-1, 1)
        ctx.translate(-180, 0)
      }

      ctx.drawImage(
        img,
        frameIndex * 184,
        0,
        180,
        325,
        0,
        0,
        180,
        325
      )
      ctx.restore()

      // ===== 3. 显示状态 =====
      ctx.fillStyle = 'white'
      ctx.font = '16px Arial'
      ctx.textAlign = 'left'
      ctx.fillText(`状态: ${currentAction}  朝向: ${facing}  帧: ${frameIndex}`, 10, 30)
    }, 50)
  }
})

// 键盘事件
const handleKeyDown = (e) => {
  if (e.key === 'A' ||e.key === 'a' || e.key === 'ArrowLeft') {
    keys.left = true
    e.preventDefault()
  } else if (e.key === 'D' ||e.key === 'd' || e.key === 'ArrowRight') {
    keys.right = true
    e.preventDefault()
  }
}

const handleKeyUp = (e) => {
  if (e.key === 'A' ||e.key === 'a' || e.key === 'ArrowLeft') {
    keys.left = false
    e.preventDefault()
  } else if (e.key === 'D' ||e.key === 'd' || e.key === 'ArrowRight') {
    keys.right = false
    e.preventDefault()
  }
}

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId)
})
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: #1a1a2e;
  outline: none;
}

canvas {
  border: 2px solid #4A90D9;
  border-radius: 12px;
  background: #fff;
}
</style>