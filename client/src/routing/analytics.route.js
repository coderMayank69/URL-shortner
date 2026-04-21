import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./routeTree.js";
import AnalyticsPage from "../pages/AnalyticsPage";
import { checkAuth } from "../utils/helper";

export const analyticsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/analytics/$urlId",
  component: AnalyticsPage,
  beforeLoad: checkAuth,  // Reuse the existing auth guard
});
