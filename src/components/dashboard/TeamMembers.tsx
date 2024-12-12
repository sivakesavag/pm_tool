const team = [
  {
    id: 1,
    name: 'John Doe',
    role: 'Project Manager',
    status: 'Available',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    id: 2,
    name: 'Jane Smith',
    role: 'Developer',
    status: 'In Meeting',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    id: 3,
    name: 'Mike Johnson',
    role: 'Designer',
    status: 'Away',
    avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
]

const statusColors = {
  Available: 'text-green-700 bg-green-50',
  'In Meeting': 'text-yellow-700 bg-yellow-50',
  Away: 'text-gray-700 bg-gray-50',
}

export default function TeamMembers() {
  return (
    <div className="overflow-hidden">
      <ul role="list" className="space-y-4">
        {team.map((member) => (
          <li
            key={member.id}
            className="bg-white px-4 py-3 shadow-sm rounded-lg border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img
                  className="h-10 w-10 rounded-full"
                  src={member.avatar}
                  alt={member.name}
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">{member.name}</p>
                  <p className="text-sm text-gray-500">{member.role}</p>
                </div>
              </div>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  statusColors[member.status as keyof typeof statusColors]
                }`}
              >
                {member.status}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
