import { WebSocketServer } from 'ws'

// 客户端列表
let clients = []
let dataInterval = null

export function initWebSocket(server){
    const wss =new WebSocketServer({server})

    wss.on('connection',(ws,req) => {
        const url = new URL(req.url,`http://${req.headers.host}`)
        const nickname = url.searchParams.get('nickname')

        console.log(`${nickname} 已连接`)
        // const token = url.searchParams.get('token')
        // if(token){
        //     console.log(`Token:${token.substring(0,20)}...`)
        // }

        clients.push({
            nickname:nickname,
            ws:ws,
            connectedAt: Date.now()
        })

        //每次有连接就 单播图片
        // 根据请求 Host 动态拼接图片地址，适配本地/云服务器部署
        // （若经 Nginx 等反代且使用 HTTPS，可读 x-forwarded-proto）
        const proto = req.headers['x-forwarded-proto'] || 'http'
        const baseUrl = `${proto}://${req.headers.host}`
        ws.send(JSON.stringify({
            cmd: 'image',
            data: {
                nickname: '管理员',
                url: `${baseUrl}/uploads/image_1786332615752_9o3jnw.gif`,
                time: new Date().toLocaleTimeString()
            }
        }))

        //第一个客户端连接时启动数据生成器
        if(clients.length === 1){
            startDataGenerator()
        }

        ws.on('message',(message) => {
            const text = message.toString()
            console.log('收到:',text)

            try{
                const data =JSON.parse(text)
                handMessage(ws,data)
            } catch {
                ws.send(JSON.stringify({
                    cmd:'error',
                    message:'无效的JSON格式'
                }))
            }
        })

        ws.on('close',() => {
            console.log(`${nickname} 已断开！`)
            clients = clients.filter(client => client.ws !== ws)
       
            if(clients.length === 0){
                stopDataGenerator()
            }
        })

        ws.on('error',(err) => {
            console.error('ws错误:',err)
        })

        ws.send(JSON.stringify({
            cmd:'welcome',
            message:'已连接ws',
            timestamp:Date.now()
        }))
    })

    console.log('ws 已初始化!')
    return wss

}


// 处理消息
function handMessage(ws,data){
    const {cmd, ...payload} = data

    switch(cmd) {
            case 'ping':
                ws.send(JSON.stringify({
                    cmd:'pong',
                    data:{time:Date.now()}
                }))
            break

            case 'echo':
                ws.send(JSON.stringify({
                    cmd:'echo',
                    data:payload
                }))
            break

            case 'chat':
                
                const chatData = payload.data || {}
                const chatMsg = {
                    cmd: 'chat',
                    data: {
                        nickname: chatData.nickname || '游客A',
                        content: chatData.content || '',
                        time: new Date().toLocaleTimeString()
                    }
                }
                   //  三行日志
                console.log('💬 收到聊天消息:', chatMsg)
                console.log(' 当前在线客户端数:', clients.length)
                console.log(' 客户端列表:', clients.map(c => c.ws.readyState))
                //广播
                clients.forEach(client => {
                    if(client.ws.readyState === WebSocket.OPEN){
                        client.ws.send(JSON.stringify(chatMsg))
                    }
                })
                console.log(`[${chatMsg.data.time}] ${chatMsg.data.nickname}:${chatMsg.data.content}`)
            break


            case 'image':
                const imageMsg = {
                    cmd: 'image',
                    data: {
                        nickname: payload.data?.nickname || '游客',
                        url: payload.data?.url || '',
                        time: new Date().toLocaleTimeString()
                    }
                }
                console.log('📷 广播图片:', imageMsg.data.nickname, imageMsg.data.url)
                clients.forEach(client => {
                    if (client.ws.readyState === WebSocket.OPEN) {
                        client.ws.send(JSON.stringify(imageMsg))
                    }
                })
                break
                

    
        
            default:
                ws.send(JSON.stringify({
                    cmd:'error',
                    message: `未知命令:${cmd}`
                }))

        
    }
}


function startDataGenerator(){
    if(dataInterval) return 
    console.log('开始生成数据！')

    dataInterval = setInterval(() => {
        const now = new Date()
        const timestamp = now.toLocaleTimeString()

        // 信号A：正弦波 20~80
        const signalA = Math.sin(now.getTime() / 2000) * 30 + 50
        // 信号B：余弦波 20~70
        const signalB = Math.cos(now.getTime() / 2500) * 25 + 45

        const A = Math.round(signalA)
        const B = Math.round(signalB)


        const data = {
            clientsLength:clients.length,
            timestamp:timestamp,
            time:now.getTime(),

            value1: A+B,  
            value2: A,
            value3: B,
            // cpu:Math.round(Math.random() * 80 + 10),
            // memory:Math.round(Math.random() * 60 +30)
        }

        const message = JSON.stringify({
            cmd:'realtime_data',
            data:data
        })

        clients.forEach(clinet =>{
            if(clinet.ws.readyState === WebSocket.OPEN){
                clinet.ws.send(message)
            }
        })
    },1000)
    


}

function stopDataGenerator(){
    if(dataInterval){
        clearInterval(dataInterval)
        dataInterval = null
        console.log('数据生成已停止')
    }
}