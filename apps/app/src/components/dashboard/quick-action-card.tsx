import { Link } from '@tanstack/react-router'
import { Card, CardContent } from '@amy/ui'
import { LucideIcon } from 'lucide-react'

interface QuickActionCardProps {
  title: string
  description: string
  icon: LucideIcon
  href?: string
  onClick?: () => void
  color: 'blue' | 'green' | 'purple' | 'orange'
}

const colorClasses = {
  blue: {
    gradient: 'from-blue-500 to-blue-600',
    hover: 'hover:border-blue-200 hover:text-blue-600'
  },
  green: {
    gradient: 'from-green-500 to-green-600',
    hover: 'hover:border-green-200 hover:text-green-600'
  },
  purple: {
    gradient: 'from-purple-500 to-purple-600',
    hover: 'hover:border-purple-200 hover:text-purple-600'
  },
  orange: {
    gradient: 'from-orange-500 to-orange-600',
    hover: 'hover:border-orange-200 hover:text-orange-600'
  }
}

export function QuickActionCard({
  title,
  description,
  icon: Icon,
  href,
  onClick,
  color
}: QuickActionCardProps) {
  const colors = colorClasses[color]

  const cardContent = (
    <Card className={`hover:shadow-lg transition-all duration-200 cursor-pointer group border-2 border-transparent ${colors.hover}`} onClick={onClick}>
      <CardContent className="pt-6">
        <div className="flex items-center space-x-4">
          <div className={`w-10 h-10 bg-gradient-to-br ${colors.gradient} rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform flex-shrink-0`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className={`font-semibold text-slate-900 group-hover:${color === 'blue' ? 'text-blue-600' : color === 'green' ? 'text-green-600' : color === 'purple' ? 'text-purple-600' : 'text-orange-600'} transition-colors`}>{title}</h3>
            <p className="text-xs text-slate-600">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  if (href) {
    return <Link to={href}>{cardContent}</Link>
  }

  return cardContent
}
