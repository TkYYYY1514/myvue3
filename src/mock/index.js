import Mock from 'mockjs'

// if (import.meta.env.PROD) {
//     throw new Error('Mock 数据不应该在生产环境中被引入')
// }

// 角色-权限映射表
const rolePermissionsMap = {
    R_SUPER: [
        'dashboard:view', 'template:view', 'system:view', 'user:view', 'role:view','user:create','user:update','user:delete'
    ], 
    R_ADMIN: [
        'dashboard:view', 'template:view', 'system:view', 'user:view'
    ],
    R_USER: [
        'dashboard:view', 'template:view'
    ],
    R_FINANCE:[
        'template:view', 'system:view', 'user:view'
    ]
}

// 定义角色池（可变数组）
let rolePool = [
    { roleId: 0, roleName: '超级管理员', roleCode: 'R_SUPER' },
    { roleId: 1, roleName: '普通管理员', roleCode: 'R_ADMIN' },
    { roleId: 2, roleName: '普通用户', roleCode: 'R_USER' },
    { roleId: 3, roleName: '财务', roleCode: 'R_FINANCE' }
]

// 生成随机角色的辅助函数
function getRandomRoles() {
    const count = Math.floor(Math.random() * 2) + 1  // 随机 1-2 个
    const shuffled = [...rolePool].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, count)
}

// 根据角色获取权限的函数
function getPermissionsByRole(roles) {
    const permissions = []
    // 检查 roles 是否为字符串数组
    if (Array.isArray(roles) && typeof roles[0] === 'string') {
        // 如果是字符串数组，直接使用
        roles.forEach(roleCode => {
            if(rolePermissionsMap[roleCode]){
                permissions.push(...rolePermissionsMap[roleCode])
            }
        })
    } else {
        // 如果是角色对象数组，使用 roleCode 属性
        roles.forEach(role => {
            if(role.roleCode && rolePermissionsMap[role.roleCode]){
                permissions.push(...rolePermissionsMap[role.roleCode])
            }
        })
    }
    return [...new Set(permissions)]
}

// 模拟用户数据 (固定管理员)
const users = [
    {   
        id: 1,
        username: 'super',
        password: '123456',
        phone: '13800138000',
        roles: [{ roleId: 0, roleName: '超级管理员', roleCode: 'R_SUPER' }],
        gender: 1,
        token: 'super-token'
    },
    {   
        id: 2,
        username: 'admin',
        password: '123456',
        phone: '13800138000',
        roles: [{ roleId: 1, roleName: '普通管理员', roleCode: 'R_ADMIN' }],
        gender: 1,
        token: 'admin-token'
    },
    {   
        id: 3,
        username: 'user',
        password: '123456',
        gender: 0,
        phone: '13800138000',
        roles: [{ roleId: 2, roleName: '普通用户', roleCode: 'R_USER' }],
        token: 'user-token'
    },
    {   
        id: 4,
        username: 'finance',
        password: '123456',
        gender: 1,
        phone: '13800138000',
        roles: [{ roleId: 3, roleName: '财务', roleCode: 'R_FINANCE' }],
        token: 'finance-token'
    }
]

// 生成随机用户数据
let userData = Array.from({ length: 10000 }, (_, i) => ({
    id: i + 5, 
    username: Mock.mock('@cname'),
    password: Mock.mock('@string("lower", 8)'),
    phone: Mock.mock(/^1[3-9]\d{9}$/),
    gender: Mock.mock('@integer(0, 1)'),
    roles: getRandomRoles(),
}))

// 合并所有用户数据（可变数组）
let allUsers = [...users, ...userData]

Mock.setup({ timeout: '300-600' })

// 1. 拦截登录请求
Mock.mock(/\/api\/auth\/login/, 'post', (options) => {
    const { username, password } = JSON.parse(options.body)
    const user = allUsers.find(item => item.username === username && item.password === password)

    if (user) {
        // 从roleListData中获取最新的角色权限
        const permissions = []
        user.roles.forEach(userRole => {
            const role = roleListData.find(r => r.roleCode === userRole.roleCode)
            if (role && role.permissions) {
                permissions.push(...role.permissions)
            }
        })
        // 去重
        const uniquePermissions = [...new Set(permissions)]
        
        return {
            code: 200,
            message: '登陆成功',
            data: {
                token: user.token,
                username: user.username,
                permissions: uniquePermissions
            }
        }
    } else {
        return { code: 401, message: '用户名或密码错误' }
    }
})

// 2. 拦截用户列表请求 (带分页、搜索、排序)
Mock.mock(/\/api\/user\/list/, 'get', (options) => {
    const url = new URL(options.url, window.location.origin)
    const page = parseInt(url.searchParams.get('page') || 1)
    const pageSize = parseInt(url.searchParams.get('pageSize') || 20)
    const sortBy = url.searchParams.get('sortBy')
    const sortOrder = url.searchParams.get('sortOrder')
    const username = url.searchParams.get('username')
    const phone = url.searchParams.get('phone')
    const role = url.searchParams.get('role') // 这里假设搜索的是角色名

    // 过滤
    let filteredList = allUsers.filter(user => {
        const matchName = !username || user.username.includes(username)
        const matchPhone = !phone || user.phone.includes(phone)
        const matchRole = !role || user.roles.some(r => r.roleName && r.roleName.includes(role))
        return matchName && matchPhone && matchRole
    })

    // 排序
    if (sortBy && sortOrder && filteredList.length > 0) {
        filteredList.sort((a, b) => {
            let valA = a[sortBy]
            let valB = b[sortBy]
            if (sortOrder === 'ascending') {
                return valA > valB ? 1 : -1
            } else {
                return valA < valB ? 1 : -1
            }
        })
    }

    // 分页
    const start = (page - 1) * pageSize
    const end = start + pageSize
    const pageData = filteredList.slice(start, end)

    return {
        code: 200,
        message: '获取成功',
        data: {
            list: pageData,
            total: filteredList.length
        }
    }
})




// 权限编码到中文名称的映射
const permissionNameMap = {
    'dashboard:view': '查看仪表盘',
    'template:view': '查看模板中心',
    'system:view': '查看系统管理',
    'user:view': '查看用户管理',
    'user:create': '创建用户',
    'user:edit': '编辑用户',
    'user:delete': '删除用户',
    'role:view': '查看角色管理',
    'role:manage': '管理角色'
}

// 获取 权限列表
Mock.mock(/\/api\/permission\/list/, 'get', () => {
    // 把映射对象转成 [ {label, value} ] 格式
    const list = Object.entries(permissionNameMap).map(([value, label]) => ({
      permissionId: value,  // 权限标识作为 value
      permissionName: label // 中文作为 label
    }))
  
    return {
      code: 200,
      data: { list }
    }
})



// 创建可变的角色数据列表
let roleListData = rolePool.map(role => ({
    roleId: role.roleId,
    roleName: role.roleName,
    roleCode: role.roleCode,
    permissions: rolePermissionsMap[role.roleCode] || [],
    status: 1
}))

// 获取角色列表接口
Mock.mock(/\/api\/role\/list/, 'get', () => {
    const displayList = roleListData.map(role => ({
        ...role,
        permissions: role.permissions, // 权限码，用于编辑回显
        permissionTexts: role.permissions.map(p => permissionNameMap[p] || p) // 中文，用于表格显示
    }))
    return {
        code: 200,
        message: '获取成功',
        data: {
            list: displayList,
            total: displayList.length
        }
    }
})

//添加角色
Mock.mock(/\/api\/role\/add/, 'post', (options) => {
    const body = JSON.parse(options.body)
    const maxId = roleListData.length > 0 ? Math.max(...roleListData.map(item => item.roleId)) : 0
  
    const newRole = {
      roleId: maxId + 1,
      roleName: body.roleName,
      roleCode: body.roleCode,
      permissions: body.permissions || [],
      status: body.status ?? 1
    }
  
    roleListData.push(newRole)
    return { code: 200, message: '添加成功' }
})

  //编辑角色
  Mock.mock(/\/api\/role\/update/, 'post', (options) => {
    const body = JSON.parse(options.body)
    const index = roleListData.findIndex(item => item.roleId === body.roleId)
  
    if (index !== -1) {
      roleListData[index] = { ...roleListData[index], ...body }
      return { code: 200, message: '修改成功' }
    }
    return { code: 500, message: '角色不存在' }
  })
// 删除角色接口
Mock.mock(/\/api\/role\/delete/, 'post', (options) => {
    const { roleId } = JSON.parse(options.body)
    const index = roleListData.findIndex(r => r.roleId === roleId)
    if (index !== -1) {
        roleListData.splice(index, 1)
        return { code: 200, message: '删除成功' }
    }
    return { code: 404, message: '角色不存在' }
})

// 3. 拦截添加用户请求
Mock.mock(/\/api\/user\/adduser/, 'post', (options) => {
    const userData = JSON.parse(options.body)
    
    // 生成新的用户ID（最大ID + 1）
    const maxId = Math.max(...allUsers.map(user => user.id))
    const newId = maxId + 1
    
    // 转换角色ID数组为角色对象数组
    let roles = []
    if (userData.role && Array.isArray(userData.role)) {
        roles = userData.role.map(roleId => {
            return roleListData.find(role => role.roleId == roleId)
        }).filter(Boolean)
    }
    
    // 创建新用户
    const newUser = {
        id: newId,
        username: userData.username,
        password: userData.password,
        phone: userData.phone,
        gender: userData.gender || 1,
        roles: roles,
        token: `${userData.username}-token`
    }
    
    // 添加到用户数组
    allUsers.push(newUser)
    
    return {
        code: 200,
        message: '添加成功',
        data: newUser
    }
})

// 4. 拦截更新用户请求
Mock.mock(/\/api\/user\/update/, 'post', (options) => {
    const userData = JSON.parse(options.body)
    const userId = userData.id
    
    // 查找用户
    const userIndex = allUsers.findIndex(user => user.id === userId)
    if (userIndex === -1) {
        return { code: 404, message: '用户不存在' }
    }
    
    // 转换角色ID数组为角色对象数组
    let roles = []
    if (userData.role && Array.isArray(userData.role)) {
        roles = userData.role.map(roleId => {
            return roleListData.find(role => role.roleId == roleId)
        }).filter(Boolean)
    }
    
    // 更新用户信息
    allUsers[userIndex] = {
        ...allUsers[userIndex],
        username: userData.username,
        password: userData.password,
        phone: userData.phone,
        gender: userData.gender || 1,
        roles: roles
    }
    
    return {
        code: 200,
        message: '更新成功',
        data: allUsers[userIndex]
    }
})

// 5. 拦截删除用户请求
Mock.mock(/\/api\/user\/deluser/, 'post', (options) => {
    const { id } = JSON.parse(options.body)
    
    // 查找用户
    const userIndex = allUsers.findIndex(user => user.id === id)
    if (userIndex === -1) {
        return { code: 404, message: '用户不存在' }
    }
    
    // 删除用户
    allUsers.splice(userIndex, 1)
    
    return {
        code: 200,
        message: '删除成功'
    }
})