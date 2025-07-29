import axios from 'axios';
import AxiosHeaders from '../services/AxiosHeaders'; 

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3030',
  
});

axiosInstance.interceptors.request.use((config) => {
    config.headers = { 
      ...config.headers,
      ...AxiosHeaders()
   };  
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default axiosInstance;
