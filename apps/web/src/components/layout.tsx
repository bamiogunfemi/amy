import { ReactNode } from 'react'
import { Button, Logo } from '@amy/ui'
import { FOOTER_LINKS } from '../constants'
import type { FooterSectionProps } from '../types'

const FooterSection = ({ title, links }: FooterSectionProps) => (
  <div>
    <h4 className="font-semibold mb-4">{title}</h4>
    <ul className="space-y-2 text-muted-foreground">
      {links.map((link, index) => (
        <li key={index}>
          <a href={link.href} className="hover:text-foreground transition-colors">
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  </div>
)

interface PageLayoutProps {
  children: ReactNode
  showHomeLink?: boolean
}

export const PageLayout = ({ children, showHomeLink = false }: PageLayoutProps) => (
  <div className="min-h-screen bg-gradient-to-b from-rose-50/40 via-white to-white">
    <header className="border-b border-gray-200">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Logo />
        </div>
        <div className="flex items-center space-x-4">
          {showHomeLink && (
            <Button variant="ghost" asChild>
              <a href="/">Home</a>
            </Button>
          )}
        </div>
      </div>
    </header>

    {children}

    <footer className="border-t border-gray-200 py-12 px-4">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <Logo size="sm" />
            <p className="text-gray-600 mt-4">Talent Intelligence Workspace for modern recruiters.</p>
          </div>

          {FOOTER_LINKS.map((section, index) => (
            <FooterSection key={index} {...section} />
          ))}
        </div>

        <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-600">
          <p>&copy; 2024 Amy. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
)
