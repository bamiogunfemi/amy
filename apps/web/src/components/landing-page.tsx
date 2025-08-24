
import { Button, Logo } from '@amy/ui'
import { ArrowRight } from 'lucide-react'
import { NAV_LINKS, FEATURES, PRICING_PLANS, FOOTER_LINKS } from '../constants'
import type { FeatureCardProps, PricingCardProps, FooterSectionProps } from '../types'

const NavLink = ({ href, label }: { href: string; label: string }) => (
  <a href={href} className="text-muted-foreground hover:text-foreground transition-colors">
    {label}
  </a>
)

const FeatureCard = ({ icon: Icon, title, description }: FeatureCardProps) => (
  <div className="bg-background p-6 rounded-lg border">
    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
      <Icon className="h-6 w-6 text-primary" />
    </div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </div>
)

const PricingCard = ({ name, price, period, features, cta, variant, popular }: PricingCardProps) => (
  <div className={`bg-background p-8 rounded-lg border ${popular ? 'border-primary' : ''}`}>
    <h3 className="text-2xl font-bold mb-2">{name}</h3>
    <div className="text-3xl font-bold mb-4">
      {price}<span className="text-lg text-muted-foreground">{period}</span>
    </div>
    <ul className="space-y-3 mb-8">
      {features.map((feature, index) => (
        <li key={index} className="flex items-center">
          <span className="w-2 h-2 bg-primary rounded-full mr-3" />
          {feature}
        </li>
      ))}
    </ul>
    <Button variant={variant} className="w-full" asChild>
      <a href={`${import.meta.env.VITE_DASHBOARD_URL}/signup`}>{cta}</a>
    </Button>
  </div>
)

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

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Logo />

          </div>
          <nav className="hidden md:flex items-center space-x-8">
            {NAV_LINKS.map((link, index) => (
              <NavLink key={index} {...link} />
            ))}
          </nav>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <a href={`${import.meta.env.VITE_DASHBOARD_URL}/login`}>Sign In</a>
            </Button>
            <Button asChild>
              <a href={`${import.meta.env.VITE_DASHBOARD_URL}/signup`}>Get Started</a>
            </Button>
          </div>
        </div>
      </header>

      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Modern Recruitment
            <br />
            <span className="text-muted-foreground">Made Simple</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            A minimalist recruitment platform with strict isolation, dual tenancy,
            and comprehensive import capabilities for modern recruiters.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <a href={`${import.meta.env.VITE_DASHBOARD_URL}/signup`}>
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a href="#features">Learn More</a>
            </Button>
          </div>
        </div>
      </section>

      <section id="features" className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything you need to manage candidates
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Built for recruiters who value simplicity, security, and efficiency.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURES.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-xl text-muted-foreground">
              Start free, scale as you grow.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {PRICING_PLANS.map((plan, index) => (
              <PricingCard key={index} {...plan} />
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <Logo size="sm" />
              <p className="text-muted-foreground mt-4">
                Modern recruitment platform for forward-thinking recruiters.
              </p>
            </div>

            {FOOTER_LINKS.map((section, index) => (
              <FooterSection key={index} {...section} />
            ))}
          </div>

          <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 Amy. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
