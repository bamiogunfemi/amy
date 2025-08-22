import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Button, Card, CardContent, CardHeader, CardTitle } from '@amy/ui'
import { useRecruiterMetrics } from '@amy/ui'
import { toast } from 'sonner'
import {
  Users,
  Briefcase,
  FileText,
  Upload,
  Plus,
  BarChart3,
  Calendar,
  UserCheck,
  ArrowRight,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

import { Layout } from '@/components/layout'

export function DashboardPage() {
  const [isCreatingCandidate, setIsCreatingCandidate] = useState(false)
  const metricsQuery = useRecruiterMetrics()

  const metrics = metricsQuery.data

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  const handleCreateCandidate = async () => {
    setIsCreatingCandidate(true)
    try {
      // This would open a modal or navigate to create page
      toast.success('Redirecting to create candidate...')
    } catch (error) {
      toast.error('Failed to create candidate')
    } finally {
      setIsCreatingCandidate(false)
    }
  }

  const handleUploadCV = () => {
    toast.info('File upload coming soon!')
  }

  const handleCreateJob = () => {
    toast.info('Job creation coming soon!')
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-rose-500 to-rose-600 rounded-2xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2">{getGreeting()}! 👋</h2>
              <p className="text-rose-100 text-lg">
                Here's what's happening with your recruitment pipeline today
              </p>
            </div>
            <div className="hidden md:block">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                <BarChart3 className="h-10 w-10 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer" onClick={handleCreateCandidate}>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Plus className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">New Candidate</h3>
                  <p className="text-sm text-slate-600">Add a new candidate to your pool</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer" onClick={handleUploadCV}>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                  <Upload className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Upload CV(s)</h3>
                  <p className="text-sm text-slate-600">Upload and parse candidate documents</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer" onClick={handleCreateJob}>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Briefcase className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">New Job</h3>
                  <p className="text-sm text-slate-600">Create a new job posting</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Link to="/pipeline">
            <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                    <BarChart3 className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">View Pipeline</h3>
                    <p className="text-sm text-slate-600">Manage your recruitment pipeline</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Candidates</p>
                  {metricsQuery.isLoading ? (
                    <div className="h-7 w-16 bg-muted rounded animate-pulse" />
                  ) : (
                    <p className="text-2xl font-bold">{metrics?.totalCandidates || 0}</p>
                  )}
                </div>
                <Users className="h-8 w-8 text-rose-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Applications</p>
                  {metricsQuery.isLoading ? (
                    <div className="h-7 w-16 bg-muted rounded animate-pulse" />
                  ) : (
                    <p className="text-2xl font-bold">{metrics?.activeApplications || 0}</p>
                  )}
                </div>
                <UserCheck className="h-8 w-8 text-rose-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Interviews Scheduled</p>
                  {metricsQuery.isLoading ? (
                    <div className="h-7 w-16 bg-muted rounded animate-pulse" />
                  ) : (
                    <p className="text-2xl font-bold">{metrics?.interviewsScheduled || 0}</p>
                  )}
                </div>
                <Calendar className="h-8 w-8 text-rose-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Offers Extended</p>
                  {metricsQuery.isLoading ? (
                    <div className="h-7 w-16 bg-muted rounded animate-pulse" />
                  ) : (
                    <p className="text-2xl font-bold">{metrics?.offersExtended || 0}</p>
                  )}
                </div>
                <CheckCircle className="h-8 w-8 text-rose-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
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
                metrics?.recentActivity?.slice(0, 5).map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-muted transition-colors">
                    <div className="h-10 w-10 bg-gradient-to-br from-rose-500 to-rose-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {activity.candidateName.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">
                        {activity.candidateName} • {new Date(activity.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/candidates">
            <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Candidates</h3>
                    <p className="text-sm text-slate-600">Manage your candidate pool</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/jobs">
            <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <Briefcase className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Jobs</h3>
                    <p className="text-sm text-slate-600">Manage job postings</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/search">
            <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Search</h3>
                    <p className="text-sm text-slate-600">Find candidates and skills</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </Layout>
  )
}
