'use client';

import { Task } from '@/types';

interface TaskListProps {
  tasks: Task[];
  onUpdate: (id: number, data: Partial<Task>) => void;
  onDelete: (id: number) => void;
}

export default function TaskList({ tasks, onUpdate, onDelete }: TaskListProps) {
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ul className="divide-y divide-gray-200">
        {tasks.map((task) => (
          <li key={task.id} className="px-4 py-4 sm:px-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-indigo-600 truncate">{task.title}</p>
              <div className="ml-2 flex-shrink-0 flex">
                <button
                  onClick={() => onUpdate(task.id, task)}
                  className="px-2 py-1 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(task.id)}
                  className="ml-2 px-2 py-1 text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded-md"
                >
                  Delete
                </button>
              </div>
            </div>
            <div className="mt-2 sm:flex sm:justify-between">
              <div className="sm:flex">
                <p className="flex items-center text-sm text-gray-500">
                  {task.description}
                </p>
              </div>
              <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                <span className="mr-4">Priority: {task.priority}</span>
                <span>Status: {task.status}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
