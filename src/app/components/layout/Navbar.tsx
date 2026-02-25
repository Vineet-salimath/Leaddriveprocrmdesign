import { Bell, Search, ChevronDown, Menu, LogOut, User } from "lucide-react";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { useUser } from "../../context/UserContext";

export function Navbar({ onToggleSidebar }: { onToggleSidebar: () => void }) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, allUsers, switchUser } = useUser();

  const notifications = [
    { id: 1, text: "New lead from Website: Rohit Sharma", time: "2 min ago", dot: "bg-blue-500" },
    { id: 2, text: "Follow-up due: Meena Patel (Brezza)", time: "15 min ago", dot: "bg-orange-500" },
    { id: 3, text: "Lead escalated: Arun Gupta (Safari)", time: "1 hr ago", dot: "bg-red-500" },
    { id: 4, text: "Test drive confirmed: Anita Desai", time: "2 hr ago", dot: "bg-green-500" },
  ];

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 h-16 backdrop-blur-xl"
      style={{ background: "rgba(255, 255, 255, 0.95)", borderBottom: "1px solid #DDD6FE", boxShadow: "0 8px 24px rgba(99,102,241,0.08)" }}
    >
      {/* Hamburger + Dealynx Branding */}
      <div className="flex items-center gap-0 min-w-[260px]">
        <button
          onClick={onToggleSidebar}
          className="flex items-center justify-center w-9 h-9 rounded-lg transition-colors hover:bg-slate-100"
          style={{ color: "#475569" }}
        >
          <Menu size={20} strokeWidth={1.8} />
        </button>
        <div className="ml-3">
          <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: "22px", letterSpacing: "-1.2px", lineHeight: "1" }}>
            <span 
              style={{ 
                background: "linear-gradient(135deg, #F59E0B 0%, #EC4899 35%, #8B5CF6 65%, #6366F1 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                textShadow: "0 0 30px rgba(245, 158, 11, 0.15)",
                filter: "drop-shadow(0 2px 8px rgba(245, 158, 11, 0.1))",
                display: "block",
              }}
            >
              Dealynx
            </span>
          </div>
          <div style={{ fontFamily: "Poppins, Inter, sans-serif", fontWeight: 600, fontSize: "9px", color: "#F59E0B", letterSpacing: "1.2px", textTransform: "uppercase", marginTop: "2px", fontStyle: "italic" }}>
            Premium Motors
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="flex-1 max-w-md mx-8">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#94A3B8" }} />
          <input
            type="text"
            placeholder="Search leads, contacts, cars..."
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "13px",
              width: "100%",
              paddingLeft: "36px",
              paddingRight: "12px",
              paddingTop: "8px",
              paddingBottom: "8px",
              border: "1px solid #DDD6FE",
              borderRadius: "10px",
              background: "#F8F7FF",
              color: "#0A0E27",
              outline: "none",
              transition: "all 0.3s ease",
            }}
            onFocus={(e) => {
              e.currentTarget.style.background = "#FFFFFF";
              e.currentTarget.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.1)";
              e.currentTarget.style.borderColor = "#6366F1";
            }}
            onBlur={(e) => {
              e.currentTarget.style.background = "#F8F7FF";
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.borderColor = "#DDD6FE";
            }}
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative flex items-center justify-center w-9 h-9 rounded-xl transition-colors"
            style={{ background: notifOpen ? "#EFF6FF" : "#F8FAFC", border: "1px solid #E2E8F0" }}
          >
            <Bell size={17} style={{ color: "#475569" }} />
            <span
              className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 rounded-full text-white"
              style={{ background: "#EF4444", fontFamily: "Inter", fontSize: "10px", fontWeight: 600 }}
            >
              4
            </span>
          </button>
          {notifOpen && (
            <div
              className="absolute right-0 top-12 w-80 rounded-xl overflow-hidden z-50"
              style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", boxShadow: "0 8px 32px rgba(0,0,0,0.12)" }}
            >
              <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                <span style={{ fontFamily: "Inter", fontSize: "13px", fontWeight: 600, color: "#0F172A" }}>Notifications</span>
                <span style={{ fontFamily: "Inter", fontSize: "11px", color: "#2563EB", fontWeight: 500, cursor: "pointer" }}>Mark all read</span>
              </div>
              {notifications.map((n) => (
                <div key={n.id} className="px-4 py-3 flex items-start gap-3 hover:bg-slate-50 transition-colors cursor-pointer border-b border-slate-50">
                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${n.dot}`} />
                  <div>
                    <div style={{ fontFamily: "Inter", fontSize: "12px", color: "#334155", lineHeight: "1.4" }}>{n.text}</div>
                    <div style={{ fontFamily: "Inter", fontSize: "11px", color: "#94A3B8", marginTop: "2px" }}>{n.time}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl transition-colors"
            style={{ background: userMenuOpen ? "#EFF6FF" : "#F8FAFC", border: "1px solid #E2E8F0" }}
          >
            <div
              className="flex items-center justify-center w-7 h-7 rounded-lg text-white text-xs font-bold"
              style={{ background: "linear-gradient(135deg, #7C3AED, #2563EB)" }}
            >
              {currentUser.avatar}
            </div>
            <ChevronDown size={14} style={{ color: "#64748B" }} />
          </button>
          {userMenuOpen && (
            <div
              className="absolute right-0 top-12 rounded-xl overflow-hidden z-50"
              style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", boxShadow: "0 8px 32px rgba(0,0,0,0.12)", minWidth: "280px" }}
              onClick={() => setUserMenuOpen(false)}
            >
              {/* Current User */}
              <div className="px-4 py-3" style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0" }}>
                <div style={{ fontFamily: "Inter", fontSize: "11px", fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px" }}>Current User</div>
                <div className="flex items-center gap-2.5">
                  <div
                    className="flex items-center justify-center w-8 h-8 rounded-lg text-white text-xs font-bold"
                    style={{ background: "linear-gradient(135deg, #7C3AED, #2563EB)" }}
                  >
                    {currentUser.avatar}
                  </div>
                  <div>
                    <div style={{ fontFamily: "Inter", fontSize: "12px", fontWeight: 600, color: "#0F172A" }}>{currentUser.name}</div>
                    <div style={{ fontFamily: "Inter", fontSize: "10px", color: "#94A3B8" }}>{currentUser.role}</div>
                  </div>
                </div>
              </div>

              {/* User List */}
              <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                <div style={{ fontFamily: "Inter", fontSize: "11px", fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.5px", padding: "8px 12px" }}>Switch User</div>
                {allUsers.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => switchUser(user.id)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition-colors text-left"
                    style={{
                      background: currentUser.id === user.id ? "#EFF6FF" : "transparent",
                      borderLeft: currentUser.id === user.id ? "3px solid #2563EB" : "3px solid transparent"
                    }}
                  >
                    <div
                      className="flex items-center justify-center w-8 h-8 rounded-lg text-white text-xs font-bold flex-shrink-0"
                      style={{ background: "linear-gradient(135deg, #7C3AED, #2563EB)" }}
                    >
                      {user.avatar}
                    </div>
                    <div className="flex-1">
                      <div style={{ fontFamily: "Inter", fontSize: "12px", fontWeight: 600, color: "#0F172A" }}>{user.name}</div>
                      <div style={{ fontFamily: "Inter", fontSize: "10px", color: "#94A3B8" }}>{user.role}</div>
                    </div>
                    {currentUser.id === user.id && (
                      <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#2563EB" }} />
                    )}
                  </button>
                ))}
              </div>

              {/* Actions */}
              <div style={{ borderTop: "1px solid #E2E8F0", padding: "8px" }}>
                <button
                  className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg hover:bg-red-50 transition-colors"
                  style={{ fontFamily: "Inter", fontSize: "12px", fontWeight: 500, color: "#EF4444", textAlign: "left" }}
                >
                  <LogOut size={14} />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
