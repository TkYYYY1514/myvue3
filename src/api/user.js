import axios from 'axios';

// 获取用户列表
export const getUserList = async (params) => {
  const res = await axios.get('/api/user/list', { params });
  return res.data;
};

// 添加用户
export const addUser = async (data) => {
  const res = await axios.post('/api/user/adduser', data);
  return res.data;
};

// 更新用户
export const updateUser = async (data) => {
  const res = await axios.post('/api/user/update', data);
  return res.data;
};

// 删除用户
export const deleteUser = async (id) => {
  const res = await axios.post('/api/user/deluser', { id });
  return res.data;
};
