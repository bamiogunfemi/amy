import {
  Users,
  UserCheck,
  Calendar,
  Search,
  BarChart3,
  Briefcase,
} from "lucide-react";

export const NAVIGATION_ITEMS = [
  { id: "overview", label: "Overview", icon: BarChart3 },
  { id: "candidates", label: "Candidates", icon: Users },
  { id: "pipeline", label: "Pipeline", icon: Briefcase },
  { id: "search", label: "Search", icon: Search },
] as const;

export const METRIC_CARDS = [
  {
    key: "totalCandidates",
    label: "Total Candidates",
    icon: Users,
    color: "from-blue-500 to-blue-600",
    change: "+20.1% from last month",
    changeColor: "text-green-600",
  },
  {
    key: "activeApplications",
    label: "Active Applications",
    icon: UserCheck,
    color: "from-green-500 to-green-600",
    change: "+5.2% from last week",
    changeColor: "text-green-600",
  },
  {
    key: "interviewsScheduled",
    label: "Interviews Scheduled",
    icon: Calendar,
    color: "from-purple-500 to-purple-600",
    change: "This week",
    changeColor: "text-purple-600",
  },
  {
    key: "offersExtended",
    label: "Offers Extended",
    icon: Briefcase,
    color: "from-orange-500 to-orange-600",
    change: "This month",
    changeColor: "text-orange-600",
  },
] as const;
