import { useAuth } from '@amy/ui'
import { useNavigate } from '@tanstack/react-router'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const navigate = useNavigate()
  const { data: user, isLoading, error } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Verifying authentication...</p>
        </div>
      </div>
    )
  }

  if (error || !user) {
    navigate({ to: '/login' })
    return null
  }

  // Check if user is admin
  if (user.role !== 'ADMIN') {
    navigate({ to: '/login' })
    return null
  }

  return <>{children}</>
}
