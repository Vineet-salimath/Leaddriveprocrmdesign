import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: "#F8FAFC", minHeight: "100vh", fontFamily: "Inter, sans-serif" }}>
      <Navbar />
      <Sidebar />
      <main style={{ marginLeft: "220px", marginTop: "64px", minHeight: "calc(100vh - 64px)" }}>
        {children}
      </main>
    </div>
  );
}
