import { useState } from "react";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";

export function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  return (
    <div style={{ background: "#F8FAFC", minHeight: "100vh", fontFamily: "Inter, sans-serif" }}>
      <Navbar onToggleSidebar={() => setSidebarExpanded(!sidebarExpanded)} />
      <Sidebar expanded={sidebarExpanded} />
      <main style={{ 
        marginLeft: sidebarExpanded ? "260px" : "80px", 
        marginTop: "64px", 
        minHeight: "calc(100vh - 64px)",
        transition: "margin-left 0.3s ease-in-out"
      }}>
        {children}
      </main>
    </div>
  );
}
