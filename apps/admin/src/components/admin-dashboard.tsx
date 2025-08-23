
import { useState, useEffect } from 'react'
import { Button } from '@amy/ui'
import {
  Users,
  Building2,
  UserCheck,
  Settings,
  LogOut,
  BarChart3,
  Shield,
  Database,
  CreditCard,
  Tag,
  ArrowRightLeft,
  History,
  Search,
  Filter
} from 'lucide-react'
import { CompanyManagement } from './CompanyManagement'
import SkillsManagement from './SkillsManagement'
import ImportsManagement from './ImportsManagement'
import { Confirm } from './ui/Confirm'
import { ProtectedRoute } from './auth/ProtectedRoute'
import { toast } from 'sonner'
import { Badge } from './ui/badge'
import { useLogout, useBlockUser, useUnblockUser, useDeleteUser, useAdminOverview, useAdminUsers, useAdminAuditLogs } from '@amy/ui'
import type { AuditLog } from '@amy/ui'

// Configuration objects
const NAVIGATION_ITEMS = [
  { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'companies', label: 'Companies', icon: Building2 },
  { id: 'billing', label: 'Billing & Trials', icon: CreditCard },
  { id: 'skills', label: 'Skills', icon: Tag },
  { id: 'assignments', label: 'Assignments', icon: ArrowRightLeft },
  { id: 'imports', label: 'Imports', icon: Database },
  { id: 'audit', label: 'Audit', icon: History },
  { id: 'settings', label: 'Settings', icon: Settings }
] as const

const METRIC_CARDS = [
  {
    key: 'totalUsers',
    label: 'Total Users',
    icon: Users,
    color: 'text-rose-600'
  },
  {
    key: 'totalCandidates',
    label: 'Total Candidates',
    icon: UserCheck,
    color: 'text-rose-600'
  },
  {
    key: 'totalCompanies',
    label: 'Total Companies',
    icon: Building2,
    color: 'text-rose-600'
  },
  {
    key: 'activeTrials',
    label: 'Active Trials',
    icon: CreditCard,
    color: 'text-rose-600'
  }
] as const

// Reusable components
const MetricCard = ({ 
  label, 
  value, 
  icon: Icon, 
  color, 
  isLoading 
}: {
  label: string
  value: number
  icon: React.ComponentType<{ className?: string }>
  color: string
  isLoading: boolean
}) => (
  <div className="bg-card border rounded-lg p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        {isLoading ? (
          <div className="h-7 w-16 bg-muted rounded animate-pulse" />
        ) : (
          <p className="text-2xl font-bold">{value}</p>
        )}
      </div>
      <Icon className={`h-8 w-8 ${color}`} />
    </div>
  </div>
)

const NavigationItem = ({ 
  item, 
  isActive, 
  onClick 
}: {
  item: typeof NAVIGATION_ITEMS[number]
  isActive: boolean
  onClick: () => void
}) => {
  const Icon = item.icon
  return (
    <button
      onClick={onClick}
      className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
        isActive
          ? 'bg-primary text-primary-foreground'
          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
      }`}
    >
      <Icon className="h-5 w-5" />
      <span>{item.label}</span>
    </button>
  )
}

const AuditLogItem = ({ log }: { log: AuditLog }) => (
  <div className="flex items-center justify-between py-3 border-b last:border-b-0">
    <div className="flex items-center space-x-3">
      <div className="w-2 h-2 bg-primary rounded-full" />
      <div>
        <p className="text-sm font-medium">{log.action}</p>
        <p className="text-xs text-muted-foreground">{log.actor?.name || 'Unknown'}</p>
      </div>
    </div>
    <div className="text-right">
      <p className="text-xs text-muted-foreground">
        {new Date(log.createdAt).toLocaleDateString()}
      </p>
      <Badge variant="secondary" className="text-xs">
        {log.entity || 'Unknown'}
      </Badge>
    </div>
  </div>
)

function AdminDashboardContent() {
  const [activeTab, setActiveTab] = useState('overview')
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean
    title: string
    desc?: string
    onConfirm: () => void
    tone?: 'default' | 'destructive'
  }>({
    open: false,
    title: '',
    onConfirm: () => { }
  })
  
  const logoutMutation = useLogout()
  const blockUserMutation = useBlockUser()
  const unblockUserMutation = useUnblockUser()
  const deleteUserMutation = useDeleteUser()

  const overviewQuery = useAdminOverview()
  const usersQuery = useAdminUsers()
  const auditQuery = useAdminAuditLogs(10)
  const isOverviewLoading = overviewQuery.isLoading
  const isUsersLoading = usersQuery.isLoading

  useEffect(() => {
    setupEventListeners()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const setupEventListeners = () => {
    window.addEventListener('admin:block', handleBlockUser)
    window.addEventListener('admin:unblock', handleUnblockUser)
    window.addEventListener('admin:restrict', handleRestrictUser)
    window.addEventListener('admin:delete', handleDeleteUser)
  }

  const metrics = overviewQuery.data
  const users = usersQuery.data ?? []
  const auditLogs = auditQuery.data ?? []

  const handleSignOut = () => {
    logoutMutation.mutate()
  }

  const handleBlockUser = async (event: globalThis.Event) => {
    const customEvent = event as globalThis.CustomEvent
    const { id } = customEvent.detail
    const user = users.find(u => u.id === id)

    setConfirmDialog({
      open: true,
      title: 'Block User',
      desc: `Are you sure you want to block ${user?.name || user?.email}? They will not be able to access the system.`,
      onConfirm: () => blockUserMutation.mutate({ userId: id }),
      tone: 'destructive'
    })
  }

  const handleUnblockUser = async (event: globalThis.Event) => {
    const customEvent = event as globalThis.CustomEvent
    const { id } = customEvent.detail
    const user = users.find(u => u.id === id)

    setConfirmDialog({
      open: true,
      title: 'Unblock User',
      desc: `Are you sure you want to unblock ${user?.name || user?.email}?`,
      onConfirm: () => unblockUserMutation.mutate({ userId: id })
    })
  }

  const handleRestrictUser = async (_event: globalThis.Event) => {
    toast.info('Restrict user functionality coming soon')
  }

  const handleDeleteUser = async (event: globalThis.Event) => {
    const customEvent = event as globalThis.CustomEvent
    const { id } = customEvent.detail
    const user = users.find(u => u.id === id)

    setConfirmDialog({
      open: true,
      title: 'Delete User',
      desc: `This will soft delete ${user?.name || user?.email} and scrub their PII. This action cannot be undone.`,
      onConfirm: () => deleteUserMutation.mutate({ userId: id }),
      tone: 'destructive'
    })
  }

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {METRIC_CARDS.map((card) => (
          <MetricCard
            key={card.key}
            label={card.label}
            value={metrics?.[card.key as keyof typeof metrics] || 0}
            icon={card.icon}
            color={card.color}
            isLoading={isOverviewLoading}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Import Jobs</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Running</span>
              {isOverviewLoading ? (
                <div className="h-5 w-8 bg-muted rounded animate-pulse" />
              ) : (
                <span className="text-sm font-medium">{metrics?.importJobsRunning || 0}</span>
              )}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Completed Today</span>
              {isOverviewLoading ? (
                <div className="h-5 w-8 bg-muted rounded animate-pulse" />
              ) : (
                <span className="text-sm font-medium">0</span>
              )}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Failed Today</span>
              {isOverviewLoading ? (
                <div className="h-5 w-8 bg-muted rounded animate-pulse" />
              ) : (
                <span className="text-sm font-medium">{metrics?.importJobsFailed || 0}</span>
              )}
            </div>
          </div>
        </div>

        <div className="bg-card border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">System Health</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Database</span>
              <Badge variant="default" className="bg-green-100 text-green-800">
                Healthy
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">API</span>
              <Badge variant="default" className="bg-green-100 text-green-800">
                Healthy
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Storage</span>
              <Badge variant="default" className="bg-green-100 text-green-800">
                Healthy
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderUsers = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">User Management</h2>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search users..."
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      <div className="bg-card border rounded-lg">
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">User</th>
                  <th className="text-left py-3 px-4 font-medium">Role</th>
                  <th className="text-left py-3 px-4 font-medium">Company</th>
                  <th className="text-left py-3 px-4 font-medium">Status</th>
                  <th className="text-left py-3 px-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isUsersLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-b">
                      <td className="py-3 px-4">
                        <div className="h-4 bg-muted rounded animate-pulse" />
                      </td>
                      <td className="py-3 px-4">
                        <div className="h-4 bg-muted rounded animate-pulse" />
                      </td>
                      <td className="py-3 px-4">
                        <div className="h-4 bg-muted rounded animate-pulse" />
                      </td>
                      <td className="py-3 px-4">
                        <div className="h-4 bg-muted rounded animate-pulse" />
                      </td>
                      <td className="py-3 px-4">
                        <div className="h-4 bg-muted rounded animate-pulse" />
                      </td>
                    </tr>
                  ))
                ) : (
                  users.map((user) => (
                    <tr key={user.id} className="border-b">
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium">{user.name || 'N/A'}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="secondary">{user.role}</Badge>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm">{user.company?.name || 'N/A'}</span>
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={user.status?.isBlocked ? 'destructive' : 'default'}
                        >
                          {user.status?.isBlocked ? 'Blocked' : 'Active'}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          {user.status?.isBlocked ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const event = new CustomEvent('admin:unblock', {
                                  detail: { id: user.id }
                                })
                                window.dispatchEvent(event)
                              }}
                            >
                              Unblock
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const event = new CustomEvent('admin:block', {
                                  detail: { id: user.id }
                                })
                                window.dispatchEvent(event)
                              }}
                            >
                              Block
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const event = new CustomEvent('admin:restrict', {
                                detail: { id: user.id }
                              })
                              window.dispatchEvent(event)
                            }}
                          >
                            Restrict
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              const event = new CustomEvent('admin:delete', {
                                detail: { id: user.id }
                              })
                              window.dispatchEvent(event)
                            }}
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )

  const renderAudit = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Audit Log</h2>
        <Button variant="outline" size="sm">
          Export
        </Button>
      </div>

      <div className="bg-card border rounded-lg">
        <div className="p-6">
          <div className="space-y-4">
            {auditQuery.isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between py-3">
                  <div className="h-4 bg-muted rounded animate-pulse w-1/3" />
                  <div className="h-4 bg-muted rounded animate-pulse w-1/4" />
                </div>
              ))
            ) : (
              auditLogs.map((log) => (
                <AuditLogItem key={log.id} log={log} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview()
      case 'users':
        return renderUsers()
      case 'companies':
        return <CompanyManagement />
      case 'skills':
        return <SkillsManagement />
      case 'imports':
        return <ImportsManagement />
      case 'audit':
        return renderAudit()
      default:
        return <div>Content for {activeTab}</div>
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <aside className="w-64 bg-card border-r min-h-screen p-6">
          <div className="flex items-center space-x-2 mb-8">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">Admin</span>
          </div>

          <nav className="space-y-2">
            {NAVIGATION_ITEMS.map((item) => (
              <NavigationItem
                key={item.id}
                item={item}
                isActive={activeTab === item.id}
                onClick={() => setActiveTab(item.id)}
              />
            ))}
          </nav>

          <div className="mt-auto pt-8">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={handleSignOut}
            >
              <LogOut className="h-5 w-5 mr-3" />
              Sign Out
            </Button>
          </div>
        </aside>

        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>

      <Confirm
        open={confirmDialog.open}
        title={confirmDialog.title}
        desc={confirmDialog.desc}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog({ ...confirmDialog, open: false })}
        tone={confirmDialog.tone}
      />
    </div>
  )
}

export function AdminDashboard() {
  return (
    <ProtectedRoute>
      <AdminDashboardContent />
    </ProtectedRoute>
  )
}

