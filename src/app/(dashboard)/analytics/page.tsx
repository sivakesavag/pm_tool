'use client';

import { useEffect, useState } from 'react';
import { analyticsApi } from '@/lib/api/analytics';
import { Chart } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function AnalyticsPage() {
  const [overallData, setOverallData] = useState<any>(null);
  const [teamPerformance, setTeamPerformance] = useState<any>(null);
  const [resourceAllocation, setResourceAllocation] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [overall, team, resource] = await Promise.all([
          analyticsApi.getOverallAnalytics(),
          analyticsApi.getTeamPerformance(),
          analyticsApi.getResourceAllocation(),
        ]);

        setOverallData(overall);
        setTeamPerformance(team);
        setResourceAllocation(resource);
      } catch (error) {
        console.error('Failed to fetch analytics data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Analytics Dashboard</h1>
      </div>

      {/* Overall Project Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Projects Overview</h3>
          {overallData && (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Total Projects</p>
                <p className="text-2xl font-semibold">{overallData.total_projects}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Active Projects</p>
                <p className="text-2xl font-semibold text-green-600">
                  {overallData.active_projects}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Delayed Projects</p>
                <p className="text-2xl font-semibold text-red-600">
                  {overallData.delayed_projects}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Team Performance */}
        <div className="bg-white p-6 rounded-lg shadow md:col-span-2">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Team Performance</h3>
          {teamPerformance && (
            <div className="h-64">
              <Chart
                type="bar"
                data={{
                  labels: teamPerformance.labels,
                  datasets: [
                    {
                      label: 'Tasks Completed',
                      data: teamPerformance.completed_tasks,
                      backgroundColor: 'rgba(59, 130, 246, 0.5)',
                    },
                    {
                      label: 'On-time Delivery Rate',
                      data: teamPerformance.delivery_rate,
                      backgroundColor: 'rgba(16, 185, 129, 0.5)',
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Resource Allocation */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Resource Allocation</h3>
        {resourceAllocation && (
          <div className="h-64">
            <Chart
              type="doughnut"
              data={{
                labels: resourceAllocation.labels,
                datasets: [
                  {
                    data: resourceAllocation.allocation,
                    backgroundColor: [
                      'rgba(59, 130, 246, 0.5)',
                      'rgba(16, 185, 129, 0.5)',
                      'rgba(244, 63, 94, 0.5)',
                      'rgba(234, 179, 8, 0.5)',
                    ],
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
