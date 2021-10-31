import axios from 'axios';

// 创建实例
const service = axios.create({
    baseURL: '',
    timeout:5000
});

// 添加请求拦截器
service.interceptors.request.use(config => {
    let token = window.sessionStorage.getItem('token');
    if (token) {
        config.headers["Authorization"] = token;
    }
    return config;
}, err => {
    // message.error(err);
    return Promise.reject(err);
});

// 响应拦截器
service.interceptors.response.use(response => {
    let res = response.data;
    if (res.code !== 200) {
        return Promise.reject('error');
    } else {
        return res.data;
    }
}, err => {
    // message.error(err);
    return Promise.reject(err);
});

export default service;
