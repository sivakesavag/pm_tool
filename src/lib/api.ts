import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Handle token refresh or logout
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: async (email: string, password: string) => {
    const response = await api.post('/token/', { email, password });
    return response.data;
  },
  refreshToken: async (refresh: string) => {
    const response = await api.post('/token/refresh/', { refresh });
    return response.data;
  },
};

export const projectsApi = {
  getAll: async () => {
    const response = await api.get('/projects/');
    return response.data;
  },
  getById: async (id: number) => {
    const response = await api.get(`/projects/${id}/`);
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post('/projects/', data);
    return response.data;
  },
  update: async (id: number, data: any) => {
    const response = await api.put(`/projects/${id}/`, data);
    return response.data;
  },
  delete: async (id: number) => {
    await api.delete(`/projects/${id}/`);
  },
  getPrediction: async (id: number) => {
    const response = await api.get(`/projects/${id}/predict_completion/`);
    return response.data;
  },
  getResourceAnalysis: async (id: number) => {
    const response = await api.get(`/projects/${id}/resource_analysis/`);
    return response.data;
  },
};

export const tasksApi = {
  getAll: async () => {
    const response = await api.get('/tasks/');
    return response.data;
  },
  getById: async (id: number) => {
    const response = await api.get(`/tasks/${id}/`);
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post('/tasks/', data);
    return response.data;
  },
  update: async (id: number, data: any) => {
    const response = await api.put(`/tasks/${id}/`, data);
    return response.data;
  },
  delete: async (id: number) => {
    await api.delete(`/tasks/${id}/`);
  },
  getSuggestedAssignees: async (id: number) => {
    const response = await api.get(`/tasks/${id}/suggest_assignees/`);
    return response.data;
  },
};

export const usersApi = {
  getAll: async () => {
    const response = await api.get('/users/');
    return response.data;
  },
  getById: async (id: number) => {
    const response = await api.get(`/users/${id}/`);
    return response.data;
  },
  getWorkload: async (id: number) => {
    const response = await api.get(`/users/${id}/workload/`);
    return response.data;
  },
};

export const analyticsApi = {
  getProjectAnalytics: async (projectId: number) => {
    const response = await api.get(`/projects/${projectId}/analytics/`);
    return response.data;
  },
};

export default api;
