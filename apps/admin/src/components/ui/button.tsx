import * as React from 'react'

type ButtonVariant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
type ButtonSize = 'default' | 'sm' | 'lg' | 'icon'

type ButtonProps = React.ComponentProps<'button'> & {
  variant?: ButtonVariant
  size?: ButtonSize
}

export function Button({ variant = 'default', size = 'default', className = '', children, ...props }: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background'

  let variantClasses = ''
  switch (variant) {
    case 'destructive':
      variantClasses = 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
      break
    case 'outline':
      variantClasses = 'border border-input hover:bg-accent hover:text-accent-foreground'
      break
    case 'secondary':
      variantClasses = 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
      break
    case 'ghost':
      variantClasses = 'hover:bg-accent hover:text-accent-foreground'
      break
    case 'link':
      variantClasses = 'underline-offset-4 hover:underline text-primary'
      break
    default:
      variantClasses = 'bg-primary text-primary-foreground hover:bg-primary/90'
  }

  let sizeClasses = ''
  switch (size) {
    case 'sm':
      sizeClasses = 'h-9 px-3'
      break
    case 'lg':
      sizeClasses = 'h-11 px-8'
      break
    case 'icon':
      sizeClasses = 'h-10 w-10'
      break
    default:
      sizeClasses = 'h-10 py-2 px-4'
  }

  return (
    <button
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
