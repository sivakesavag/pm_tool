import axios from 'axios';
import { authApi } from './auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const getHeaders = () => ({
  Authorization: `Bearer ${authApi.getToken()}`,
});

export const projectsApi = {
  async getAll() {
    try {
      const response = await axios.get(`${API_URL}/projects/`, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async get(id: number) {
    try {
      const response = await axios.get(`${API_URL}/projects/${id}/`, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async create(data: any) {
    try {
      const response = await axios.post(`${API_URL}/projects/`, data, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async update(id: number, data: any) {
    try {
      const response = await axios.patch(`${API_URL}/projects/${id}/`, data, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async delete(id: number) {
    try {
      await axios.delete(`${API_URL}/projects/${id}/`, {
        headers: getHeaders(),
      });
    } catch (error) {
      throw error;
    }
  },

  async getAnalytics(id: number) {
    try {
      const response = await axios.get(`${API_URL}/projects/${id}/analytics/`, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getTimeline(id: number) {
    try {
      const response = await axios.get(`${API_URL}/projects/${id}/timeline/`, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getResourceAnalysis(id: number) {
    try {
      const response = await axios.get(`${API_URL}/projects/${id}/resource_analysis/`, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
