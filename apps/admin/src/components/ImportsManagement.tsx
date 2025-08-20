import { Button } from '../components/ui/button'
import { useImports, useRetryImport } from '@amy/ui'

export default function ImportsManagement() {
  const { data: jobs = [], isLoading } = useImports()
  const retry = useRetryImport()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Import Jobs</h2>
      </div>
      <div className="grid gap-3">
        {jobs.map((j) => (
          <div key={j.id} className="flex items-center justify-between p-3 border rounded-md">
            <div>
              <p className="font-medium text-sm">{j.status}</p>
              <p className="text-xs text-muted-foreground">{new Date(j.createdAt).toLocaleString()}</p>
              {j.error && <p className="text-xs text-rose-600">{j.error}</p>}
            </div>
            <div>
              <Button variant="outline" size="sm" onClick={() => retry.mutate(j.id)} disabled={retry.isPending}>
                Retry
              </Button>
            </div>
          </div>
        ))}
        {jobs.length === 0 && (
          <div className="text-sm text-muted-foreground">No import jobs</div>
        )}
      </div>
    </div>
  )
}


