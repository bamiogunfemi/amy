import {
  Users,
  Building2,
  UserCheck,
  Settings,
  BarChart3,
  CreditCard,
  Tag,
  ArrowRightLeft,
  History,
  Database,
} from "lucide-react";

export const NAVIGATION_ITEMS = [
  { id: "overview", label: "Overview", icon: BarChart3 },
  { id: "users", label: "Users", icon: Users },
  { id: "companies", label: "Companies", icon: Building2 },
  { id: "billing", label: "Billing & Trials", icon: CreditCard },
  { id: "skills", label: "Skills", icon: Tag },
  { id: "assignments", label: "Assignments", icon: ArrowRightLeft },
  { id: "imports", label: "Imports", icon: Database },
  { id: "audit", label: "Audit", icon: History },
  { id: "settings", label: "Settings", icon: Settings },
] as const;

export const METRIC_CARDS = [
  {
    key: "totalUsers",
    label: "Total Users",
    icon: Users,
    color: "text-rose-600",
  },
  {
    key: "totalCandidates",
    label: "Total Candidates",
    icon: UserCheck,
    color: "text-rose-600",
  },
  {
    key: "totalCompanies",
    label: "Total Companies",
    icon: Building2,
    color: "text-rose-600",
  },
  {
    key: "activeTrials",
    label: "Active Trials",
    icon: CreditCard,
    color: "text-rose-600",
  },
] as const;

