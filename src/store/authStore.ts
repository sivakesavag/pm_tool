import { create } from 'zustand';
import { authApi } from '@/lib/api/auth';
import axios from 'axios';

interface User {
  id: number;
  username: string;
  email: string;
  department: string;
  skills: Record<string, any>;
  availability_status: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  isAuthenticated: typeof window !== 'undefined' ? !!localStorage.getItem('token') : false,
  isLoading: false,
  error: null,

  login: async (username: string, password: string) => {
    try {
      set({ isLoading: true, error: null });
      const data = await authApi.login(username, password);
      
      // Get user data
      const userResponse = await axios.get('http://localhost:8000/users/me/', {
        headers: { Authorization: `Bearer ${data.access}` }
      });

      set({
        user: userResponse.data,
        token: data.access,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.detail || 'Invalid credentials',
        isLoading: false,
      });
    }
  },

  logout: () => {
    authApi.logout();
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },

  clearError: () => {
    set({ error: null });
  },

  checkAuth: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        set({ isAuthenticated: false });
        return;
      }

      // Verify token and get user data
      const userResponse = await axios.get('http://localhost:8000/users/me/', {
        headers: { Authorization: `Bearer ${token}` }
      });

      set({
        user: userResponse.data,
        token,
        isAuthenticated: true,
      });
    } catch (error) {
      set({
        user: null,
        token: null,
        isAuthenticated: false,
      });
    }
  },
}));
