import axios from 'axios';
import { authApi } from './auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const getHeaders = () => ({
  Authorization: `Bearer ${authApi.getToken()}`,
});

export const analyticsApi = {
  async getProjectAnalytics(projectId: number) {
    try {
      const response = await axios.get(`${API_URL}/projects/${projectId}/analytics/`, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getResourceUtilization(projectId: number) {
    try {
      const response = await axios.get(`${API_URL}/projects/${projectId}/resource_analysis/`, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getProjectTimeline(projectId: number) {
    try {
      const response = await axios.get(`${API_URL}/projects/${projectId}/timeline/`, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getProjectPredictions(projectId: number) {
    try {
      const response = await axios.get(`${API_URL}/projects/${projectId}/predict_completion/`, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getOverallAnalytics() {
    try {
      const response = await axios.get(`${API_URL}/analytics/overview/`, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getTeamPerformance() {
    try {
      const response = await axios.get(`${API_URL}/analytics/team-performance/`, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getResourceAllocation() {
    try {
      const response = await axios.get(`${API_URL}/analytics/resource-allocation/`, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
