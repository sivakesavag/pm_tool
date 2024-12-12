const tasks = [
  {
    id: 1,
    title: 'Design System Implementation',
    status: 'In Progress',
    priority: 'High',
    assignee: {
      name: 'John Doe',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
  },
  {
    id: 2,
    title: 'API Integration',
    status: 'Todo',
    priority: 'Medium',
    assignee: {
      name: 'Jane Smith',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
  },
  {
    id: 3,
    title: 'User Testing',
    status: 'Completed',
    priority: 'Low',
    assignee: {
      name: 'Mike Johnson',
      avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
  },
]

const priorityColors = {
  High: 'text-red-700 bg-red-50',
  Medium: 'text-yellow-700 bg-yellow-50',
  Low: 'text-green-700 bg-green-50',
}

const statusColors = {
  'In Progress': 'text-blue-700 bg-blue-50',
  Todo: 'text-gray-700 bg-gray-50',
  Completed: 'text-green-700 bg-green-50',
}

export default function TasksList() {
  return (
    <div className="overflow-hidden">
      <ul role="list" className="space-y-4">
        {tasks.map((task) => (
          <li
            key={task.id}
            className="bg-white px-4 py-3 shadow-sm rounded-lg border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img
                  className="h-8 w-8 rounded-full"
                  src={task.assignee.avatar}
                  alt={task.assignee.name}
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">{task.title}</p>
                  <p className="text-sm text-gray-500">{task.assignee.name}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityColors[task.priority as keyof typeof priorityColors]}`}
                >
                  {task.priority}
                </span>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[task.status as keyof typeof statusColors]}`}
                >
                  {task.status}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
