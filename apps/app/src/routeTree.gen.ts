import { createRootRoute, createRoute } from "@tanstack/react-router";
import { RecruiterDashboard } from "@/components/recruiter-dashboard";
import { LoginPage } from "@/routes/login";
import { SignupPage } from "@/routes/signup";
import { ResetPasswordPage } from "@/routes/reset-password";

const rootRoute = createRootRoute();

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: RecruiterDashboard,
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

export const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  signupRoute,
  resetPasswordRoute,
]);
