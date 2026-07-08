import Mock from 'mockjs'
import { roleListData } from '../data'
import { permissionNameMap } from '../config'

// 权限列表
Mock.mock(/\/api\/permission\/list/, 'get', () => {
    const list = Object.entries(permissionNameMap).map(([value, label]) => ({
        permissionId: value,
        permissionName: label
    }))
    return { code: 200, data: { list } }
})

// 角色列表
Mock.mock(/\/api\/role\/list/, 'get', () => {
    const list = roleListData.map(role => ({
        ...role,
        permissionTexts: role.permissions.map(p => permissionNameMap[p] || p)
    }))
    return { code: 200, message: '获取成功', data: { list, total: list.length } }
})

// 添加角色
Mock.mock(/\/api\/role\/add/, 'post', (options) => {
    const body = JSON.parse(options.body)
    const maxId = Math.max(...roleListData.map(item => item.roleId), 0)
    
    roleListData.push({
        roleId: maxId + 1,
        roleName: body.roleName,
        roleCode: body.roleCode,
        permissions: body.permissions || [],
        status: body.status ?? 1
    })
    return { code: 200, message: '添加成功' }
})

// 编辑角色
Mock.mock(/\/api\/role\/update/, 'post', (options) => {
    const body = JSON.parse(options.body)
    const index = roleListData.findIndex(item => item.roleId === body.roleId)
    
    if (index === -1) return { code: 500, message: '角色不存在' }
    
    roleListData[index] = { ...roleListData[index], ...body }
    return { code: 200, message: '修改成功' }
})

// 删除角色
Mock.mock(/\/api\/role\/delete/, 'post', (options) => {
    const { roleId } = JSON.parse(options.body)
    const index = roleListData.findIndex(r => r.roleId === roleId)
    
    if (index === -1) return { code: 404, message: '角色不存在' }
    
    roleListData.splice(index, 1)
    return { code: 200, message: '删除成功' }
})