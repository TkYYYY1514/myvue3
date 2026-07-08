import Mock from 'mockjs'
import { rolePool } from '../config'
import { rolePermissionsMap } from '../config'

// 生成随机角色
function getRandomRoles() {
    const count = Math.floor(Math.random() * 2) + 1
    const shuffled = [...rolePool].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, count)
}

// 固定管理员账号
const fixedUsers = [
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

// 随机生成的10000个用户
const randomUsers = Array.from({ length: 10000 }, (_, i) => ({
    id: i + 5,
    username: Mock.mock('@cname'),
    password: Mock.mock('@string("lower", 8)'),
    phone: Mock.mock(/^1[3-9]\d{9}$/),
    gender: Mock.mock('@integer(0, 1)'),
    roles: getRandomRoles(),
}))

// 所有用户数据
export let allUsers = [...fixedUsers, ...randomUsers]

// 角色列表数据
export let roleListData = rolePool.map(role => ({
    roleId: role.roleId,
    roleName: role.roleName,
    roleCode: role.roleCode,
    permissions: rolePermissionsMap[role.roleCode] || [],
    status: 1
}))