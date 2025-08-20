import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./dialog";
import { Button } from "./button";

export function Confirm({
  open,
  title,
  desc,
  onConfirm,
  onCancel,
  tone = 'default'
}: {
  open: boolean
  title: string
  desc?: string
  onConfirm: () => void
  onCancel: () => void
  tone?: 'default' | 'destructive'
}) {
  return (
    <Dialog open={open} onOpenChange={() => onCancel()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {desc && <p className="text-sm text-muted-foreground mb-4">{desc}</p>}
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant={tone === 'destructive' ? 'destructive' : 'default'} onClick={onConfirm}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
