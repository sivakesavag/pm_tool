import {
  ChartBarIcon,
  ClockIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline'

const stats = [
  {
    name: 'Active Projects',
    value: '12',
    icon: ChartBarIcon,
    change: '+2',
    changeType: 'increase',
  },
  {
    name: 'Team Members',
    value: '24',
    icon: UserGroupIcon,
    change: '+4',
    changeType: 'increase',
  },
  {
    name: 'Avg. Completion Time',
    value: '14d',
    icon: ClockIcon,
    change: '-2',
    changeType: 'decrease',
  },
]

export default function ProjectStats() {
  return (
    <>
      {stats.map((stat) => (
        <div key={stat.name} className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <stat.icon
                className="h-6 w-6 text-gray-400"
                aria-hidden="true"
              />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">{stat.name}</p>
              <div className="flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900">
                  {stat.value}
                </p>
                <p
                  className={`ml-2 flex items-baseline text-sm font-semibold ${
                    stat.changeType === 'increase'
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {stat.change}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  )
}
