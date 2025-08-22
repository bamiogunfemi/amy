import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Badge } from '@amy/ui'
import { useCandidates } from '@amy/ui'
import { toast } from 'sonner'
import { Layout } from '@/components/layout'
import {
  Users,
  Plus,
  Upload,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Mail,
  Phone,
  Calendar,
  FileText,
  Tag
} from 'lucide-react'

export function CandidatesPage() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([])

  const candidatesQuery = useCandidates()
  const candidates = candidatesQuery.data || []

  const handleDeleteCandidate = async () => {
    try {
      // This would call the DELETE endpoint
      toast.success('Candidate deleted successfully')
    } catch (error) {
      toast.error('Failed to delete candidate')
    }
  }

  const handleBulkAction = (action: string) => {
    if (selectedCandidates.length === 0) {
      toast.error('Please select candidates first')
      return
    }
    toast.info(`${action} action for ${selectedCandidates.length} candidates`)
  }

  const handleSelectAll = () => {
    if (selectedCandidates.length === candidates.length) {
      setSelectedCandidates([])
    } else {
      setSelectedCandidates(candidates.map(c => c.id))
    }
  }

  const handleSelectCandidate = (id: string) => {
    setSelectedCandidates(prev =>
      prev.includes(id)
        ? prev.filter(c => c !== id)
        : [...prev, id]
    )
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Candidates</h1>
            <p className="text-slate-600 mt-1">Manage your candidate pool</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Upload CV(s)
            </Button>
            <Button size="sm" onClick={() => navigate({ to: '/candidates' })}>
              <Plus className="h-4 w-4 mr-2" />
              New Candidate
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search candidates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
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
                    <label className="block text-sm font-medium text-slate-700 mb-1">Source</label>
                    <select className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm">
                      <option value="">All Sources</option>
                      <option value="manual">Manual</option>
                      <option value="upload">Upload</option>
                      <option value="import">Import</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Experience</label>
                    <select className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm">
                      <option value="">All Levels</option>
                      <option value="junior">Junior</option>
                      <option value="mid">Mid-level</option>
                      <option value="senior">Senior</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Has Documents</label>
                    <select className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm">
                      <option value="">All</option>
                      <option value="true">Yes</option>
                      <option value="false">No</option>
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

        {/* Bulk Actions */}
        {selectedCandidates.length > 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-600">
                  {selectedCandidates.length} candidate(s) selected
                </p>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkAction('Add Skills')}
                  >
                    <Tag className="h-4 w-4 mr-2" />
                    Add Skills
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkAction('Export')}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkAction('Add to Job')}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add to Job
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Candidates Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Candidates ({candidates.length})</CardTitle>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedCandidates.length === candidates.length && candidates.length > 0}
                  onChange={handleSelectAll}
                  className="h-4 w-4 text-rose-600 border-slate-300 rounded focus:ring-rose-500"
                />
                <span className="text-sm text-slate-600">Select all</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {candidatesQuery.isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <div className="h-12 w-12 bg-muted rounded-full animate-pulse" />
                    <div className="space-y-2 flex-1">
                      <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                      <div className="h-3 w-48 bg-muted rounded animate-pulse" />
                    </div>
                    <div className="h-8 w-24 bg-muted rounded animate-pulse" />
                  </div>
                ))}
              </div>
            ) : candidates.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">No candidates yet</h3>
                <p className="text-slate-600 mb-4">Get started by adding your first candidate</p>
                <Button onClick={() => navigate({ to: '/candidates' })}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Candidate
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {candidates.map((candidate) => (
                  <div
                    key={candidate.id}
                    className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCandidates.includes(candidate.id)}
                      onChange={() => handleSelectCandidate(candidate.id)}
                      className="h-4 w-4 text-rose-600 border-slate-300 rounded focus:ring-rose-500"
                    />

                    <div className="h-12 w-12 bg-gradient-to-br from-rose-500 to-rose-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium">
                        {candidate.name.charAt(0)}
                      </span>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-medium text-slate-900">{candidate.name}</h3>
                        <Badge variant="secondary" className="text-xs">
                          {candidate.source}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-slate-600">
                        {candidate.email && (
                          <div className="flex items-center space-x-1">
                            <Mail className="h-3 w-3" />
                            <span>{candidate.email}</span>
                          </div>
                        )}
                        {candidate.phone && (
                          <div className="flex items-center space-x-1">
                            <Phone className="h-3 w-3" />
                            <span>{candidate.phone}</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(candidate.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate({ to: '/candidates' })}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteCandidate()}
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
