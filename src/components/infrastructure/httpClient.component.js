import axios from 'axios';
import { API_URL } from '../../config/env';

export default function httpClient() {
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
        },
        baseURL: API_URL,
        timeout: 30000
    };

    axios.interceptors.response.use(function (response) {
        return response
    }, function (e) {
        if (e && e.response && e.response.status === 401) 
            localStorage.removeItem('token');
        
        return Promise.reject(e?.response?.data)
    });

    return {
        get: (url, options = {}) => axios.get(url, { ...defaultOptions, ...options }),
        post: (url, data, options = {}) => axios.post(url, data, { ...defaultOptions, ...options }),
        put: (url, data, options = {}) => axios.put(url, data, { ...defaultOptions, ...options }),
        delete: (url, options = {}) => axios.delete(url, { ...defaultOptions, ...options }),
    };
};