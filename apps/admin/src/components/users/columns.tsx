import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { MoreHorizontal } from 'lucide-react'

export type UserRow = {
  id: string
  name: string
  email: string
  role: 'ADMIN' | 'RECRUITER'
  company?: {
    id: string
    name: string
  }
  status: 'active' | 'restricted' | 'blocked' | 'deleted'
  createdAt: string
}

const variants = {
  active: 'default' as const,
  restricted: 'secondary' as const,
  blocked: 'destructive' as const,
  deleted: 'destructive' as const,
}

export const columns = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }: { row: { original: UserRow } }) => {
      const user = row.original
      return (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center">
            <span className="text-rose-600 text-sm font-medium">
              {user.name?.charAt(0) || user.email.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="font-medium">{user.name || 'No name'}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: 'role',
    header: 'Role',
    cell: ({ row }: { row: { original: UserRow } }) => {
      const user = row.original
      return (
        <Badge variant={user.role === 'ADMIN' ? 'destructive' : 'secondary'}>
          {user.role}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'company',
    header: 'Company',
    cell: ({ row }: { row: { original: UserRow } }) => {
      const user = row.original
      return user.company?.name || 'Solo'
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }: { row: { original: UserRow } }) => {
      const user = row.original
      return (
        <Badge variant={variants[user.status]}>
          {user.status}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Created',
    cell: ({ row }: { row: { original: UserRow } }) => {
      const user = row.original
      return new Date(user.createdAt).toLocaleDateString()
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }: { row: { original: UserRow } }) => {
      const user = row.original

      const handleAction = (action: string) => {
        const event = new globalThis.CustomEvent(`admin:${action}`, {
          detail: { id: user.id }
        })
        window.dispatchEvent(event)
      }

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {user.status === 'blocked' ? (
              <DropdownMenuItem onClick={() => handleAction('unblock')}>
                Unblock
              </DropdownMenuItem>
            ) : (
              <>
                <DropdownMenuItem onClick={() => handleAction('restrict')}>
                  Restrict
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAction('block')}>
                  Block
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAction('delete')}>
                  Delete
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
