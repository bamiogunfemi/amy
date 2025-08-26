
import { Button, Logo } from '@amy/ui'
import { ArrowRight, Sparkles, FileSpreadsheet, Table, FileDown, Shuffle } from 'lucide-react'
import { FOOTER_LINKS } from '../constants'
import type { FooterSectionProps } from '../types'

const Section = ({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) => (
  <section className="py-20 px-4">
    <div className="container mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-3">{title}</h2>
        {subtitle && <p className="text-lg text-muted-foreground max-w-3xl mx-auto">{subtitle}</p>}
      </div>
      {children}
    </div>
  </section>
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
          <div />
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

      <section className="py-24 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
            <span className="bg-gradient-to-r from-[#e01d4b] to-rose-800 bg-clip-text text-transparent">Amy</span>
            <span className="ml-3">Talent Intelligence Workspace</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Build lists from anywhere. Know who’s best, instantly. Pipelines that stick.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <a href={`${import.meta.env.VITE_DASHBOARD_URL}/signup`}>
                Recruiter Signup
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a href="#proof">See Proof</a>
            </Button>
          </div>
        </div>
      </section>

      <Section title="Build lists from anywhere" subtitle="Manual, CSV upload, Google Sheets, Airtable, or your database.">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[{ icon: Sparkles, label: 'Manual' }, { icon: FileDown, label: 'CSV Upload' }, { icon: FileSpreadsheet, label: 'Google Sheets' }, { icon: Table, label: 'Airtable' }].map(({ icon: Icon, label }) => (
            <div key={label} className="bg-background p-6 rounded-lg border flex items-center gap-4">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <div className="text-left">
                <p className="font-medium">{label}</p>
                <p className="text-sm text-muted-foreground">Map columns → create candidates</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Know who’s best, instantly" subtitle="Claimed vs actual YOE, skill gaps, and a transparent match score per job.">
        <div className="grid md:grid-cols-3 gap-5">
          <div className="rounded-xl border bg-background p-5 shadow-sm hover:shadow-md transition">
            <div className="w-9 h-9 rounded-md bg-primary/10 text-primary flex items-center justify-center mb-3">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none"><path d="M12 3v18M3 12h18" stroke="currentColor" strokeWidth="2" /></svg>
            </div>
            <h3 className="text-base font-semibold mb-1.5">Claimed vs Actual YOE</h3>
            <p className="text-sm text-muted-foreground">Infer years from work history and dedupe overlaps for a fair, consistent view.</p>
          </div>
          <div className="rounded-xl border bg-background p-5 shadow-sm hover:shadow-md transition">
            <div className="w-9 h-9 rounded-md bg-primary/10 text-primary flex items-center justify-center mb-3">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none"><rect x="4" y="5" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="2" /><path d="M8 9h8M8 13h5" stroke="currentColor" strokeWidth="2" /></svg>
            </div>
            <h3 className="text-base font-semibold mb-1.5">Skill gaps</h3>
            <p className="text-sm text-muted-foreground">Compare JD skills vs candidate skills and highlight what’s missing at a glance.</p>
          </div>
          <div className="rounded-xl border bg-background p-5 shadow-sm hover:shadow-md transition">
            <div className="w-9 h-9 rounded-md bg-primary/10 text-primary flex items-center justify-center mb-3">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" /><path d="M12 12l5-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
            </div>
            <h3 className="text-base font-semibold mb-1.5">Match score</h3>
            <p className="text-sm text-muted-foreground">Weighted score (skills, YOE, education) that you can tune per tenant.</p>
          </div>
        </div>
      </Section>

      <Section title="Pipelines that stick" subtitle="Drag and drop persists to your backend instantly.">
        <div className="bg-background p-5 rounded-xl border shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shuffle className="h-5 w-5 text-primary" />
            <p className="text-sm text-muted-foreground">Move candidates between stages with optimistic updates and rollback.</p>
          </div>
          <Button variant="outline" className="shadow-sm" asChild>
            <a href={`${import.meta.env.VITE_DASHBOARD_URL}/pipeline`}>View Pipeline</a>
          </Button>
        </div>
      </Section>

      <Section title="Proof" subtitle="Metrics that matter to recruiters and hiring managers." >
        <div id="proof" className="grid md:grid-cols-3 gap-5">
          {[{ t: 'Time to Stage', d: 'Median days from applied to interview.' }, { t: 'Source Quality', d: 'Per‑source conversion to interview/offer.' }, { t: 'Top Skills', d: 'Most common skills in your pipeline.' }].map((x) => (
            <div key={x.t} className="bg-background p-5 rounded-xl border shadow-sm">
              <h3 className="text-base font-semibold mb-1.5">{x.t}</h3>
              <p className="text-sm text-muted-foreground">{x.d}</p>
            </div>
          ))}
        </div>
      </Section>

      <footer className="border-t py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <Logo size="sm" />
              <p className="text-muted-foreground mt-4">Talent Intelligence Workspace for modern recruiters.</p>
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
