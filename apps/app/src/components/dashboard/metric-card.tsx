import { Card, CardContent } from '@amy/ui'
import { LucideIcon } from 'lucide-react'

interface MetricCardProps {
  title: string
  value: number
  icon: LucideIcon
  isLoading?: boolean
}

export function MetricCard({ title, value, icon: Icon, isLoading }: MetricCardProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            {isLoading ? (
              <div className="h-7 w-16 bg-muted rounded animate-pulse" />
            ) : (
              <p className="text-2xl font-bold">{value}</p>
            )}
          </div>
          <Icon className="h-8 w-8 text-rose-600" />
        </div>
      </CardContent>
    </Card>
  )
}
