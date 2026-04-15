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

const allUsers = Mock.mock({
    'list|1000': [ 
        {
            'id|+1': 1,
            'date': '@date("yyyy-MM-dd HH:mm:ss")',
            'name': '@cname',
            'address': '@county(true)'
        }
    ]
}).list;


Mock.mock(/\/api\/user\/list/,'get',(options) =>{
    const url = new URL(options.url,window.location.origin)
        
    //默认第一页
    const page = parseInt(url.searchParams.get('page') || 1)
    //默认每页20条
    const pageSize = parseInt(url.searchParams.get('pageSize') || 20)

    //计算分页位置
    const start = (page - 1) * pageSize
    const end = start + pageSize

    //从总数据中截取当前页的数据
    const pageData = allUsers.slice(start,end)
   
    return {
        code: 200,
        message: '获取成功',
        data: {
            list: pageData,       // 当前页的列表
            total: allUsers.length // 总条数（前端分页组件需要这个来算有多少页）
        }
    };
});