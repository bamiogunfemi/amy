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
        src="./amy-logo-light.svg"
        alt="Amy"
        className={sizeClasses[size]}
        onError={(e) => {
          console.error('Failed to load logo:', e);
          e.currentTarget.style.display = 'none';
          e.currentTarget.nextElementSibling?.classList.remove('hidden');
        }}
        onLoad={() => {
          console.log('Logo loaded successfully');
        }}
      />
      <span className="text-xl font-bold bg-gradient-to-r from-[#e01d4b] to-rose-800 bg-clip-text text-transparent hidden"> Amy </span>
    </div>
  )
}
