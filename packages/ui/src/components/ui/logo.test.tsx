import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Logo } from './logo'

describe('Logo', () => {
  it('renders with default props', () => {
    render(<Logo />)
    expect(screen.getByText('A')).toBeInTheDocument()
    expect(screen.getByText('Amy')).toBeInTheDocument()
  })

  it('renders without text when showText is false', () => {
    render(<Logo showText={false} />)
    expect(screen.getByText('A')).toBeInTheDocument()
    expect(screen.queryByText('Amy')).not.toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(<Logo className="custom-logo" />)
    expect(screen.getByText('A').closest('div')).toHaveClass('custom-logo')
  })
})
