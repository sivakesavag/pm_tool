import axios from 'axios';
import { authApi } from './auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const getHeaders = () => ({
  Authorization: `Bearer ${authApi.getToken()}`,
});

export const tasksApi = {
  async getAll() {
    try {
      const response = await axios.get(`${API_URL}/tasks/`, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async get(id: number) {
    try {
      const response = await axios.get(`${API_URL}/tasks/${id}/`, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async create(data: any) {
    try {
      const response = await axios.post(`${API_URL}/tasks/`, data, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async update(id: number, data: any) {
    try {
      const response = await axios.patch(`${API_URL}/tasks/${id}/`, data, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async delete(id: number) {
    try {
      await axios.delete(`${API_URL}/tasks/${id}/`, {
        headers: getHeaders(),
      });
    } catch (error) {
      throw error;
    }
  },

  async assign(id: number, userIds: number[]) {
    try {
      const response = await axios.post(
        `${API_URL}/tasks/${id}/assign/`,
        { user_ids: userIds },
        { headers: getHeaders() }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getSuggestedAssignees(id: number) {
    try {
      const response = await axios.get(`${API_URL}/tasks/${id}/suggest_assignees/`, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getComments(id: number) {
    try {
      const response = await axios.get(`${API_URL}/tasks/${id}/comments/`, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async addComment(id: number, content: string) {
    try {
      const response = await axios.post(
        `${API_URL}/comments/`,
        { task: id, content },
        { headers: getHeaders() }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
