import axios from 'axios';

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
});

// Interceptor to add auth token
api.interceptors.request.use((config) => {
    try {
        const authData = localStorage.getItem('rh-legal-auth');
        if (authData) {
            const parsed = JSON.parse(authData);
            const token = parsed.state?.token;
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
    } catch (error) {
        console.error('Erro ao recuperar token do localStorage:', error);
    }
    return config;
});

// Interceptor to handle global errors (like 401 Unauthorized)
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            // Clear storage if unauthorized
            localStorage.removeItem('rh-legal-auth');
            window.dispatchEvent(new Event('auth:unauthorized'));
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);
