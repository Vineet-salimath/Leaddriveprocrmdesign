import { RouterProvider } from "react-router";
import { router } from "./routes";
import { LeadsProvider } from "./context/LeadsContext";
import "../styles/fonts.css";

export default function App() {
  return (
    <LeadsProvider>
      <RouterProvider router={router} />
    </LeadsProvider>
  );
}