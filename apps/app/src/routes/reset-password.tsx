import { useEffect, useState } from 'react'
import { AuthCard } from '@/components/auth/AuthCard'
import { Button, Input } from '@amy/ui'

export function ResetPasswordPage() {
  const [email, setEmail] = useState('')
  const [token, setToken] = useState<string | null>(null)
  const [newPassword, setNewPassword] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const t = params.get('token')
    if (t) setToken(t)
  }, [])

  async function requestReset(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to send reset email')
      setMessage('If an account exists, a reset email has been sent.')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  async function setPassword(e: React.FormEvent) {
    e.preventDefault()
    if (!token) return
    setLoading(true)
    setError(null)
    setMessage(null)
    try {
      const res = await fetch('/api/auth/reset-password/set', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to set password')
      setMessage('Password updated. You can now sign in.')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthCard title={token ? 'Set new password' : 'Reset password'}>
      {!token ? (
        <form onSubmit={requestReset} className="space-y-4">
          {message && <div className="text-sm text-zinc-600">{message}</div>}
          {error && <div className="text-rose-600 text-sm">{error}</div>}
          <div className="space-y-2">
            <label className="block text-sm">Email</label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Sending…' : 'Send reset link'}
          </Button>
        </form>
      ) : (
        <form onSubmit={setPassword} className="space-y-4">
          {message && <div className="text-sm text-zinc-600">{message}</div>}
          {error && <div className="text-rose-600 text-sm">{error}</div>}
          <div className="space-y-2">
            <label className="block text-sm">New password</label>
            <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={6} />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Updating…' : 'Update password'}
          </Button>
        </form>
      )}
    </AuthCard>
  )
}


