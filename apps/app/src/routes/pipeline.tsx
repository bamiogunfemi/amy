import { useState } from 'react'
import { Button, Card, CardContent, CardHeader, CardTitle, Badge } from '@amy/ui'
import { usePipelineStages } from '@amy/ui'
import { toast } from 'sonner'
import { Layout } from '@/components/layout'
import {
  BarChart3,
  Plus,
  Calendar,
  ArrowRight
} from 'lucide-react'

export function PipelinePage() {
  const [draggedApplication, setDraggedApplication] = useState<string | null>(null)

  const pipelineQuery = usePipelineStages()
  const pipeline = pipelineQuery.data || { stages: [], columns: {} }

  const handleDragStart = (e: React.DragEvent, applicationId: string) => {
    setDraggedApplication(applicationId)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()

    if (!draggedApplication) return

    try {
      // This would call the move endpoint
      toast.success('Application moved successfully')
    } catch (error) {
      toast.error('Failed to move application')
    } finally {
      setDraggedApplication(null)
    }
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Pipeline</h1>
            <p className="text-slate-600 mt-1">Manage your recruitment pipeline</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Stage
            </Button>
            <Button size="sm">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </Button>
          </div>
        </div>

        {/* Pipeline Board */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {pipelineQuery.isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="h-6 w-24 bg-muted rounded animate-pulse" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, j) => (
                      <div key={j} className="h-20 bg-muted rounded animate-pulse" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : pipeline.stages.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <BarChart3 className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No pipeline stages</h3>
              <p className="text-slate-600 mb-4">Create your first pipeline stage to get started</p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Stage
              </Button>
            </div>
          ) : (
            pipeline.stages.map((stage) => (
              <Card
                key={stage.id}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, stage.id)}
                className="min-h-[600px]"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">{stage.name}</CardTitle>
                    <Badge variant="secondary" className="text-xs">
                      {pipeline.columns[stage.id]?.length || 0}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {pipeline.columns[stage.id]?.map((application) => (
                      <div
                        key={application.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, application.id)}
                        className="p-3 border rounded-lg bg-white hover:shadow-md transition-shadow cursor-move"
                      >
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="h-8 w-8 bg-gradient-to-br from-rose-500 to-rose-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-medium">
                              {application.candidate.name.charAt(0)}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-slate-900 truncate">
                              {application.candidate.name}
                            </h4>
                            <p className="text-xs text-slate-600 truncate">
                              {application.candidate.email}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(application.createdAt).toLocaleDateString()}</span>
                          </div>
                          <ArrowRight className="h-3 w-3" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </Layout>
  )
}
