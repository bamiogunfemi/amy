import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { AuthCard } from '../components/auth/AuthCard'
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'
import { LoginFormData, useLogin, useLoginForm } from '@amy/ui'

export function AdminLoginPage() {
  const navigate = useNavigate()
  const loginMutation = useLogin()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useLoginForm()

  const onSubmit = (data: LoginFormData) => {

    loginMutation.mutate(data, {
      onSuccess: () => {
        toast.success('Login successful')
        navigate({ to: '/' })
      },
      onError: (error) => {
        console.log('login error in component:', error)
        const message = error.response?.data?.error || 'Invalid email or password'
        console.log('showing toast with message:', message)
        toast.error(message)
      },
    })
  }

  return (
    <AuthCard title="Admin sign in">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">Email</label>
          <Input
            type="email"
            placeholder="Enter your email"
            {...register('email')}
            disabled={isSubmitting}
          />
          {errors.email && (
            <p className="text-sm text-rose-600">{errors.email.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">Password</label>
          <Input
            type="password"
            placeholder="Enter your password"
            {...register('password')}
            disabled={isSubmitting}
          />
          {errors.password && (
            <p className="text-sm text-rose-600">{errors.password.message}</p>
          )}
        </div>
        {errors.root && (
          <p className="text-sm text-rose-600">{errors.root.message}</p>
        )}
        <Button
          type="submit"
          className="w-full bg-rose-600 hover:bg-rose-700 text-white"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            'Sign in'
          )}
        </Button>
      </form>
    </AuthCard>
  )
}


