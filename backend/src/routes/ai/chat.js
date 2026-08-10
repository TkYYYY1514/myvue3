import { Router } from 'express'

// chatWithDeepSeek: 调用 DeepSeek API 的服务函数
import { chatWithDeepSeek } from '../../services/deepseek.js'

const router = Router()

router.post('/',async(req,res) => {
    try{
        const {messages,systemPrompt} = req.body
        
        const finalSystemPrompt = systemPrompt || '你是一个不会说话的智能体，只会使用emoji表情回复用户'
        
        console.log(`[AI]消息数：${messages?.length || 0}`)

        const result = await chatWithDeepSeek(
            messages,
            finalSystemPrompt
        )

        res.setHeader('Content-Type','text/event-stream')
        res.setHeader('Cache-Control','no-cache')
        res.setHeader('Connection','keep-alive')
        
        const reader = result.stream.getReader()
        const decoder = new TextDecoder()

        while(true){
            const {done,value} = await reader.read()
            if(done) break
            res.write(decoder.decode(value))
        }

        res.end()

    }catch (error){
        console.error('[AI]请求失败：',error)
        res.status(500).json({code:500,message:error.message})
    }
})

export default router
