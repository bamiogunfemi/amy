import { useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { Button, Card, CardContent, CardHeader, CardTitle, Logo } from '@amy/ui'
import { useSignupForm, useSignup } from '@amy/ui'
import type { SignupFormData } from '@amy/ui'

import { FormField } from '@/components/auth/form-field'

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
              <FormField
                label="Full Name"
                type="text"
                placeholder="Enter your full name"
                register={register('name')}
                error={errors.name}
              />

              <FormField
                label="Email Address"
                type="email"
                placeholder="Enter your email"
                register={register('email')}
                error={errors.email}
              />

              <FormField
                label="Password"
                type="password"
                placeholder="Create a password"
                register={register('password')}
                error={errors.password}
                isPassword={true}
                onTogglePassword={() => setShowPassword(!showPassword)}
                showPassword={showPassword}
              />

              <FormField
                label="Company Name (Optional)"
                type="text"
                placeholder="Enter your company name"
                register={register('companyName')}
              />

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


