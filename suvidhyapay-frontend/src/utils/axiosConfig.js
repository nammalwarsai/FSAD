import axios from 'axios';
import { toast } from 'react-hot-toast';

const api = axios.create({
    baseURL: 'http://localhost:8080',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    timeout: 10000, // 10 second timeout
    withCredentials: true
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        console.log('Making request to:', config.url);
        const userId = localStorage.getItem('userId');
        if (userId) {
            config.headers['X-User-Id'] = userId;
        }
        return config;
    },
    (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => {
        console.log('Response received:', response.config.url, response.status);
        return response;
    },
    (error) => {
        console.error('API Error:', error);
        
        if (error.response) {
            if (error.response.status === 401) {
                localStorage.clear();
                window.location.href = '/login';
                return Promise.reject(error);
            }
            
            const message = error.response.data?.error || 'An error occurred';
            toast.error(message);
        } else if (error.request) {
            console.error('Network Error:', error.request);
            toast.error('Network error - Please check if the backend server is running');
        } else {
            toast.error('An unexpected error occurred');
        }
        
        return Promise.reject(error);
    }
);

export const userApi = {
    register: (userData) => api.post('/api/users/register', userData),
    login: (credentials) => api.post('/api/users/login', credentials),
    getProfile: (id) => api.get(`/api/users/profile/${id}`)
};

export default api;