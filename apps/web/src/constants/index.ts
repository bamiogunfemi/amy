import { Users, Shield, Upload, Search, BarChart3 } from "lucide-react";

export const NAV_LINKS = [
  { href: "#features", label: "Features" },
  { href: "#pricing", label: "Pricing" },
  { href: "#contact", label: "Contact" },
] as const;

export const FEATURES = [
  {
    icon: Users,
    title: "Candidate Management",
    description:
      "Organize and track candidates with powerful search and filtering capabilities.",
  },
  {
    icon: Shield,
    title: "Strict Isolation",
    description:
      "Complete data separation between recruiters and companies with role-based access.",
  },
  {
    icon: Upload,
    title: "Multi-Source Imports",
    description:
      "Import candidates from Google Drive, Airtable, Sheets, CSV, and Excel files.",
  },
  {
    icon: Search,
    title: "Advanced Search",
    description:
      "Full-text search across candidate profiles, skills, and documents.",
  },
  {
    icon: BarChart3,
    title: "Pipeline Management",
    description:
      "Custom Kanban boards to track candidates through your recruitment process.",
  },
  {
    icon: Shield,
    title: "Admin Controls",
    description:
      "Comprehensive admin dashboard for user management and system oversight.",
  },
] as const;

export const PRICING_PLANS = [
  {
    name: "Free Trial",
    price: "$0",
    period: "/month",
    features: [
      "200 candidates",
      "300 daily imports",
      "Basic search",
      "14-day trial",
    ],
    cta: "Start Trial",
    variant: "outline" as const,
    popular: false,
  },
  {
    name: "Starter",
    price: "$29",
    period: "/month",
    features: [
      "1,000 candidates",
      "1,000 daily imports",
      "Advanced search",
      "Pipeline management",
      "Import integrations",
    ],
    cta: "Get Started",
    variant: "default" as const,
    popular: true,
  },
  {
    name: "Professional",
    price: "$79",
    period: "/month",
    features: [
      "5,000 candidates",
      "5,000 daily imports",
      "Team collaboration",
      "Advanced analytics",
      "Priority support",
    ],
    cta: "Get Started",
    variant: "outline" as const,
    popular: false,
  },
] as const;

export const FOOTER_LINKS = [
  {
    title: "Product",
    links: [
      { href: "#features", label: "Features" },
      { href: "#pricing", label: "Pricing" },
      { href: "#", label: "API" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "#", label: "About" },
      { href: "#", label: "Blog" },
      { href: "#", label: "Careers" },
    ],
  },
  {
    title: "Support",
    links: [
      { href: "#", label: "Help Center" },
      { href: "#", label: "Contact" },
      { href: "#", label: "Status" },
    ],
  },
] as const;
