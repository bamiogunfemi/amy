import { createFileRoute } from '@tanstack/react-router'
import { LandingPage } from '@/components/landing-page'

export const routeTree = createFileRoute('/')({
  component: LandingPage,
})
