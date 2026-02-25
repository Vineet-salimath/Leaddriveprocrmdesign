import { LayoutDashboard, Users, Kanban } from "lucide-react";
import { useNavigate, useLocation } from "react-router";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Leads", icon: Users, path: "/" },
  { label: "Lead Management", icon: Kanban, path: "/kanban" },
];

export function Sidebar({ expanded }: { expanded: boolean }) {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname === path) return true;
    if (path === "/kanban" && location.pathname === "/kanban") return true;
    return false;
  };

  return (
    <aside
      className="fixed top-16 left-0 bottom-0 flex flex-col z-40 transition-all duration-300"
      style={{
        width: expanded ? "260px" : "80px",
        background: "#FFFFFF",
        borderRight: "1px solid #DDD6FE",
        paddingTop: "24px"
      }}
    >
      <div className="flex-1 px-4 overflow-y-auto">
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left w-full group"
                style={{
                  background: active ? "rgba(99, 102, 241, 0.1)" : "transparent",
                  color: active ? "#6366F1" : "#64748B",
                  fontFamily: "Inter, sans-serif",
                  fontSize: "13px",
                  fontWeight: active ? 600 : 400,
                }}
                title={!expanded ? item.label : ""}
              >
                {/* Left indicator bar */}
                {active && (
                  <div
                    className="absolute left-0 top-0 bottom-0 rounded-r-lg transition-all"
                    style={{ width: "4px", background: "#6366F1" }}
                  />
                )}
                
                <Icon size={18} strokeWidth={active ? 2 : 1.8} />
                
                {expanded && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
