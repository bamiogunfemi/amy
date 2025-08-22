import * as React from 'react'

type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline'

type BadgeProps = React.ComponentProps<'span'> & { variant?: BadgeVariant }

export function Badge({ variant = 'default', className = '', ...props }: BadgeProps) {
  let variantClasses = ''
  switch (variant) {
    case 'destructive':
      variantClasses = 'border-transparent bg-red-600 text-white'
      break
    case 'secondary':
      variantClasses = 'border-transparent bg-zinc-200 text-zinc-900'
      break
    case 'outline':
      variantClasses = 'border-zinc-200 bg-transparent text-zinc-900'
      break
    default:
      variantClasses = 'border-transparent bg-zinc-900 text-zinc-50'
  }
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${variantClasses} ${className}`}
      {...props}
    />
  )
}
