import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Badge } from '@amy/ui'
import { toast } from 'sonner'
import { Layout } from '@/components/layout'
import { useJobs, useDeleteJob, useCreateJob, useUpdateJob, type JobInput } from '@amy/ui'
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
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<JobInput>({ title: '', status: 'ACTIVE' })

  const jobsQuery = useJobs()
  const jobs = jobsQuery.data?.items ?? []
  const deleteJob = useDeleteJob()
  const createJob = useCreateJob()
  const updateJob = useUpdateJob()

  const handleDeleteJob = (id: string) => {
    deleteJob.mutate(id)
  }

  const openCreate = () => {
    setEditingId(null)
    setForm({ title: '', status: 'ACTIVE' })
    setShowModal(true)
  }

  const openEdit = (job: any) => {
    setEditingId(job.id)
    setForm({
      title: job.title,
      description: job.description ?? '',
      location: job.location ?? '',
      seniority: job.seniority ?? '',
      status: job.status ?? 'ACTIVE',
    })
    setShowModal(true)
  }

  const handleSave = () => {
    if (!form.title.trim()) return toast.error('Title is required')
    if (editingId) {
      updateJob.mutate({ id: editingId, data: form }, { onSuccess: () => setShowModal(false) })
    } else {
      createJob.mutate(form, { onSuccess: () => setShowModal(false) })
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

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Jobs</h1>
            <p className="text-slate-600 mt-1">Manage your job postings and applications</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button size="sm" onClick={openCreate}>
              <Plus className="h-4 w-4 mr-2" />
              New Job
            </Button>
          </div>
        </div>


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
                <Button onClick={() => navigate({ to: '/jobs' })}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Job
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {jobs.map((job: any) => (
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
                      <Button variant="ghost" size="sm" onClick={() => navigate({ to: '/jobs' })}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => openEdit(job)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteJob(job.id)}>
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
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl p-6 w-full max-w-md space-y-4">
              <h3 className="text-lg font-semibold">{editingId ? 'Edit Job' : 'New Job'}</h3>
              <div className="space-y-3">
                <Input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                <Input placeholder="Location" value={form.location ?? ''} onChange={(e) => setForm({ ...form, location: e.target.value })} />
                <Input placeholder="Seniority" value={form.seniority ?? ''} onChange={(e) => setForm({ ...form, seniority: e.target.value })} />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
                <Button onClick={handleSave}>{editingId ? 'Save' : 'Create'}</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
