import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Badge } from '@amy/ui'
import { useSearch, useSearchSkills } from '@amy/ui'
import { toast } from 'sonner'
import { Layout } from '@/components/layout'
import {
  Search,
  Filter,
  Users,
  Tag,
  Mail,
  Calendar,
  MapPin,
  Eye,
  Star,
  Briefcase
} from 'lucide-react'

export function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)

  const searchQuery_hook = useSearch(searchQuery)
  const skillsQuery = useSearchSkills(searchQuery)

  const candidates = searchQuery_hook.data || []
  const skills = skillsQuery.data || []

  const handleQuickEmail = async () => {
    try {
      // This would call the email endpoint
      toast.success('Email sent successfully')
    } catch (error) {
      toast.error('Failed to send email')
    }
  }

  const handleAddSkill = async () => {
    try {
      // This would call the add skill endpoint
      toast.success('Skill added successfully')
    } catch (error) {
      toast.error('Failed to add skill')
    }
  }

  const handleSkillToggle = (skillId: string) => {
    setSelectedSkills(prev =>
      prev.includes(skillId)
        ? prev.filter(id => id !== skillId)
        : [...prev, skillId]
    )
  }

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      toast.error('Please enter a search query')
      return
    }
    // The search will be triggered by the query parameter
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Search</h1>
            <p className="text-slate-600 mt-1">Find candidates and skills across your database</p>
          </div>
        </div>

        {/* Search Interface */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search candidates by name, email, skills, or experience..."
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
              <div className="pt-4 border-t border-slate-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Skills</label>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {skills.map((skill) => (
                        <label key={skill.id} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={selectedSkills.includes(skill.id)}
                            onChange={() => handleSkillToggle(skill.id)}
                            className="h-4 w-4 text-rose-600 border-slate-300 rounded focus:ring-rose-500"
                          />
                          <span className="text-sm text-slate-700">{skill.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Experience Level</label>
                    <select className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm">
                      <option value="">All Levels</option>
                      <option value="junior">Junior</option>
                      <option value="mid">Mid-level</option>
                      <option value="senior">Senior</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Location</label>
                    <Input placeholder="City, Country" className="text-sm" />
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Search Results */}
        {searchQuery && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  Search Results ({candidates.length})
                </CardTitle>
                <p className="text-sm text-slate-600">
                  Showing results for "{searchQuery}"
                </p>
              </div>
            </CardHeader>
            <CardContent>
              {searchQuery_hook.isLoading ? (
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
                  <Search className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 mb-2">No results found</h3>
                  <p className="text-slate-600 mb-4">
                    Try adjusting your search terms or filters
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {candidates.map((candidate) => (
                    <div
                      key={candidate.id}
                      className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      <div className="h-12 w-12 bg-gradient-to-br from-rose-500 to-rose-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium">
                          {candidate.name.charAt(0)}
                        </span>
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-medium text-slate-900">{candidate.name}</h3>
                          <Badge variant="secondary" className="text-xs">
                            {candidate.experienceLevel || 'Not specified'}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-slate-600 mb-2">
                          {candidate.email && (
                            <div className="flex items-center space-x-1">
                              <Mail className="h-3 w-3" />
                              <span>{candidate.email}</span>
                            </div>
                          )}
                          {candidate.location && (
                            <div className="flex items-center space-x-1">
                              <MapPin className="h-3 w-3" />
                              <span>{candidate.location}</span>
                            </div>
                          )}
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(candidate.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>

                        {candidate.skills && candidate.skills.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {candidate.skills.slice(0, 3).map((skill) => (
                              <Badge key={skill.id} variant="outline" className="text-xs">
                                {skill.name}
                              </Badge>
                            ))}
                            {candidate.skills.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{candidate.skills.length - 3} more
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleQuickEmail(candidate.id)}
                        >
                          <Mail className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleAddSkill(candidate.id, 'skill-id')}
                        >
                          <Tag className="h-4 w-4" />
                        </Button>
                        <Link to={`/candidates/${candidate.id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Popular Searches */}
        {!searchQuery && (
          <Card>
            <CardHeader>
              <CardTitle>Popular Searches</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { icon: Briefcase, label: 'Senior Developers', query: 'senior developer' },
                  { icon: Tag, label: 'React Engineers', query: 'react' },
                  { icon: Users, label: 'Product Managers', query: 'product manager' },
                  { icon: Star, label: 'Top Candidates', query: 'high potential' },
                  { icon: MapPin, label: 'Remote Workers', query: 'remote' },
                  { icon: Calendar, label: 'Recently Added', query: 'recent' },
                ].map((item) => (
                  <Button
                    key={item.query}
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-center space-y-2"
                    onClick={() => setSearchQuery(item.query)}
                  >
                    <item.icon className="h-6 w-6 text-rose-600" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  )
}
