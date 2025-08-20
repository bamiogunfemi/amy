import React from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">A</span>
            </div>
            <span className="text-xl font-semibold">Amy</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <a href="/login">Sign In</a>
            </Button>
            <Button asChild>
              <a href="/signup">Get Started</a>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Recruit Smarter, Not Harder
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            A minimalist recruitment platform with strict isolation, dual tenancy,
            and comprehensive import capabilities for modern recruiters.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <a href="/signup">Start Free Trial</a>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a href="#features">Learn More</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Amy?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Dual Tenancy</CardTitle>
                <CardDescription>
                  Solo recruiter or company mode with strict data isolation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Isolated candidate pools</li>
                  <li>• No PII leakage between recruiters</li>
                  <li>• Admin controls and monitoring</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Multi-Import Support</CardTitle>
                <CardDescription>
                  Import candidates from multiple sources seamlessly
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Google Drive integration</li>
                  <li>• Airtable & Google Sheets</li>
                  <li>• CSV/Excel file uploads</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Smart Features</CardTitle>
                <CardDescription>
                  AI-powered resume parsing and intelligent search
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Automatic skill extraction</li>
                  <li>• Full-text search with PostgreSQL</li>
                  <li>• Custom pipeline management</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Simple Pricing</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Free Trial</CardTitle>
                <CardDescription>14 days, no credit card required</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-4">$0</div>
                <ul className="space-y-2 text-sm mb-6">
                  <li>• Up to 200 candidates</li>
                  <li>• Basic search & filtering</li>
                  <li>• Resume parsing</li>
                  <li>• Email support</li>
                </ul>
                <Button className="w-full" variant="outline" asChild>
                  <a href="/signup">Start Trial</a>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-primary">
              <CardHeader>
                <CardTitle>Starter</CardTitle>
                <CardDescription>Perfect for individual recruiters</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-4">$29<span className="text-lg text-muted-foreground">/month</span></div>
                <ul className="space-y-2 text-sm mb-6">
                  <li>• Up to 1,000 candidates</li>
                  <li>• Advanced search & filters</li>
                  <li>• Import integrations</li>
                  <li>• Pipeline management</li>
                </ul>
                <Button className="w-full" asChild>
                  <a href="/signup">Get Started</a>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Professional</CardTitle>
                <CardDescription>For teams and companies</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-4">$79<span className="text-lg text-muted-foreground">/month</span></div>
                <ul className="space-y-2 text-sm mb-6">
                  <li>• Up to 5,000 candidates</li>
                  <li>• Team collaboration</li>
                  <li>• Advanced analytics</li>
                  <li>• Priority support</li>
                </ul>
                <Button className="w-full" variant="outline" asChild>
                  <a href="/signup">Get Started</a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            © 2024 Amy. Built with ❤️ for modern recruiters.
          </p>
        </div>
      </footer>
    </div>
  )
}
