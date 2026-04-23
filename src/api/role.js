// api/role.js
import request from '@/utils/request'

// 获取所有角色
export function getRoles(params) {
  return request({
    url: '/api/role/list',
    method: 'get',
    params
  })
}

// 新增角色
export function createRole(data) {
  return request({
    url: '/api/role/create',
    method: 'post',
    data
  })
}

// 更新角色
export function updateRole(id, data) {
  return request({
    url: '/api/role/update',
    method: 'post',
    data: { ...data, roleId: id }
  })
}

// 删除角色
export function deleteRole(id) {
  return request({
    url: '/api/role/delete',
    method: 'post',
    data: { roleId: id }
  })
}

// 获取角色的权限
export function getRolePermissions(id) {
  return request({
    url: `/api/roles/${id}/permissions`,
    method: 'get'
  })
}

// 分配权限给角色
export function assignPermissions(id, permissions) {
  return request({
    url: `/api/roles/${id}/permissions`,
    method: 'put',
    data: { permissions }
  })
}


export function getPermissions() {
  return request({
    url: '/api/permission/list',
    method: 'get'
  })
}
