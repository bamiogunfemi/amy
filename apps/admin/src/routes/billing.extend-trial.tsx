import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/dialog'
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'
import { useExtendTrial, useExtendTrialForm } from '@amy/ui'

interface ExtendTrialDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userId: string
  userName: string
}

export function ExtendTrialDialog({ open, onOpenChange, userId, userName }: ExtendTrialDialogProps) {
  const extendTrialMutation = useExtendTrial()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useExtendTrialForm()

  const onSubmit = (data: any) => {
    extendTrialMutation.mutate(
      { ...data, userId },
      {
        onSuccess: () => {
          onOpenChange(false)
          reset()
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Extend Trial for {userName}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Days to extend</label>
            <Input
              type="number"
              min="1"
              max="365"
              placeholder="30"
              {...register('days', { valueAsNumber: true })}
              disabled={isSubmitting}
            />
            {errors.days && (
              <p className="text-sm text-rose-600">{errors.days.message}</p>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Extending...' : 'Extend Trial'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
