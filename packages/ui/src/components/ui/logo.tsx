interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function Logo({ size = 'md', className = '' }: LogoProps) {
  const sizeClasses = {
    sm: 'h-6',
    md: 'h-8',
    lg: 'h-10'
  }

  return (
    <div className={`flex items-center ${className}`}>
      <img
        src="/amy-logo-light.svg"
        alt="Amy"
        className={sizeClasses[size]}
      />
    </div>
  )
}
