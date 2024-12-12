import { Suspense } from 'react'
import ProjectStats from '@/components/dashboard/ProjectStats'
import TasksList from '@/components/dashboard/TasksList'
import TeamMembers from '@/components/dashboard/TeamMembers'

export default function Home() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Suspense fallback={<div>Loading stats...</div>}>
          <ProjectStats />
        </Suspense>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Tasks</h2>
          <Suspense fallback={<div>Loading tasks...</div>}>
            <TasksList />
          </Suspense>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Team Members</h2>
          <Suspense fallback={<div>Loading team...</div>}>
            <TeamMembers />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
