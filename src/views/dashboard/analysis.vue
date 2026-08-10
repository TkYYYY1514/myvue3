<template>
  <div class="div-box">
    <!-- ===== 状态栏 ===== -->
    <div class="status-bar">
      <div>
        <span>状态: {{ isConnected ? '🟢 已连接' : '🔴 未连接' }}</span>
        <span>数据点: {{ chartData.time.length }}</span>
        <span>最新: {{ latestData.timestamp || '等待中...' }}</span>
      </div>

      <div>
        <span>公共聊天室</span>
        <span class="online-count">{{ onlineCount }} 人在线</span>
      </div>
     
      
    </div>

    <!-- ===== 主体：图表 + 聊天室 左右并排 ===== -->
    <div class="main-row">
      <!-- 左侧：图表 -->
      <div class="chart-wrapper">
        <ECharts :option="realtimeOption" class="chart"/>
      </div>

      <!-- 右侧：聊天室 -->
      <div class="chat-wrapper">
        <!-- <div class="chat-header">
          <span>公共聊天室</span>
          <span class="online-count">{{ onlineCount }} 人在线</span>
        </div> -->

        <div ref="messageListRef" class="chat-messages">
          <div
            v-for="(msg, index) in chatMessages"
            :key="index"
            :class="['chat-msg', msg.isSelf ? 'self' : 'other']"
          >
            <div class="msg-info">
              <span class="msg-nickname">{{ msg.nickname }}</span>
              <span class="msg-time">{{ msg.time }}</span>
            </div>
            <div class="msg-content">
              <!-- 图片消息 -->
              <div v-if="msg.imageUrl">
                <el-image
                  style="max-width: 200px; max-height: 400px; border-radius: 8px;"
                  :src="msg.imageUrl"
                  :preview-src-list="[msg.imageUrl]"
                  fit="cover"
                />
              </div>
              <!-- 文字消息 -->
              <div v-else>{{ msg.content }}</div>
            </div>
          </div>
        </div>

        <div class="chat-input-area">
          <input
            v-model="nickname"
            class="nickname-input"
            placeholder="昵称"
            maxlength="10"
            readonly
          />

          <!-- 隐藏的文件输入 -->
          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            @change="customUpload"
            style="display: none"
          />

          <!-- 上传按钮 -->
          <el-button @click="$refs.fileInput.click()">
            <el-icon><Folder /></el-icon>
          </el-button>

          <input
            v-model="inputText"
            class="message-input"
            placeholder="输入消息..."
            @keyup.enter="sendMessage"
          />
          <button @click="sendMessage" :disabled="!isConnected">发送</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, nextTick } from 'vue'
import ECharts from '@/components/common/ECharts.vue'
import { useWebSocket } from '@/composables/useWebSocket'
import { ElMessage } from 'element-plus'

// ============================================
//  1. WebSocket
// ============================================
const { isConnected, send, onMessage } = useWebSocket('ws://localhost:3000')

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
const inputText = ref('')
const chatMessages = ref([])
const onlineCount = ref(-1)
const messageListRef = ref(null)

// ============================================
//  4. 文件上传
// ============================================
const fileInput = ref(null)

const customUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  // if (!file.type.startsWith('image/')) {
  //   ElMessage.error('只能上传图片！')
  //   event.target.value = ''
  //   return
  // }

  if (file.size > 5 * 1024 * 1024) {
    ElMessage.error('图片大小不能超过 5MB！')
    event.target.value = ''
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

  event.target.value = ''
}

// ============================================
//  5. 实时折线图配置
// ============================================
const realtimeOption = ref({
  title: { text: '实时数据趋势', textStyle: { color: '#a8b5e0', fontSize: 14 } },
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(26,26,46,0.9)',
    borderColor: '#4A90D9'
  },
  legend: {
    data: ['活跃总人数', '男', '女'],
    top: '10',
    right: 'right',
    icon: 'rect',
    itemWidth: 16,
    itemHeight: 2
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    top: '15%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    axisLine: { lineStyle: { color: '#2a2a4a' } },
    axisLabel: { color: '#7a8bb5', fontSize: 10 }
  },
  yAxis: [{
    type: 'value',
    splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } },
    axisLabel: { color: '#7a8bb5' }
  }],
  series: [
    { name: '活跃总人数', type: 'line', smooth: true, symbol: 'none', lineStyle: { color: '#4A90D9', width: 2 }, data: [] },
    { name: '男', type: 'line', smooth: true, symbol: 'none', lineStyle: { color: '#51CF66', width: 2 }, data: [] },
    { name: '女', type: 'line', smooth: true, symbol: 'none', lineStyle: { color: '#FFD93D', width: 2 }, data: [] }
  ]
})

// ============================================
//  6. 更新实时图表
// ============================================
function updateRealtimeChart() {
  realtimeOption.value = {
    ...realtimeOption.value,
    xAxis: { ...realtimeOption.value.xAxis, data: chartData.time },
    series: [
      { ...realtimeOption.value.series[0], data: chartData.value1 },
      { ...realtimeOption.value.series[1], data: chartData.value2 },
      { ...realtimeOption.value.series[2], data: chartData.value3 }
    ]
  }
}

// ============================================
//  7. 发送聊天消息
// ============================================
const sendMessage = () => {
  if (!inputText.value.trim()) return
  if (!isConnected.value) {
    alert('未连接到服务器')
    return
  }

  send('chat', {
    nickname: nickname.value || '匿名',
    content: inputText.value.trim()
  })

  inputText.value = ''
}

// ============================================
//  8. 处理 WebSocket 消息
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

      updateRealtimeChart()
    }

    if (raw.cmd === 'chat') {
      console.log('💬 前端收到聊天:', raw)
      chatMessages.value.push({
        ...raw.data,
        isSelf: raw.data.nickname === nickname.value
      })

      nextTick(() => {
        if (messageListRef.value) {
          messageListRef.value.scrollTop = messageListRef.value.scrollHeight
        }
      })
    }

    if (raw.cmd === 'image') {
      console.log('📷 前端收到图片:', raw)
      chatMessages.value.push({
        nickname: raw.data.nickname || '游客',
        content: '📷 图片',
        imageUrl: raw.data.url,
        time: raw.data.time || new Date().toLocaleTimeString(),
        isSelf: raw.data.nickname === nickname.value
      })

      nextTick(() => {
        if (messageListRef.value) {
          messageListRef.value.scrollTop = messageListRef.value.scrollHeight
        }
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
//  9. 生命周期
// ============================================
onMounted(() => {
  console.log('📊 实时图表组件已加载')
})

onUnmounted(() => {
  console.log('📊 实时图表组件已卸载')
})
</script>

<style scoped>
.div-box {
  display: flex;
  flex-direction: column;
  /* gap: 20px; */
  padding: 5px;
  /* background: #0f0f1a; */
  height: 100%;
  width: 99%;
}

.status-bar {
  >div{
    display: flex;
    gap: 10px;        
    align-items: center;
  }
  display: flex;
  justify-content: space-between;
  align-items: center;
  /* gap: 30px; */
  /* color: #a8b5e0; */
  font-size: 12px;
  padding: 12px 20px;
  /* background: #1a1a2e; */
  border-radius: 1px;
  border: 0.5px solid #a9a9c3b0;
  flex-wrap: wrap;
}

.main-row {
  display: flex;
  /* gap: 20px; */
  height: 85%;
}

.chart-wrapper {
  flex: 1.5;
  /* background: #1a1a2e; */
  border-radius: 1px;
  border: 0.5px solid #a9a9c3b0;
  padding: 16px;
  min-width: 0;
}

.chart {
  width: 100%;
  height: 100%;
}

.chat-wrapper {
  flex: 3;
  /* background: #1a1a2e; */
  border-radius: 1px;
  border: 0.5px solid #a9a9c3b0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* .chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 0.5px solid #a9a9c3b0;
  
  font-size: 14px;
  flex-shrink: 0;
} */

.online-count {
  color: #51CF66;
  font-size: 12px;
}

.chat-messages {
  flex: 1;
  padding: 12px 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-height: 200px;
  /* max-height: 400px; */
}

.chat-msg {
  max-width: 85%;
  padding: 6px 12px;
  border-radius: 10px;
  background: #2a2a4a;
  align-self: flex-start;
  word-break: break-word;
}

.chat-msg.self {
  align-self: flex-end;
  background: #4A90D9;
}

.msg-info {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 2px;
}

.msg-nickname {
  font-size: 11px;
  font-weight: bold;
  color: #6fc3ff;
}

.chat-msg.self .msg-nickname {
  color: #fff;
}

.msg-time {
  font-size: 9px;
  color: #7a8bb5;
}

.chat-msg.self .msg-time {
  color: rgba(255,255,255,0.6);
}

.msg-content {
  color: #fff;
  font-size: 13px;
}

.chat-input-area {
  display: flex;
  gap: 6px;
  padding: 10px 12px;
  /* background: #0f0f1a; */
  border-top: 0.5px solid #a9a9c3b0;
  flex-shrink: 0;
  flex-wrap: wrap;
}

.nickname-input {
  width: 70px;
  padding: 6px 8px;
  background: #9898a78e;
  border: none;
  border-radius: 1px;
  /* color: #fff; */
  font-size: 12px;
}

.message-input {
  flex: 1;
  min-width: 100px;
  padding: 6px 10px;
  background: #9898a78e;
  border: none;
  border-radius: 1px;
  /* color: #fff; */
  font-size: 13px;
}

.chat-input-area input:focus {
  outline: 1px solid #4A90D9;
}

.chat-input-area button {
  padding: 6px 16px;
  background: #4A90D9;
  border: none;
  border-radius: 1px;
  color: #fff;
  cursor: pointer;
  font-size: 13px;
}

.chat-input-area button:disabled {
  background: #2a2a4a;
  color: #7a8bb5;
  cursor: not-allowed;
}

.chat-input-area button:hover:not(:disabled) {
  background: #6FC3FF;
}
</style>