import axios from 'axios';
import { ElMessage } from 'element-plus';

//const BASE_URL = import.meta.env.VITE_API_URL;
const BASE_URL = 'http://113.44.170.52:8080';

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
        
        // 添加ngrok绕过头部
        config.headers['ngrok-skip-browser-warning'] = 'true';
        
        return config;
    },
    (error) => Promise.reject(error)
);

// 响应拦截器
api.interceptors.response.use(
    (response) => {
        // 直接返回响应数据，由调用方处理具体业务逻辑
        return response.data;
    },
    (error) => {
        const { response } = error;
        // 如果请求被取消，不显示错误信息
        if (axios.isCancel(error)) {
            return Promise.reject(error);
        }
        
        if (response) {
            // 400 错误由具体业务处理，不在拦截器中统一处理
            if (response.status === 401) {
                ElMessage.error('未授权，请重新登录');
            } else if (response.status === 404) {
                ElMessage.error('资源不存在');
            } else if (response.status >= 500) {
                ElMessage.error('服务器内部错误，请稍后重试');
            }
            // 其他状态码由具体业务处理
            return Promise.reject(response.data || error);
        } else {
            ElMessage.error('网络连接失败');
        }
        return Promise.reject(error);
    }
);

export default api;