import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Badge } from '@amy/ui'
import { toast } from 'sonner'
import { Layout } from '@/components/layout'
import {
  Briefcase,
  Plus,
  Search,
  Filter,
  MapPin,
  Calendar,
  Users,
  Edit,
  Eye,
  Trash2,
  MoreHorizontal,
  DollarSign,
  Clock
} from 'lucide-react'

export function JobsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  // Mock data - in real app this would come from useJobs hook
  const jobs = [
    {
      id: '1',
      title: 'Senior Frontend Developer',
      location: 'Remote',
      type: 'Full-time',
      seniority: 'Senior',
      salaryMin: 80000,
      salaryMax: 120000,
      status: 'ACTIVE',
      applicationsCount: 12,
      createdAt: new Date('2024-01-15'),
    },
    {
      id: '2',
      title: 'Product Manager',
      location: 'San Francisco, CA',
      type: 'Full-time',
      seniority: 'Mid-level',
      salaryMin: 90000,
      salaryMax: 140000,
      status: 'ACTIVE',
      applicationsCount: 8,
      createdAt: new Date('2024-01-10'),
    },
    {
      id: '3',
      title: 'DevOps Engineer',
      location: 'New York, NY',
      type: 'Full-time',
      seniority: 'Senior',
      salaryMin: 100000,
      salaryMax: 150000,
      status: 'DRAFT',
      applicationsCount: 0,
      createdAt: new Date('2024-01-05'),
    },
  ]

  const handleDeleteJob = async (id: string) => {
    try {
      // This would call the DELETE endpoint
      toast.success('Job deleted successfully')
    } catch (error) {
      toast.error('Failed to delete job')
    }
  }

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      toast.error('Please enter a search query')
      return
    }
    // The search will be triggered by the query parameter
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800'
      case 'DRAFT':
        return 'bg-yellow-100 text-yellow-800'
      case 'CLOSED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Jobs</h1>
            <p className="text-slate-600 mt-1">Manage your job postings and applications</p>
          </div>
          <div className="flex items-center space-x-3">
            <Link to="/jobs/new">
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Job
              </Button>
            </Link>
          </div>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search jobs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10"
                />
              </div>
              <Button onClick={handleSearch}>
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>

            {showFilters && (
              <div className="mt-4 pt-4 border-t border-slate-200">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                    <select className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm">
                      <option value="">All Status</option>
                      <option value="active">Active</option>
                      <option value="draft">Draft</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                    <select className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm">
                      <option value="">All Types</option>
                      <option value="full-time">Full-time</option>
                      <option value="part-time">Part-time</option>
                      <option value="contract">Contract</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Seniority</label>
                    <select className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm">
                      <option value="">All Levels</option>
                      <option value="junior">Junior</option>
                      <option value="mid">Mid-level</option>
                      <option value="senior">Senior</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                    <Input placeholder="City, Country" className="text-sm" />
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Jobs List */}
        <Card>
          <CardHeader>
            <CardTitle>Job Postings ({jobs.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {jobs.length === 0 ? (
              <div className="text-center py-12">
                <Briefcase className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">No jobs yet</h3>
                <p className="text-slate-600 mb-4">Create your first job posting to get started</p>
                <Link to="/jobs/new">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Job
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {jobs.map((job) => (
                  <div
                    key={job.id}
                    className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <div className="h-12 w-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <Briefcase className="h-6 w-6 text-white" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-medium text-slate-900">{job.title}</h3>
                        <Badge className={`text-xs ${getStatusColor(job.status)}`}>
                          {job.status}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-slate-600 mb-2">
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-3 w-3" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{job.type}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <DollarSign className="h-3 w-3" />
                          <span>${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="h-3 w-3" />
                          <span>{job.applicationsCount} applications</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-slate-500">
                        <Calendar className="h-3 w-3" />
                        <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Link to={`/jobs/${job.id}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link to={`/jobs/${job.id}/edit`}>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteJob(job.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
