<template>
  <div class="div-box">
    <!-- ===== 状态栏 ===== -->
    <StatusBar
      :is-connected="isConnected"
      :data-point-count="chartData.time.length"
      :latest-timestamp="latestData.timestamp"
      :online-count="onlineCount"
    />

    <!-- ===== 主体：图表 + 聊天室 左右并排 ===== -->
    <div class="main-row">
      <!-- 左侧：实时图表 -->
      <!-- <RealTimeChart :chart-data="chartData" /> -->

      <!-- 右侧：聊天室 -->
      <ChatRoom
        :messages="chatMessages"
        :nickname="nickname"
        :is-connected="isConnected"
        @send-text="handleSendText"
        @send-image="handleSendImage"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { useWebSocket } from '@/composables/useWebSocket'
import { ElMessage } from 'element-plus'
import StatusBar from './components/StatusBar.vue'
import RealTimeChart from './components/RealTimeChart.vue'
import ChatRoom from './components/ChatRoom.vue'

// ============================================
//
// ============================================
// const { isConnected, send, onMessage } = useWebSocket('ws://localhost:3000')

// ============================================
//  2. 实时数据存储
// ============================================
const MAX_POINTS = 30

const chartData = reactive({
  time: [],
  value1: [],
  value2: [],
  value3: []
})
const latestData = ref({})

// ============================================
//  3. 聊天室数据
// ============================================
const nickname = ref('用户' + Math.floor(Math.random() * 1000))

//  连接时带上昵称  + WebSocket 连接
const wsUrl = `ws://localhost:3000?nickname=${encodeURIComponent(nickname.value)}`
const { isConnected, send, onMessage } = useWebSocket(wsUrl)


const chatMessages = ref([])
const onlineCount = ref(-1)

// ============================================
//  4. 发送文本消息
// ============================================
const handleSendText = (content) => {
  if (!isConnected.value) {
    ElMessage.warning('未连接到服务器')
    return
  }
  send('chat', {
    nickname: nickname.value || '匿名',
    content
  })
}

// ============================================
//  5. 图片上传并发送
// ============================================
const handleSendImage = async (file) => {
  if (!file) return

  if (file.size > 5 * 1024 * 1024) {
    ElMessage.error('图片大小不能超过 5MB！')
    return
  }

  const formData = new FormData()
  formData.append('image', file)

  try {
    const response = await fetch('http://localhost:3000/api/upload', {
      method: 'POST',
      body: formData
    })

    const result = await response.json()
    const fullUrl = `http://localhost:3000${result.data.url}`
    console.log('📷 上传结果:', result)

    if (result.code === 0) {
      ElMessage.success('图片上传成功')
      send('image', {
        nickname: nickname.value || '匿名',
        url: fullUrl,
        time: new Date().toLocaleTimeString()
      })
    } else {
      ElMessage.error(result.message || '上传失败')
    }
  } catch (error) {
    console.error('上传失败:', error)
    ElMessage.error('上传失败，请检查网络')
  }
}

// ============================================
//  6. 处理 WebSocket 消息
// ============================================
onMessage((event) => {
  try {
    const raw = JSON.parse(event.data)

    if (raw.cmd === 'realtime_data') {
      const d = raw.data
      latestData.value = d
      onlineCount.value = d.clientsLength

      chartData.time.push(d.timestamp)
      chartData.value1.push(d.value1)
      chartData.value2.push(d.value2)
      chartData.value3.push(d.value3)

      if (chartData.time.length > MAX_POINTS) {
        chartData.time.shift()
        chartData.value1.shift()
        chartData.value2.shift()
        chartData.value3.shift()
      }
    }

    if (raw.cmd === 'chat') {
      console.log('💬 前端收到聊天:', raw)
      chatMessages.value.push({
        ...raw.data,
        isSelf: raw.data.nickname === nickname.value
      })
    }

    if (raw.cmd === 'image') {
      console.log('📷 前端收到图片:', raw)
      chatMessages.value.push({
        nickname: raw.data.nickname || '游客',
        content: '图片',
        imageUrl: raw.data.url,
        time: raw.data.time || new Date().toLocaleTimeString(),
        isSelf: raw.data.nickname === nickname.value
      })
    }

    if (raw.cmd === 'welcome') {
      console.log('👋', raw.message)
    }
  } catch (error) {
    console.error('解析消息失败:', error)
  }
})

// ============================================
//  7. 生命周期
// ============================================
onMounted(() => {
  console.log('实时聊天组件已加载')
})

onUnmounted(() => {
  // console.log('📊 实时图表组件已卸载')

  console.log('实时聊天组件已销毁，断开 WebSocket')
  // disconnect()
})
</script>

<style scoped>
.div-box {
  display: flex;
  flex-direction: column;
  padding: 5px;
  height: 100%;
  width: 99%;
}

.main-row {
  display: flex;
  height: 85%;
}
</style>
