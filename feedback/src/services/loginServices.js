import axios from './axiosInstance';

export const loginUser = async ({ username, password }) => {
  const res = await axios.post('/api/login', { username, password });
  return res.data; // token
};
