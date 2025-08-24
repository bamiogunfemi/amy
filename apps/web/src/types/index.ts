import type {
  NAV_LINKS,
  FEATURES,
  PRICING_PLANS,
  FOOTER_LINKS,
} from "../constants";

export type NavLink = (typeof NAV_LINKS)[number];
export type Feature = (typeof FEATURES)[number];
export type PricingPlan = (typeof PRICING_PLANS)[number];
export type FooterSection = (typeof FOOTER_LINKS)[number];

export interface FeatureCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

export interface PricingCardProps {
  name: string;
  price: string;
  period: string;
  features: readonly string[];
  cta: string;
  variant: "default" | "outline";
  popular: boolean;
}

export interface FooterSectionProps {
  title: string;
  links: readonly { href: string; label: string }[];
}
