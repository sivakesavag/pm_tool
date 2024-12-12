'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import ProjectStats from '@/components/dashboard/ProjectStats';
import TasksList from '@/components/dashboard/TasksList';
import TeamMembers from '@/components/dashboard/TeamMembers';
import { Project, Task, User } from '@/types';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    totalTasks: 0,
    pendingTasks: 0,
    teamMembers: 0,
  });
  const [recentTasks, setRecentTasks] = useState<Task[]>([]);
  const [activeProjects, setActiveProjects] = useState<Project[]>([]);
  const [teamMembers, setTeamMembers] = useState<User[]>([]);

  useEffect(() => {
    // Fetch dashboard data
    const fetchDashboardData = async () => {
      try {
        // TODO: Replace with actual API calls
        // const stats = await api.getDashboardStats();
        // const tasks = await api.getRecentTasks();
        // const projects = await api.getActiveProjects();
        // const members = await api.getTeamMembers();

        setStats({
          totalProjects: 12,
          activeProjects: 8,
          completedProjects: 4,
          totalTasks: 45,
          pendingTasks: 15,
          teamMembers: 8,
        });

        // Mock data for development
        setRecentTasks([
          {
            id: 1,
            title: "Design User Interface",
            status: "In Progress",
            priority: 1,
            project: 1,
            assignees: [],
            progress: 60,
            description: "Create modern UI design for dashboard",
            dependencies: [],
            estimated_hours: 20,
            actual_hours: 15,
            attachments: [],
            custom_fields: {},
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          // Add more mock tasks
        ]);

        setActiveProjects([
          {
            id: 1,
            name: "Project Management Tool",
            description: "Building a comprehensive PM tool",
            status: "Active",
            health_indicator: "Green",
            priority_level: 1,
            start_date: new Date().toISOString(),
            end_date: null,
            team_members: [],
            budget_allocation: 50000,
            client_information: {},
            documentation_links: [],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          // Add more mock projects
        ]);

        setTeamMembers([
          {
            id: 1,
            username: "john.doe",
            email: "john@example.com",
            first_name: "John",
            last_name: "Doe",
            department: "Engineering",
            skills: { "React": 9, "Python": 8 },
            availability_status: "Available",
            working_hours: { "start": "9:00", "end": "17:00" },
            performance_metrics: { "tasks_completed": 45, "on_time": 0.95 }
          },
          // Add more mock team members
        ]);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">
          Welcome back, {user?.first_name || 'User'}!
        </h1>
      </div>

      <ProjectStats
        totalProjects={stats.totalProjects}
        activeProjects={stats.activeProjects}
        completedProjects={stats.completedProjects}
        totalTasks={stats.totalTasks}
        pendingTasks={stats.pendingTasks}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Tasks</h2>
            <TasksList tasks={recentTasks} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Team Members</h2>
            <TeamMembers members={teamMembers} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Active Projects</h2>
          <div className="space-y-4">
            {activeProjects.map((project) => (
              <div
                key={project.id}
                className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-md font-medium text-gray-900">
                    {project.name}
                  </h3>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    project.health_indicator === 'Green'
                      ? 'bg-green-100 text-green-800'
                      : project.health_indicator === 'Yellow'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {project.health_indicator}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">{project.description}</p>
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <span className="mr-4">Priority: {project.priority_level}</span>
                  <span>Status: {project.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
