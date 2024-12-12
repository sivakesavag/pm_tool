import { create } from 'zustand';
import { projectsApi } from '@/lib/api';

interface Project {
  id: number;
  name: string;
  description: string;
  status: string;
  health_indicator: string;
  priority_level: number;
  start_date: string;
  end_date: string;
}

interface ProjectState {
  projects: Project[];
  selectedProject: Project | null;
  isLoading: boolean;
  error: string | null;
  fetchProjects: () => Promise<void>;
  selectProject: (project: Project) => void;
  createProject: (data: Partial<Project>) => Promise<void>;
  updateProject: (id: number, data: Partial<Project>) => Promise<void>;
  deleteProject: (id: number) => Promise<void>;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [],
  selectedProject: null,
  isLoading: false,
  error: null,

  fetchProjects: async () => {
    try {
      set({ isLoading: true, error: null });
      const projects = await projectsApi.getAll();
      set({ projects, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch projects', isLoading: false });
    }
  },

  selectProject: (project) => {
    set({ selectedProject: project });
  },

  createProject: async (data) => {
    try {
      set({ isLoading: true, error: null });
      const newProject = await projectsApi.create(data);
      set((state) => ({
        projects: [...state.projects, newProject],
        isLoading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to create project', isLoading: false });
    }
  },

  updateProject: async (id, data) => {
    try {
      set({ isLoading: true, error: null });
      const updatedProject = await projectsApi.update(id, data);
      set((state) => ({
        projects: state.projects.map((p) =>
          p.id === id ? { ...p, ...updatedProject } : p
        ),
        selectedProject:
          state.selectedProject?.id === id
            ? { ...state.selectedProject, ...updatedProject }
            : state.selectedProject,
        isLoading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to update project', isLoading: false });
    }
  },

  deleteProject: async (id) => {
    try {
      set({ isLoading: true, error: null });
      await projectsApi.delete(id);
      set((state) => ({
        projects: state.projects.filter((p) => p.id !== id),
        selectedProject:
          state.selectedProject?.id === id ? null : state.selectedProject,
        isLoading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to delete project', isLoading: false });
    }
  },
}));
