import { RouterProvider } from "react-router";
import { router } from "./routes";
import { LeadsProvider } from "./context/LeadsContext";
import { UserProvider } from "./context/UserContext";
import "../styles/fonts.css";

export default function App() {
  return (
    <UserProvider>
      <LeadsProvider>
        <RouterProvider router={router} />
      </LeadsProvider>
    </UserProvider>
  );
}