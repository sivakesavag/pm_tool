import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const authApi = {
  async login(username: string, password: string) {
    try {
      const response = await axios.post(`${API_URL}/api/token/`, {
        username,
        password,
      });
      
      if (response.data.access) {
        localStorage.setItem('token', response.data.access);
        localStorage.setItem('refreshToken', response.data.refresh);
      }
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async refreshToken() {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) throw new Error('No refresh token found');

    try {
      const response = await axios.post(`${API_URL}/api/token/refresh/`, {
        refresh: refreshToken,
      });
      
      if (response.data.access) {
        localStorage.setItem('token', response.data.access);
      }
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  },

  getToken() {
    return localStorage.getItem('token');
  },
};

// Axios interceptor for token refresh
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await authApi.refreshToken();
        originalRequest.headers['Authorization'] = `Bearer ${authApi.getToken()}`;
        return axios(originalRequest);
      } catch (refreshError) {
        authApi.logout();
        window.location.href = '/signin';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
