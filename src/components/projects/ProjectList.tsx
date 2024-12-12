'use client';

import { Project } from '@/types';

interface ProjectListProps {
  projects: Project[];
  onUpdate: (id: number, data: Partial<Project>) => void;
  onDelete: (id: number) => void;
}

export default function ProjectList({ projects, onUpdate, onDelete }: ProjectListProps) {
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ul className="divide-y divide-gray-200">
        {projects.map((project) => (
          <li key={project.id} className="px-4 py-4 sm:px-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-indigo-600 truncate">{project.name}</p>
              <div className="ml-2 flex-shrink-0 flex">
                <button
                  onClick={() => onUpdate(project.id, project)}
                  className="px-2 py-1 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(project.id)}
                  className="ml-2 px-2 py-1 text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded-md"
                >
                  Delete
                </button>
              </div>
            </div>
            <div className="mt-2 sm:flex sm:justify-between">
              <div className="sm:flex">
                <p className="flex items-center text-sm text-gray-500">
                  {project.description}
                </p>
              </div>
              <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                <span className="mr-4">Priority: {project.priority_level}</span>
                <span>Status: {project.status}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
