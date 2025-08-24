import {
  Plus,
  Upload,
  Briefcase,
  BarChart3,
  Users,
  UserCheck,
  Calendar,
  CheckCircle,
  FileText
} from 'lucide-react'

export interface QuickAction {
  title: string
  description: string
  icon: any
  href?: string
  onClick?: () => void
  color: 'blue' | 'green' | 'purple' | 'orange'
}

export const QUICK_ACTIONS: QuickAction[] = [
  {
    title: 'New Candidate',
    description: 'Add a new candidate to your pool',
    icon: Plus,
    href: '/candidates/new',
    color: 'blue'
  },
  {
    title: 'Upload CV(s)',
    description: 'Upload and parse candidate documents',
    icon: Upload,
    color: 'green'
  },
  {
    title: 'New Job',
    description: 'Create a new job posting',
    icon: Briefcase,
    color: 'purple'
  },
  {
    title: 'View Pipeline',
    description: 'Manage your recruitment pipeline',
    icon: BarChart3,
    href: '/pipeline',
    color: 'orange'
  }
]

export const METRICS = [
  {
    key: 'totalCandidates',
    title: 'Total Candidates',
    icon: Users
  },
  {
    key: 'activeApplications',
    title: 'Active Applications',
    icon: UserCheck
  },
  {
    key: 'interviewsScheduled',
    title: 'Interviews Scheduled',
    icon: Calendar
  },
  {
    key: 'offersExtended',
    title: 'Offers Extended',
    icon: CheckCircle
  }
]

export const NAVIGATION_CARDS: QuickAction[] = [
  {
    title: 'Candidates',
    description: 'Manage your candidate pool',
    icon: Users,
    href: '/candidates',
    color: 'blue'
  },
  {
    title: 'Jobs',
    description: 'Manage job postings',
    icon: Briefcase,
    href: '/jobs',
    color: 'purple'
  },
  {
    title: 'Search',
    description: 'Find candidates and skills',
    icon: FileText,
    href: '/search',
    color: 'green'
  }
]
