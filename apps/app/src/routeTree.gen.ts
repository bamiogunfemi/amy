import { createRootRoute, createRoute } from "@tanstack/react-router";
import { DashboardPage } from "@/routes/dashboard";
import { LoginPage } from "@/routes/login";
import { SignupPage } from "@/routes/signup";
import { ResetPasswordPage } from "@/routes/reset-password";
import { CandidatesPage } from "@/routes/candidates";
import { PipelinePage } from "@/routes/pipeline";
import { SearchPage } from "@/routes/search";
import { JobsPage } from "@/routes/jobs";
import { ProfilePage } from "@/routes/profile";
import { ImportPage } from "@/routes/import";
import { CommunicationsPage } from "@/routes/communications";
import { NotificationsPage } from "@/routes/notifications";
import { SettingsPage } from "@/routes/settings";

const rootRoute = createRootRoute();

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: DashboardPage,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
});

const signupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/signup",
  component: SignupPage,
});

const resetPasswordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/reset-password",
  component: ResetPasswordPage,
});

const candidatesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/candidates",
  component: CandidatesPage,
});

const pipelineRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/pipeline",
  component: PipelinePage,
});

const searchRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/search",
  component: SearchPage,
});

const jobsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/jobs",
  component: JobsPage,
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile",
  component: ProfilePage,
});

const importRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/import",
  component: ImportPage,
});

const communicationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/communications",
  component: CommunicationsPage,
});

const notificationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/notifications",
  component: NotificationsPage,
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/settings",
  component: SettingsPage,
});

export const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  signupRoute,
  resetPasswordRoute,
  candidatesRoute,
  pipelineRoute,
  searchRoute,
  jobsRoute,
  profileRoute,
  importRoute,
  communicationsRoute,
  notificationsRoute,
  settingsRoute,
]);
