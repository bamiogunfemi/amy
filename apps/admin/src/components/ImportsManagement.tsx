import { Button } from '../components/ui/button'
import { useImports, useRetryImport } from '@amy/ui'

const ImportJobItem = ({
  job,
  onRetry,
  isRetrying
}: {
  job: any
  onRetry: () => void
  isRetrying: boolean
}) => (
  <div className="flex items-center justify-between p-3 border rounded-md">
    <div>
      <p className="font-medium text-sm">{job.status}</p>
      <p className="text-xs text-muted-foreground">
        {new Date(job.createdAt).toLocaleString()}
      </p>
      {job.error && (
        <p className="text-xs text-rose-600">{job.error}</p>
      )}
    </div>
    <div>
      <Button
        variant="outline"
        size="sm"
        onClick={onRetry}
        disabled={isRetrying}
      >
        Retry
      </Button>
    </div>
  </div>
)

const EmptyState = () => (
  <div className="text-sm text-muted-foreground">No import jobs</div>
)

const LoadingState = () => (
  <div className="flex items-center justify-center py-12">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600" />
  </div>
)

export default function ImportsManagement() {
  const { data: jobs = [], isLoading } = useImports()
  const retry = useRetryImport()

  const handleRetry = (jobId: string) => {
    retry.mutate(jobId)
  }

  if (isLoading) {
    return <LoadingState />
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Import Jobs</h2>
      </div>

      <div className="grid gap-3">
        {jobs.length === 0 ? (
          <EmptyState />
        ) : (
          jobs.map((job) => (
            <ImportJobItem
              key={job.id}
              job={job}
              onRetry={() => handleRetry(job.id)}
              isRetrying={retry.isPending}
            />
          ))
        )}
      </div>
    </div>
  )
}


