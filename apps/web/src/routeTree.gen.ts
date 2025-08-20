import { createRootRoute, createRoute } from "@tanstack/react-router";
import { LandingPage } from "@/components/landing-page";

const rootRoute = createRootRoute();

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: LandingPage,
});

export const routeTree = rootRoute.addChildren([indexRoute]);
