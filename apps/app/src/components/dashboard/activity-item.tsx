import { Avatar } from '@amy/ui'
import { Clock } from 'lucide-react'

interface ActivityItemProps {
  id: string
  action: string
  candidateName: string
  timestamp: string
}

export function ActivityItem({ action, candidateName, timestamp }: ActivityItemProps) {
  return (
    <div className="flex items-center space-x-4 p-3 rounded-lg hover:bg-muted transition-colors">
      <Avatar name={candidateName} size="md" />
      <div className="flex-1">
        <p className="text-sm font-medium">{action}</p>
        <p className="text-xs text-muted-foreground">
          {candidateName} • {new Date(timestamp).toLocaleDateString()}
        </p>
      </div>
      <Clock className="h-4 w-4 text-muted-foreground" />
    </div>
  )
}
