'use client';

import { useEffect } from 'react';
import { useProjectStore } from '@/store/projectStore';
import ProjectList from '@/components/projects/ProjectList';
import ProjectForm from '@/components/projects/ProjectForm';

export default function ProjectsPage() {
  const { fetchProjects, projects, createProject, updateProject, deleteProject } = useProjectStore();

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Projects</h1>
        <ProjectForm onSubmit={createProject} />
      </div>
      <ProjectList
        projects={projects}
        onUpdate={updateProject}
        onDelete={deleteProject}
      />
    </div>
  );
}
