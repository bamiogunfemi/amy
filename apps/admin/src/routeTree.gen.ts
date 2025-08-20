import { createRootRoute, createRoute } from "@tanstack/react-router";
import { AdminDashboard } from "./components/admin-dashboard";
import { AdminLoginPage } from "./routes/login";

const rootRoute = createRootRoute();

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: AdminDashboard,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: AdminLoginPage,
});

export const routeTree = rootRoute.addChildren([indexRoute, loginRoute]);
