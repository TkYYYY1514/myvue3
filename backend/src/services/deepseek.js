import 'dotenv/config'

const DEEPSEEK_API_KEY =process.env.DEEPSEEK_API_KEY
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions'

export async function chatWithDeepSeek(messages,systemPrompt = null,
    temperature = 1,maxTokens = 2000){
        //构建消息列表
        const chatMessages = []
        
        //提示词
        if(systemPrompt){
            chatMessages.push({role:'system',content:systemPrompt})
        }

        if(messages && messages.length > 0){
            chatMessages.push(...messages)
        }

        console.log(`[Deepseek]请求消息数:${chatMessages.length}`)

        const response = await fetch(DEEPSEEK_API_URL,{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                'Authorization':`Bearer ${DEEPSEEK_API_KEY}`
                //身份验证
            },
            body: JSON.stringify({
                model: 'deepseek-v4-flash', 
                messages:chatMessages,

                stream: true,//流式输出

                temperature: temperature,
                  // ↑ 温度（0-1），控制回答的随机性
                  // 0.1 = 更确定/保守，0.9 = 更随机/有创意
                max_tokens:maxTokens
            })
        })

        if(!response.ok){
            const errorText = await response.text()
            throw new Error(`DeepSeek API 错误：${response.status}-${errorText}`)
        }

        return {
            stream:response.body,
            status:response.status
        }

}