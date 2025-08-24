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
        onError={(e) => {
          console.error('Failed to load logo:', e);
          // Fallback to text if image fails
          e.currentTarget.style.display = 'none';
          e.currentTarget.nextElementSibling?.classList.remove('hidden');
        }}
      />
      <span className={`${sizeClasses[size]} font-bold text-slate-900 hidden`}>
        Amy
      </span>
    </div>
  )
}
