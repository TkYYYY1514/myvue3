import Mock from 'mockjs'
import { allUsers, roleListData } from '../data'

// 登录
Mock.mock(/\/api\/auth\/login/, 'post', (options) => {
    const { username, password } = JSON.parse(options.body)
    const user = allUsers.find(item => item.username === username && item.password === password)

    if (user) {
        const permissions = []
        user.roles.forEach(userRole => {
            const role = roleListData.find(r => r.roleCode === userRole.roleCode)
            if (role && role.permissions) {
                permissions.push(...role.permissions)
            }
        })
        return {
            code: 200,
            message: '登陆成功',
            data: {
                token: user.token,
                username: user.username,
                permissions: [...new Set(permissions)]
            }
        }
    }
    return { code: 401, message: '用户名或密码错误' }
})

// 用户列表
Mock.mock(/\/api\/user\/list/, 'get', (options) => {
    const url = new URL(options.url, window.location.origin)
    const page = parseInt(url.searchParams.get('page') || 1)
    const pageSize = parseInt(url.searchParams.get('pageSize') || 20)
    const username = url.searchParams.get('username')
    const phone = url.searchParams.get('phone')
    const role = url.searchParams.get('role')

    let filteredList = allUsers.filter(user => {
        const matchName = !username || user.username.includes(username)
        const matchPhone = !phone || user.phone.includes(phone)
        const matchRole = !role || user.roles.some(r => r.roleName && r.roleName.includes(role))
        return matchName && matchPhone && matchRole
    })

    const start = (page - 1) * pageSize
    const pageData = filteredList.slice(start, start + pageSize)

    return {
        code: 200,
        message: '获取成功',
        data: {
            list: pageData,
            total: filteredList.length
        }
    }
})

// 添加用户
Mock.mock(/\/api\/user\/adduser/, 'post', (options) => {
    const userData = JSON.parse(options.body)
    const maxId = Math.max(...allUsers.map(user => user.id))
    
    const roles = userData.role?.map(roleId => 
        roleListData.find(role => role.roleId == roleId)
    ).filter(Boolean) || []

    const newUser = {
        id: maxId + 1,
        username: userData.username,
        password: userData.password,
        phone: userData.phone,
        gender: userData.gender || 1,
        roles,
        token: `${userData.username}-token`
    }

    allUsers.push(newUser)
    return { code: 200, message: '添加成功', data: newUser }
})

// 更新用户
Mock.mock(/\/api\/user\/update/, 'post', (options) => {
    const userData = JSON.parse(options.body)
    const index = allUsers.findIndex(user => user.id === userData.id)
    
    if (index === -1) return { code: 404, message: '用户不存在' }

    const roles = userData.role?.map(roleId => 
        roleListData.find(role => role.roleId == roleId)
    ).filter(Boolean) || []

    allUsers[index] = {
        ...allUsers[index],
        username: userData.username,
        password: userData.password,
        phone: userData.phone,
        gender: userData.gender || 1,
        roles
    }

    return { code: 200, message: '更新成功', data: allUsers[index] }
})

// 删除用户
Mock.mock(/\/api\/user\/deluser/, 'post', (options) => {
    const { id } = JSON.parse(options.body)
    const index = allUsers.findIndex(user => user.id === id)
    
    if (index === -1) return { code: 404, message: '用户不存在' }
    
    allUsers.splice(index, 1)
    return { code: 200, message: '删除成功' }
})