
import { Button, Card, CardContent, CardHeader, CardTitle } from '@amy/ui'
import { useRecruiterMetrics } from '@amy/ui'
import { toast } from 'sonner'
import { BarChart3, ArrowRight } from 'lucide-react'

import { Layout } from '@/components/layout'
import { QuickActionCard } from '@/components/dashboard/quick-action-card'
import { MetricCard } from '@/components/dashboard/metric-card'
import { ActivityItem } from '@/components/dashboard/activity-item'
import { QUICK_ACTIONS, METRICS, NAVIGATION_CARDS } from '@/components/dashboard/dashboard-config'

export function DashboardPage() {
  const metricsQuery = useRecruiterMetrics()
  const metrics = metricsQuery.data

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  const handleUploadCV = () => {
    toast.info('File upload coming soon!')
  }

  const handleCreateJob = () => {
    toast.info('Job creation coming soon!')
  }

  const quickActionsWithHandlers = QUICK_ACTIONS.map(action => {
    if (action.title === 'Upload CV(s)') {
      return { ...action, onClick: handleUploadCV }
    }
    if (action.title === 'New Job') {
      return { ...action, onClick: handleCreateJob }
    }
    return action
  })

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="bg-gradient-to-r from-rose-500 to-rose-600 rounded-2xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2">{getGreeting()}! 👋</h2>
              <p className="text-rose-100 text-lg">
                Here&#39;s what&#39;s happening with your recruitment pipeline today
              </p>
            </div>
            <div className="hidden md:block">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                <BarChart3 className="h-10 w-10 text-white" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActionsWithHandlers.map((action) => (
            <QuickActionCard
              key={action.title}
              title={action.title}
              description={action.description}
              icon={action.icon}
              href={action.href}
              onClick={action.onClick}
              color={action.color}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {METRICS.map((metric) => (
            <MetricCard
              key={metric.key}
              title={metric.title}
              value={metrics?.[metric.key as keyof typeof metrics] as number || 0}
              icon={metric.icon}
              isLoading={metricsQuery.isLoading}
            />
          ))}
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Activity</CardTitle>
              <Button variant="ghost" size="sm" className="text-rose-600 hover:text-rose-700">
                View all
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {metricsQuery.isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center space-x-4 p-3 rounded-lg bg-muted">
                    <div className="h-10 w-10 bg-muted-foreground/20 rounded-full animate-pulse" />
                    <div className="space-y-2 flex-1">
                      <div className="h-4 w-48 bg-muted-foreground/20 rounded animate-pulse" />
                      <div className="h-3 w-24 bg-muted-foreground/20 rounded animate-pulse" />
                    </div>
                  </div>
                ))
              ) : (
                metrics?.recentActivity?.slice(0, 5).map((activity: any) => (
                  <ActivityItem
                    key={activity.id}
                    id={activity.id}
                    action={activity.action}
                    candidateName={activity.candidateName}
                    timestamp={activity.timestamp}
                  />
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {NAVIGATION_CARDS.map((card) => (
            <QuickActionCard
              key={card.title}
              title={card.title}
              description={card.description}
              icon={card.icon}
              href={card.href}
              color={card.color}
            />
          ))}
        </div>
      </div>
    </Layout>
  )
}
