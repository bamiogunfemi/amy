
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
  Plus,
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

  const navigation = [
    { id: 'overview', label: 'Overview', icon: BarChart3, },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'companies', label: 'Companies', icon: Building2, },
    { id: 'billing', label: 'Billing & Trials', icon: CreditCard, },
    { id: 'skills', label: 'Skills', icon: Tag, },
    { id: 'assignments', label: 'Assignments', icon: ArrowRightLeft, },
    { id: 'imports', label: 'Imports', icon: Database, },
    { id: 'audit', label: 'Audit', icon: History, },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Users</p>
              {isOverviewLoading ? (
                <div className="h-7 w-16 bg-muted rounded animate-pulse" />
              ) : (
                <p className="text-2xl font-bold">{metrics?.totalUsers || 0}</p>
              )}
            </div>
            <Users className="h-8 w-8 text-rose-600" />
          </div>
        </div>

        <div className="bg-card border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Candidates</p>
              {isOverviewLoading ? (
                <div className="h-7 w-16 bg-muted rounded animate-pulse" />
              ) : (
                <p className="text-2xl font-bold">{metrics?.totalCandidates || 0}</p>
              )}
            </div>
            <UserCheck className="h-8 w-8 text-rose-600" />
          </div>
        </div>

        <div className="bg-card border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Companies</p>
              {isOverviewLoading ? (
                <div className="h-7 w-16 bg-muted rounded animate-pulse" />
              ) : (
                <p className="text-2xl font-bold">{metrics?.totalCompanies || 0}</p>
              )}
            </div>
            <Building2 className="h-8 w-8 text-rose-600" />
          </div>
        </div>

        <div className="bg-card border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Trials</p>
              {isOverviewLoading ? (
                <div className="h-7 w-16 bg-muted rounded animate-pulse" />
              ) : (
                <p className="text-2xl font-bold">{metrics?.activeTrials || 0}</p>
              )}
            </div>
            <CreditCard className="h-8 w-8 text-rose-600" />
          </div>
        </div>
      </div>

      {/* Import Jobs Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Import Jobs</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Running</span>
              {isOverviewLoading ? (
                <div className="h-6 w-10 bg-muted rounded animate-pulse" />
              ) : (
                <Badge variant="secondary">{metrics?.importJobsRunning || 0}</Badge>
              )}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Failed (24h)</span>
              {isOverviewLoading ? (
                <div className="h-6 w-10 bg-muted rounded animate-pulse" />
              ) : (
                <Badge variant="destructive">{metrics?.importJobsFailed || 0}</Badge>
              )}
            </div>
          </div>
        </div>

        <div className="bg-card border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Admin Actions</h3>
          <div className="space-y-3">
            {isOverviewLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <div className="space-y-1">
                    <div className="h-4 w-40 bg-muted rounded animate-pulse" />
                    <div className="h-3 w-24 bg-muted rounded animate-pulse" />
                  </div>
                  <div className="h-3 w-16 bg-muted rounded animate-pulse" />
                </div>
              ))
              : auditLogs.slice(0, 5).map((log: any) => (
                <div key={log.id} className="flex items-center justify-between text-sm">
                  <div>
                    <p className="font-medium">{log.action.replace('_', ' ')}</p>
                    <p className="text-muted-foreground">{log.actor.name}</p>
                  </div>
                  <span className="text-muted-foreground">
                    {new Date(log.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Recent Users */}
      <div className="bg-card border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Recent Users</h3>
          <Button variant="ghost" size="sm" onClick={() => setActiveTab('users')}>
            View All
            <ArrowRightLeft className="h-4 w-4 ml-2" />
          </Button>
        </div>
        <div className="space-y-3">
          {isUsersLoading
            ? Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-muted-foreground/20 rounded-full" />
                  <div className="space-y-1">
                    <div className="h-4 w-40 bg-muted-foreground/20 rounded animate-pulse" />
                    <div className="h-3 w-56 bg-muted-foreground/20 rounded animate-pulse" />
                  </div>
                </div>
                <div className="h-5 w-16 bg-muted-foreground/20 rounded animate-pulse" />
              </div>
            ))
            : users.slice(0, 5).map((user) => (
              <div key={user.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center">
                    <span className="text-rose-600 text-sm font-medium">
                      {user.name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{user.name || 'No name'}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={user.role === 'ADMIN' ? 'destructive' : 'secondary'}>
                    {user.role}
                  </Badge>
                  {user.status?.isBlocked && (
                    <Badge variant="destructive">Blocked</Badge>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )

  const renderUsers = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">User Management</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      <div className="bg-card border rounded-lg">
        <div className="p-6">
          <div className="space-y-4">
            {users.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center">
                    <span className="text-rose-600 font-medium">
                      {user.name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{user.name || 'No name'}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    {user.company && (
                      <p className="text-xs text-muted-foreground">{user.company.name}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge variant={user.role === 'ADMIN' ? 'destructive' : 'secondary'}>
                    {user.role}
                  </Badge>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      {user.status?.isBlocked ? 'Unblock' : 'Block'}
                    </Button>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </div>
                </div>
              </div>
            ))}
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
      case 'billing':
        return <div className="text-center py-12"><p>Billing & Trials management coming soon...</p></div>
      case 'skills':
        return <SkillsManagement />
      case 'assignments':
        return <div className="text-center py-12"><p>Assignments management coming soon...</p></div>
      case 'imports':
        return <ImportsManagement />
      case 'audit':
        return <div className="text-center py-12"><p>Audit logs coming soon...</p></div>
      case 'settings':
        return <div className="text-center py-12"><p>Admin settings coming soon...</p></div>
      default:
        return renderOverview()
    }
  }

  // Render page even during loading; per-card skeletons handle placeholders

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className=" mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-rose-600 rounded-lg flex items-center justify-center">
              <Shield className="text-white h-5 w-5" />
            </div>
            <span className="text-xl font-bold">Amy - Admin Dashboard</span>
          </div>

        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 border-r bg-card">
          <nav className="p-4 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${activeTab === item.id
                    ? 'bg-rose-600 text-white'
                    : 'hover:bg-muted'
                    }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </div>
                </button>
              )
            })}
            <button
              onClick={handleSignOut}
              disabled={logoutMutation.isPending}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors${logoutMutation.isPending
                ? 'bg-muted text-muted-foreground'
                : 'hover:bg-muted'
                }`}
            >
              <div className="flex items-center space-x-3">
                <LogOut className="h-4 w-4 mr-2" />
                {logoutMutation.isPending ? 'Signing out...' : 'Sign Out'}
              </div>

            </button>

          </nav>



        </aside>

        {/* Main content */}
        <main className="flex-1 p-6">
          {renderContent()}
        </main>
      </div>

      {/* Confirm Dialog */}
      <Confirm
        open={confirmDialog.open}
        title={confirmDialog.title}
        desc={confirmDialog.desc}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog({ open: false, title: '', onConfirm: () => { } })}
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

