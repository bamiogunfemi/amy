import { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Button, Input, Card, CardContent, CardHeader, CardTitle } from '@amy/ui'
import { useRequestPasswordReset, useSetNewPassword } from '@amy/ui'
import { Eye, EyeOff, ArrowLeft } from 'lucide-react'


export function ResetPasswordPage() {
  const [email, setEmail] = useState('')
  const [token, setToken] = useState<string | null>(null)
  const [newPassword, setNewPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const requestResetMutation = useRequestPasswordReset()
  const setPasswordMutation = useSetNewPassword()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const t = params.get('token')
    if (t) setToken(t)
  }, [])

  async function requestReset(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setMessage(null)
    requestResetMutation.mutate({ email }, {
      onSuccess: () => {
        setMessage('If an account exists, a reset email has been sent.')
      },
      onError: (error: any) => {
        setError(error.response?.data?.error || 'An error occurred')
      }
    })
  }

  async function setPassword(e: React.FormEvent) {
    e.preventDefault()
    if (!token) return
    setError(null)
    setMessage(null)
    setPasswordMutation.mutate({ token, newPassword }, {
      onSuccess: () => {
        setMessage('Password updated. You can now sign in.')
      },
      onError: (error: any) => {
        setError(error.response?.data?.error || 'An error occurred')
      }
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-rose-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <CardTitle className="text-2xl font-bold text-slate-900">
              {token ? 'Set new password' : 'Reset password'}
            </CardTitle>
            <p className="text-slate-600">
              {token ? 'Enter your new password below' : 'Enter your email to receive a reset link'}
            </p>
          </CardHeader>
          <CardContent>
            {!token ? (
              <form onSubmit={requestReset} className="space-y-4">
                {message && <div className="text-sm text-green-600 bg-green-50 p-3 rounded-lg">{message}</div>}
                {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</div>}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white py-3 disabled:opacity-60"
                  loading={requestResetMutation.isPending}
                >
                  Send reset link
                </Button>
              </form>
            ) : (
              <form onSubmit={setPassword} className="space-y-4">
                {message && <div className="text-sm text-green-600 bg-green-50 p-3 rounded-lg">{message}</div>}
                {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</div>}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      minLength={6}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white py-3 disabled:opacity-60"
                  loading={setPasswordMutation.isPending}
                >
                  Update password
                </Button>
              </form>
            )}

            <div className="mt-6 text-center">
              <Link to="/login" className="inline-flex items-center text-sm text-rose-600 hover:text-rose-700 font-medium">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


