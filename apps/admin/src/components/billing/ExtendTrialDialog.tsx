import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { toast } from 'sonner'

interface ExtendTrialDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  subscriptionId: string
}

export function ExtendTrialDialog({ open, onOpenChange, subscriptionId }: ExtendTrialDialogProps) {
  const [days, setDays] = useState(7)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/subscriptions/extend-trial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscriptionId, days })
      })

      if (response.ok) {
        toast.success(`Trial extended by ${days} days`)
        onOpenChange(false)
      } else {
        toast.error('Failed to extend trial')
      }
    } catch (error) {
      toast.error('Failed to extend trial')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Extend Trial</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Days to extend</label>
            <Input
              type="number"
              min="1"
              max="365"
              value={days}
              onChange={(e) => setDays(parseInt((e.target as globalThis.HTMLInputElement).value) || 0)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Extending...' : 'Extend Trial'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
