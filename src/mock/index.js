import Mock from 'mockjs'

// if (import.meta.env.PROD) {
//     throw new Error('Mock 数据不应该在生产环境中被引入')
// }

// 模拟用户数据
const users =[
    {
        username:'admin',
        password:'123456',
        roles:['admin'],
        token:'admin-token'
    },
    {
        username:'user',
        password:'123456',
        roles:['user'],
        token:'user-token'
    },
    {
        username:'vip',
        password:'123456',
        roles:['user'],
        token:'vip-token'
    }
    
]

Mock.setup({
    timeout: '300-600'  // 设置全局延迟 300-600
})

//2.拦截登陆请求
Mock.mock(/\/api\/auth\/login/,'post',(options) =>{
    //查看请求参数
    console.log(options.body)

    const { username, password }= JSON.parse(options.body)

    const user = users.find(item => item.username === username && item.password === password)

    if(user){
        return {
            code:200,
            message:'登陆成功',
            data:{
                token:user.token,
                roles:user.roles,
                username:user.username
            }
        }
    }else{
        return {
            code:401,
            message:'用户名或密码错误',
            data:null
        }
    }
})
