import { cn } from '../../lib/utils'

interface LogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
}

export function Logo({ className, size = 'md', showText = true }: LogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  }

  const textSizes = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-xl'
  }

  return (
    <div className={cn('flex items-center space-x-3', className)}>
      <div className={cn(
        'bg-gradient-to-br from-rose-500 to-rose-600 rounded-xl flex items-center justify-center shadow-lg',
        sizeClasses[size]
      )}>
        <span className="text-white font-bold text-lg">A</span>
      </div>
      {showText && (
        <div>
          <h1 className={cn(
            'font-bold bg-gradient-to-r from-rose-600 to-rose-800 bg-clip-text text-transparent',
            textSizes[size]
          )}>
            Amy
          </h1>
          <p className="text-xs text-slate-500">Recruitment Platform</p>
        </div>
      )}
    </div>
  )
}
