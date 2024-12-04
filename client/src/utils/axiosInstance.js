import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BASE_URL || '/api/v1';

// Create an Axios instance
const axiosInstance = axios.create({ baseURL: BASE_URL });

// Add a request interceptor to include the token in headers
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status >= 400) {
            // Token is invalid or expired, or any of the error response from backend
            localStorage.removeItem('token');
            window.location.href = '/login'; // Redirect to login page
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
