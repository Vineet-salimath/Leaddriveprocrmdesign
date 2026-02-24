import { LayoutDashboard, Users, CheckSquare, BarChart2, Settings, Kanban, ChevronRight, Zap } from "lucide-react";
import { useNavigate, useLocation } from "react-router";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Leads", icon: Users, path: "/" },
  { label: "Kanban", icon: Kanban, path: "/kanban" },
  { label: "Lead Details", icon: ChevronRight, path: "/lead/L001" },
  { label: "Tasks", icon: CheckSquare, path: "/tasks" },
  { label: "Reports", icon: BarChart2, path: "/reports" },
  { label: "Settings", icon: Settings, path: "/settings" },
];

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside
      className="fixed top-16 left-0 bottom-0 flex flex-col z-40"
      style={{ width: "220px", background: "#FFFFFF", borderRight: "1px solid #E2E8F0" }}
    >
      <div className="flex-1 px-3 py-5 overflow-y-auto">
        {/* Nav Group */}
        <div className="mb-6">
          <div style={{ fontFamily: "Inter, sans-serif", fontSize: "10px", fontWeight: 600, color: "#94A3B8", letterSpacing: "0.8px", textTransform: "uppercase", paddingLeft: "8px", marginBottom: "6px" }}>
            Main Menu
          </div>
          <nav className="flex flex-col gap-1">
            {navItems.slice(0, 3).map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || (item.path === "/" && location.pathname === "/");
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left w-full"
                  style={{
                    background: isActive ? "#EFF6FF" : "transparent",
                    color: isActive ? "#2563EB" : "#64748B",
                    fontFamily: "Inter, sans-serif",
                    fontSize: "13px",
                    fontWeight: isActive ? 600 : 400,
                  }}
                >
                  <Icon size={16} strokeWidth={isActive ? 2.2 : 1.8} />
                  <span>{item.label}</span>
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background: "#2563EB" }} />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Quick Access */}
        <div className="mb-6">
          <div style={{ fontFamily: "Inter, sans-serif", fontSize: "10px", fontWeight: 600, color: "#94A3B8", letterSpacing: "0.8px", textTransform: "uppercase", paddingLeft: "8px", marginBottom: "6px" }}>
            Quick Access
          </div>
          <nav className="flex flex-col gap-1">
            {navItems.slice(3, 4).map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname.startsWith("/lead");
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left w-full"
                  style={{
                    background: isActive ? "#EFF6FF" : "transparent",
                    color: isActive ? "#2563EB" : "#64748B",
                    fontFamily: "Inter, sans-serif",
                    fontSize: "13px",
                    fontWeight: isActive ? 600 : 400,
                  }}
                >
                  <Users size={16} strokeWidth={1.8} />
                  <span>Lead Details</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* System */}
        <div>
          <div style={{ fontFamily: "Inter, sans-serif", fontSize: "10px", fontWeight: 600, color: "#94A3B8", letterSpacing: "0.8px", textTransform: "uppercase", paddingLeft: "8px", marginBottom: "6px" }}>
            System
          </div>
          <nav className="flex flex-col gap-1">
            {navItems.slice(4).map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left w-full"
                  style={{
                    background: isActive ? "#EFF6FF" : "transparent",
                    color: isActive ? "#2563EB" : "#64748B",
                    fontFamily: "Inter, sans-serif",
                    fontSize: "13px",
                    fontWeight: isActive ? 600 : 400,
                  }}
                >
                  <Icon size={16} strokeWidth={1.8} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="px-3 py-4 border-t border-slate-100">
        <div
          className="p-3 rounded-xl"
          style={{ background: "linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)", border: "1px solid #BFDBFE" }}
        >
          <div className="flex items-center gap-2 mb-1.5">
            <Zap size={14} style={{ color: "#2563EB" }} />
            <span style={{ fontFamily: "Inter", fontSize: "12px", fontWeight: 600, color: "#1D4ED8" }}>AI Assistant</span>
          </div>
          <p style={{ fontFamily: "Inter", fontSize: "11px", color: "#3B82F6", lineHeight: "1.4" }}>
            Get smart follow-up suggestions
          </p>
          <button
            className="mt-2 w-full py-1.5 rounded-lg text-white transition-opacity hover:opacity-90"
            style={{ background: "#2563EB", fontFamily: "Inter", fontSize: "11px", fontWeight: 600 }}
          >
            Try Now
          </button>
        </div>
      </div>
    </aside>
  );
}
