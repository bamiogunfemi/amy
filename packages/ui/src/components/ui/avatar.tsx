import { cn } from "../../lib/utils"

interface AvatarProps {
  name?: string | null
  email?: string | null
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function Avatar({ name, email, size = 'md', className }: AvatarProps) {
  const getInitials = () => {
    if (name) {
      return name.charAt(0).toUpperCase()
    }
    if (email) {
      return email.charAt(0).toUpperCase()
    }
    return '?'
  }

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base'
  }

  return (
    <div
      className={cn(
        'bg-gradient-to-br from-rose-500 to-rose-600 rounded-lg border-2 border-white shadow-sm flex items-center justify-center font-medium text-white',
        sizeClasses[size],
        className
      )}
    >
      {getInitials()}
    </div>
  )
}
