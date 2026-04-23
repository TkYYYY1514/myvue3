import request from '@/utils/request'

export function login(data) {
    return request({
        url: '/api/auth/login',
        method: 'post',
        data
    })
}

export function getUserInfo() {
    return request({
      url: '/api/user/info',
      method: 'get'
    })
  }
  
  export function logout() {
    return request({
      url: '/api/auth/logout',
      method: 'post'
    })
  }


export function adduser(data){
    return request({
        url:'/api/user/adduser',
        method:'post',
        data
    })
}

export function update(data){
  return request({
      url:'/api/user/update',
      method:'post',
      data
  })
}

export function deluser(data){
  return request({
      url:'/api/user/deluser',
      method:'post',
      data
  })
}
