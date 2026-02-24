import { createBrowserRouter } from "react-router";
import { LeadListing } from "./pages/LeadListing";
import { LeadDetails } from "./pages/LeadDetails";
import { LeadManagement } from "./pages/LeadManagement";
import { Dashboard } from "./pages/Dashboard";

export const router = createBrowserRouter([
  { path: "/", Component: LeadListing },
  { path: "/lead/:id", Component: LeadDetails },
  { path: "/kanban", Component: LeadManagement },
  { path: "/dashboard", Component: Dashboard },
  { path: "*", Component: LeadListing },
]);
