
import { Button, Logo } from '@amy/ui'
import { ArrowRight, Users, Upload, Search, BarChart3, CheckCircle } from 'lucide-react'
import { FOOTER_LINKS, PRICING_PLANS } from '../constants'
import type { FooterSectionProps } from '../types'

import { PageLayout } from './layout'

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

export const PrivacyPolicy = () => (
  <PageLayout showHomeLink>
    <main className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>

      <div className="prose prose-gray max-w-none">
        <p className="text-lg text-gray-600 mb-8">
          Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
          <p className="text-gray-600 mb-4">
            Amy (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) respects your privacy and is committed to protecting your personal data.
            This privacy policy will inform you about how we look after your personal data when you visit our website
            and tell you about your privacy rights and how the law protects you.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Information We Collect</h2>
          <h3 className="text-xl font-medium text-gray-900 mb-2">Personal Data</h3>
          <ul className="text-gray-600 mb-4 list-disc pl-6">
            <li>Name and contact information</li>
            <li>Email address and phone number</li>
            <li>Account credentials</li>
            <li>Company information</li>
          </ul>

          <h3 className="text-xl font-medium text-gray-900 mb-2">Candidate Data</h3>
          <ul className="text-gray-600 mb-4 list-disc pl-6">
            <li>Resume and application information</li>
            <li>Contact details and professional information</li>
            <li>Skills and experience data</li>
            <li>Communication history</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. How We Use Your Information</h2>
          <ul className="text-gray-600 mb-4 list-disc pl-6">
            <li>To provide and maintain our recruitment platform</li>
            <li>To process and manage candidate data</li>
            <li>To communicate with you about our services</li>
            <li>To improve our platform and develop new features</li>
            <li>To comply with legal obligations</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Data Security</h2>
          <p className="text-gray-600 mb-4">
            We implement appropriate technical and organizational measures to protect your personal data against
            unauthorized access, alteration, disclosure, or destruction. This includes:
          </p>
          <ul className="text-gray-600 mb-4 list-disc pl-6">
            <li>Encryption of data in transit and at rest</li>
            <li>Regular security audits and assessments</li>
            <li>Access controls and authentication mechanisms</li>
            <li>Employee training on data protection</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Data Sharing and Third Parties</h2>
          <p className="text-gray-600 mb-4">
            We do not sell, trade, or otherwise transfer your personal data to third parties, except in the following circumstances:
          </p>
          <ul className="text-gray-600 mb-4 list-disc pl-6">
            <li>With your explicit consent</li>
            <li>To comply with legal obligations</li>
            <li>With trusted service providers who assist our operations</li>
            <li>In connection with a business transfer or acquisition</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Your Rights</h2>
          <p className="text-gray-600 mb-4">You have the right to:</p>
          <ul className="text-gray-600 mb-4 list-disc pl-6">
            <li>Access your personal data</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Object to processing of your data</li>
            <li>Request data portability</li>
            <li>Withdraw consent at any time</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Contact Us</h2>
          <p className="text-gray-600 mb-4">
            If you have any questions about this Privacy Policy, please contact us at:
          </p>
          <p className="text-gray-600">
            Email: privacy@amyrecruit.com<br />
            Address: [Your Business Address]
          </p>
        </section>
      </div>
    </main>
  </PageLayout>
)

export const TermsOfService = () => (
  <PageLayout showHomeLink>
    <main className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>

      <div className="prose prose-gray max-w-none">
        <p className="text-lg text-gray-600 mb-8">
          Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
          <p className="text-gray-600 mb-4">
            By accessing and using Amy (&quot;the Service&quot;), you accept and agree to be bound by the terms and provision
            of this agreement. If you do not agree to abide by the above, please do not use this service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Description of Service</h2>
          <p className="text-gray-600 mb-4">
            Amy is a recruitment platform that provides tools for managing candidates, streamlining hiring processes,
            and organizing recruitment workflows. Our service includes candidate database management, pipeline tracking,
            import/export functionality, and collaboration tools.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. User Accounts</h2>
          <p className="text-gray-600 mb-4">
            To access certain features of the Service, you must create an account. You are responsible for:
          </p>
          <ul className="text-gray-600 mb-4 list-disc pl-6">
            <li>Maintaining the confidentiality of your account credentials</li>
            <li>All activities that occur under your account</li>
            <li>Notifying us immediately of any unauthorized use</li>
            <li>Ensuring your account information is accurate and up to date</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Acceptable Use</h2>
          <p className="text-gray-600 mb-4">You agree not to use the Service to:</p>
          <ul className="text-gray-600 mb-4 list-disc pl-6">
            <li>Violate any applicable laws or regulations</li>
            <li>Infringe on the rights of others</li>
            <li>Upload malicious code or harmful content</li>
            <li>Attempt to gain unauthorized access to our systems</li>
            <li>Use the service for any illegal or fraudulent activity</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Data Ownership and Privacy</h2>
          <p className="text-gray-600 mb-4">
            You retain ownership of all data you upload to the Service. We respect your privacy and handle your data
            in accordance with our Privacy Policy. We implement industry-standard security measures to protect your data.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Service Availability</h2>
          <p className="text-gray-600 mb-4">
            We strive to maintain high availability of the Service but do not guarantee uninterrupted access.
            We reserve the right to perform maintenance, updates, or temporary suspension of the service with reasonable notice.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Limitation of Liability</h2>
          <p className="text-gray-600 mb-4">
            To the maximum extent permitted by law, Amy shall not be liable for any indirect, incidental, special,
            consequential, or punitive damages arising from your use of the service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Termination</h2>
          <p className="text-gray-600 mb-4">
            Either party may terminate this agreement at any time. Upon termination, you will lose access to the Service
            and we may delete your data in accordance with our data retention policies.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Changes to Terms</h2>
          <p className="text-gray-600 mb-4">
            We reserve the right to modify these terms at any time. We will notify users of significant changes
            via email or through the Service. Continued use after changes constitutes acceptance of the new terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Contact Information</h2>
          <p className="text-gray-600 mb-4">
            If you have any questions about these Terms of Service, please contact us at:
          </p>
          <p className="text-gray-600">
            Email: legal@amyrecruit.com<br />
            Address: [Your Business Address]
          </p>
        </section>
      </div>
    </main>
  </PageLayout>
)

const FeatureCard = ({ icon: Icon, title, description }: { icon: React.ComponentType<{ className?: string }>; title: string; description: string }) => (
  <div className="bg-white p-6 rounded-lg border border-gray-200">
    <div className="w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center mb-4">
      <Icon className="h-5 w-5 text-rose-600" />
    </div>
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
)

const PricingCard = ({ plan }: { plan: typeof PRICING_PLANS[number] }) => (
  <div className={`bg-white p-6 rounded-lg border ${plan.popular ? 'border-rose-600 ring-2 ring-rose-600' : 'border-gray-200'} relative`}>
    {plan.popular && (
      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
        <span className="bg-rose-600 text-white px-3 py-1 rounded-full text-sm font-medium">Most popular</span>
      </div>
    )}
    <div className="text-center">
      <h3 className="text-lg font-semibold mb-2">{plan.name}</h3>
      <div className="mb-4">
        <span className="text-3xl font-bold">{plan.price}</span>
        <span className="text-gray-600">{plan.period}</span>
      </div>
      <ul className="space-y-2 mb-6">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-center gap-2 text-sm">
            <CheckCircle className="h-4 w-4 text-rose-600 flex-shrink-0" />
            {feature}
          </li>
        ))}
      </ul>
      <Button
        className={`w-full ${plan.popular ? 'bg-rose-600 hover:bg-rose-700' : ''}`}
        variant={plan.variant}
        asChild
      >
        <a href={`${import.meta.env.VITE_DASHBOARD_URL}/signup`}>{plan.cta}</a>
      </Button>
    </div>
  </div>
)

export function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50/40 via-white to-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Logo />
          </div>
          <div />
          <div className="flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <a href={`${import.meta.env.VITE_DASHBOARD_URL}/login`}>Sign In</a>
            </Button>
            <Button className="bg-rose-600 hover:bg-rose-700" asChild>
              <a href={`${import.meta.env.VITE_DASHBOARD_URL}/signup`}>Get Started</a>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-24 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 text-gray-900 mx-auto max-w-4xl">
            Recruitment made <span className="text-rose-600">simple</span> for modern teams.
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Streamline your hiring process with intelligent candidate matching, seamless data imports, and powerful pipeline management.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-rose-600 hover:bg-rose-700" asChild>
              <a href={`${import.meta.env.VITE_DASHBOARD_URL}/signup`}>
                Start your free trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button variant="outline" size="lg" className="border-gray-300" asChild>
              <a href="#features">Watch video</a>
            </Button>
          </div>
        </div>
      </section>
      {/* <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3 text-gray-900">Simplify everyday recruitment tasks.</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Because you&apos;d probably be a little confused if we suggested you complicate your everyday recruitment tasks instead.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <FeatureCard
              icon={BarChart3}
              title="Reporting"
              description="Stay on top of things with always up-to-date reporting features. We talked about reporting in the section above but we needed three items here, so mentioning it one more time for posterity."
            />
            <FeatureCard
              icon={Shield}
              title="Candidate Screening"
              description="Never lose track of who you've screened with accurate candidate tracking. We don't offer this as part of our software but that statement is inarguably true."
            />
            <FeatureCard
              icon={Users}
              title="Team Collaboration"
              description="Organize all of your team members and their tasks in one place. This also isn't actually a feature, it's just some friendly advice."
            />
          </div>
        </div>
      </section> */}
      {/* <section className="py-20 px-4 bg-rose-600">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-white">Get started today</h2>
          <p className="text-lg text-rose-100 mb-8 max-w-3xl mx-auto">
            It&apos;s time to take control of your recruitment process. Build our software so you can feel like you&apos;re doing something productive.
          </p>
          <Button size="lg" className="bg-white text-rose-600 hover:bg-gray-100" asChild>
            <a href={`${import.meta.env.VITE_DASHBOARD_URL}/signup`}>Get 6 months free</a>
          </Button>
        </div>
      </section> */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3 text-gray-900">Everything you need to manage talent.</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Powerful tools designed to make recruitment efficient, organized, and data-driven from day one.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <FeatureCard
              icon={Users}
              title="Candidate Management"
              description="Centralize all candidate profiles with detailed tracking, notes, and communication history in one unified dashboard."
            />
            <FeatureCard
              icon={Upload}
              title="Multi-Source Imports"
              description="Import candidates seamlessly from LinkedIn, Indeed, Google Sheets, Airtable, and other sources with intelligent data mapping."
            />
            <FeatureCard
              icon={Search}
              title="Smart Search & Filtering"
              description="Find the perfect candidates instantly with advanced filters, keyword search, and AI-powered candidate matching."
            />
            <FeatureCard
              icon={BarChart3}
              title="Visual Pipeline Management"
              description="Track candidates through your entire hiring process with customizable stages, drag-and-drop functionality, and real-time updates."
            />
          </div>


        </div>
      </section>






      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3 text-gray-900">Simple pricing, for everyone.</h2>
            <p className="text-lg text-gray-600">
              Choose the plan that fits your hiring needs and scale as you grow.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {PRICING_PLANS.map((plan) => (
              <PricingCard key={plan.name} plan={plan} />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3 text-gray-900">Frequently asked questions</h2>
            <p className="text-lg text-gray-600">
              Everything you need to know about getting started with Amy.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold mb-2">How does Amy handle data security and privacy?</h3>
              <p className="text-gray-600">We take data security seriously. All candidate information is encrypted and stored securely. We comply with GDPR and other privacy regulations to protect both your candidates&apos; data and your company&apos;s information.</p>
            </div>

            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold mb-2">What makes Amy different from other recruitment software?</h3>
              <p className="text-gray-600">Amy focuses on making recruitment data-driven and efficient. Our smart matching algorithms help you find the best candidates faster, while our flexible pipeline management adapts to your unique hiring process.</p>
            </div>

            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold mb-2">Can I customize the hiring pipeline to match our process?</h3>
              <p className="text-gray-600">Absolutely. Amy allows you to create custom pipeline stages, add your own evaluation criteria, and configure the system to match your specific hiring workflow and organizational needs.</p>
            </div>

            <div className="pb-6">
              <h3 className="text-lg font-semibold mb-2">How quickly can we get started?</h3>
              <p className="text-gray-600">You can start using Amy immediately with our free trial. Import your existing candidates, set up your pipeline, and begin recruiting more effectively within minutes. Our setup wizard guides you through the entire process.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
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
}
