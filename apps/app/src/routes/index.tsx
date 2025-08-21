import { Link } from '@tanstack/react-router'
import { Button } from '@amy/ui'
import {
  Users,
  Search,
  BarChart3,
  Shield,
  Zap,
  ArrowRight,
  Star,
  Building2,
  Globe
} from 'lucide-react'

export function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-rose-500 to-rose-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-rose-600 to-rose-800 bg-clip-text text-transparent">
              Amy
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link to="/signup">
              <Button className="bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            Recruit Smarter,{' '}
            <span className="bg-gradient-to-r from-rose-500 to-rose-600 bg-clip-text text-transparent">
              Not Harder
            </span>
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Amy is the modern recruitment platform that helps you find, track, and hire the best talent.
            Built for recruiters who want to focus on what matters most.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" className="bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white px-8 py-3">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="px-8 py-3">
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">
              Everything you need to succeed
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Powerful tools designed specifically for modern recruiters
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl border border-slate-200 hover:border-rose-200 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-rose-600 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-slate-900">Smart Candidate Management</h3>
              <p className="text-slate-600">
                Organize and track candidates with intelligent tagging, notes, and status management.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-slate-200 hover:border-rose-200 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-rose-600 rounded-lg flex items-center justify-center mb-4">
                <Search className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-slate-900">Advanced Search & Filtering</h3>
              <p className="text-slate-600">
                Find the perfect candidate with powerful search across skills, experience, and more.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-slate-200 hover:border-rose-200 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-rose-600 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-slate-900">Pipeline Analytics</h3>
              <p className="text-slate-600">
                Visualize your recruitment pipeline with real-time analytics and insights.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-slate-200 hover:border-rose-200 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-rose-600 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-slate-900">Secure & Compliant</h3>
              <p className="text-slate-600">
                Enterprise-grade security with GDPR compliance and data protection.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-slate-200 hover:border-rose-200 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-rose-600 rounded-lg flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-slate-900">Lightning Fast</h3>
              <p className="text-slate-600">
                Built for speed with instant search results and real-time updates.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-slate-200 hover:border-rose-200 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-rose-600 rounded-lg flex items-center justify-center mb-4">
                <Globe className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-slate-900">Global Reach</h3>
              <p className="text-slate-600">
                Access talent from anywhere with multi-language support and global sourcing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-8 text-slate-900">
            Trusted by leading companies
          </h2>
          <div className="flex flex-wrap justify-center items-center gap-8 mb-12 opacity-60">
            <div className="flex items-center space-x-2">
              <Building2 className="h-8 w-8 text-slate-400" />
              <span className="text-lg font-semibold text-slate-600">TechCorp</span>
            </div>
            <div className="flex items-center space-x-2">
              <Building2 className="h-8 w-8 text-slate-400" />
              <span className="text-lg font-semibold text-slate-600">InnovateLab</span>
            </div>
            <div className="flex items-center space-x-2">
              <Building2 className="h-8 w-8 text-slate-400" />
              <span className="text-lg font-semibold text-slate-600">FutureWorks</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="flex items-center justify-center mb-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
              ))}
            </div>
            <p className="text-lg text-slate-700 mb-4 italic">
              "Amy has transformed our recruitment process. We've reduced time-to-hire by 40% and improved candidate quality significantly."
            </p>
            <p className="text-sm text-slate-600">
              — Sarah Johnson, Head of Talent at TechCorp
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-rose-500 to-rose-600">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Ready to transform your recruitment?
          </h2>
          <p className="text-xl text-rose-100 mb-8">
            Join thousands of recruiters who are already using Amy to find their next great hire.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" className="bg-white text-rose-600 hover:bg-slate-100 px-8 py-3">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-rose-600 px-8 py-3">
              Contact Sales
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-rose-500 to-rose-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">A</span>
                </div>
                <span className="text-xl font-bold">Amy</span>
              </div>
              <p className="text-slate-400">
                Modern recruitment platform for forward-thinking companies.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400">
            <p>&copy; 2024 Amy. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
