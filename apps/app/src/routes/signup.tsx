import { useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { Button, Input, Card, CardContent, CardHeader, CardTitle, Logo } from '@amy/ui'
import { useSignupForm, useSignup } from '@amy/ui'
import { Eye, EyeOff } from 'lucide-react'
import type { SignupFormData } from '@amy/ui'

export function SignupPage() {
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useSignupForm()

  const signupMutation = useSignup()

  const onSubmit = async (data: SignupFormData) => {
    signupMutation.mutate(data, {
      onSuccess: () => {
        navigate({ to: '/' })
      }
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <Logo size="lg" />
            </div>
            <CardTitle className="text-2xl font-bold text-slate-900">
              Create your account
            </CardTitle>
            <p className="text-slate-600">
              Start your free trial and transform your recruitment process
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Full Name
                </label>
                <Input
                  type="text"
                  placeholder="Enter your full name"
                  {...register('name')}
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email Address
                </label>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  {...register('email')}
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a password"
                    {...register('password')}
                    className={errors.password ? 'border-red-500 pr-10' : 'pr-10'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                )}
              </div>



              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Company Name (Optional)
                </label>
                <Input
                  type="text"
                  placeholder="Enter your company name"
                  {...register('companyName')}
                />
              </div>

              <div className="space-y-3">
                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    className="mt-1 h-4 w-4 text-rose-600 border-slate-300 rounded focus:ring-rose-500"
                  />
                  <span className="text-sm text-slate-600">
                    I agree to the{' '}
                    <a href="#" className="text-rose-600 hover:text-rose-700 font-medium">
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="#" className="text-rose-600 hover:text-rose-700 font-medium">
                      Privacy Policy
                    </a>
                  </span>
                </label>

                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    className="mt-1 h-4 w-4 text-rose-600 border-slate-300 rounded focus:ring-rose-500"
                  />
                  <span className="text-sm text-slate-600">
                    Send me product updates and recruitment tips
                  </span>
                </label>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white py-3 disabled:opacity-60"
                loading={signupMutation.isPending || isSubmitting}
              >
                Create Account
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-slate-600">
                Already have an account?{' '}
                <Link to="/login" className="text-rose-600 hover:text-rose-700 font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


