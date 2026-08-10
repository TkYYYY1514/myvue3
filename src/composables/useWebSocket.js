import { ref, onMounted, onUnmounted } from 'vue'

export function useWebSocket(url) {
    const ws = ref(null)
    const isConnected = ref(false)
    const lastMessage = ref(null)
    const messages = ref([])
    const messageHandlers = []
    let reconnectTimer = null  // 🔥 定时器引用
    let isManuallyDisconnected = false  // 🔥 手动断开标记

    const connect = () => {
        // 防止手动断开后重连
        if (isManuallyDisconnected) {
            console.log('已手动断开，不重连')
            return
        }

        // 清除旧连接
        if (ws.value) {
            ws.value.close()
            ws.value = null
        }

        ws.value = new WebSocket(url)

        ws.value.onopen = () => {
            isConnected.value = true
            console.log('ws 已连接')
        }

        ws.value.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data)
                lastMessage.value = data
                messages.value.push(data)
                messageHandlers.forEach(fn => fn(event))
            } catch {
                const rawData = event.data
                lastMessage.value = rawData
                messages.value.push(rawData)
                messageHandlers.forEach(fn => fn(event))
            }
        }

        ws.value.onclose = () => {
            isConnected.value = false
            console.log('ws 已断开！')
            
            // 清理旧定时器
            if (reconnectTimer) {
                clearTimeout(reconnectTimer)
                reconnectTimer = null
            }
            
            // 只有非手动断开才重连
            if (!isManuallyDisconnected) {
                reconnectTimer = setTimeout(() => {
                    console.log('尝试重连...')
                    connect()
                }, 3000)
            }
        }

        ws.value.onerror = (error) => {
            console.error('ws错误', error)
        }
    }

    const send = (cmd, data = {}) => {
        if (!isConnected.value) {
            console.warn('⚠️ ws未连接')
            return
        }
        ws.value.send(JSON.stringify({ cmd, data }))
    }

    const disconnect = () => {
        // 🔥 标记为手动断开
        isManuallyDisconnected = true
        
        // 🔥 清除重连定时器
        if (reconnectTimer) {
            clearTimeout(reconnectTimer)
            reconnectTimer = null
        }
        
        if (ws.value) {
            ws.value.close()
            ws.value = null
            messages.value = []
            isConnected.value = false
        }
        console.log('ws 已手动断开')
    }

    const onMessage = (callback) => {
        messageHandlers.push(callback)
    }

    onMounted(connect)
    onUnmounted(disconnect)

    return {
        ws,
        isConnected,
        lastMessage,
        messages,
        send,
        disconnect,
        connect,
        onMessage,
    }
}