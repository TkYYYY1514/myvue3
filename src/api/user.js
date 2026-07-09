// src/api/user.js
import request from '@/utils/request'

// 获取用户列表
export const getUserList = (params) => {
  return request({
    url: '/api/user/list',
    method: 'get',
    params
  })
}

// 添加用户
export const addUser = (data) => {
  return request({
    url: '/api/user/adduser',
    method: 'post',
    data
  })
}

// 更新用户
export const updateUser = (data) => {
  return request({
    url: '/api/user/update',
    method: 'post',
    data
  })
}

// 删除用户
export const deleteUser = (id) => {
  return request({
    url: '/api/user/deluser',
    method: 'post',
    data: { id }
  })
}