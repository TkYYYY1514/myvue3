// 角色-权限映射表
export const rolePermissionsMap = {
    R_SUPER: [
        'dashboard:view', 'template:view', 'system:view', 'user:view', 'role:view',
         'DataAnalysis:view',
        'user:create', 'user:update', 'user:delete',
    ],
    R_ADMIN: ['dashboard:view', 'template:view', 'system:view', 'user:view'],
    R_USER: ['dashboard:view', 'template:view'],
    R_FINANCE: ['template:view', 'system:view', 'user:view']
}

// 权限编码到中文名称的映射
export const permissionNameMap = {
    'dashboard:view': '查看仪表盘',
    'template:view': '查看模板中心',
    'system:view': '查看系统管理',
    'user:view': '查看用户管理',
    'DataAnalysis:view': '查看数据分析',
    'user:create': '创建用户',
    'user:update': '编辑用户',
    'user:delete': '删除用户',
    'role:view': '查看角色管理',
    'role:manage': '管理角色'
}

// 角色池
export const rolePool = [
    { roleId: 0, roleName: '超级管理员', roleCode: 'R_SUPER' },
    { roleId: 1, roleName: '普通管理员', roleCode: 'R_ADMIN' },
    { roleId: 2, roleName: '普通用户', roleCode: 'R_USER' },
    { roleId: 3, roleName: '财务', roleCode: 'R_FINANCE' }
]