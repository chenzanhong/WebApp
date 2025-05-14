import axios from 'axios';
import { ElMessage } from 'element-plus';

const BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
});

// 请求拦截器
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        console.log(token)
        if (token) config.headers.Authorization = `${token}`;
        return config;
    },
    (error) => Promise.reject(error)
);

// 响应拦截器
api.interceptors.response.use(
    (response) => {
        const { data } = response;
        // if (data.code !== 200) {
        //     ElMessage.error(data.message || '请求失败');
        //     return Promise.reject(data);
        // }
        return data;
    },
    (error) => {
        const { response } = error;
        if (response) {
            switch (response.status) {
                case 401:
                    ElMessage.error('未授权，请重新登录');
                    break;
                case 404:
                    ElMessage.error('资源不存在');
                    break;
                default:
                    ElMessage.error(`错误码：${response.status}`);
            }
        } else {
            ElMessage.error('网络连接失败');
        }
        return Promise.reject(error);
    }
);

export default api;