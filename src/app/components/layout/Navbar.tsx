import { Bell, Search, ChevronDown, Car } from "lucide-react";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router";

export function Navbar() {
  const [notifOpen, setNotifOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const notifications = [
    { id: 1, text: "New lead from Website: Rohit Sharma", time: "2 min ago", dot: "bg-blue-500" },
    { id: 2, text: "Follow-up due: Meena Patel (Brezza)", time: "15 min ago", dot: "bg-orange-500" },
    { id: 3, text: "Lead escalated: Arun Gupta (Safari)", time: "1 hr ago", dot: "bg-red-500" },
    { id: 4, text: "Test drive confirmed: Anita Desai", time: "2 hr ago", dot: "bg-green-500" },
  ];

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 h-16"
      style={{ background: "#FFFFFF", borderBottom: "1px solid #E2E8F0", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 min-w-[220px]">
        <div
          className="flex items-center justify-center w-9 h-9 rounded-xl"
          style={{ background: "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)" }}
        >
          <Car size={18} color="#fff" strokeWidth={2.2} />
        </div>
        <div>
          <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "15px", color: "#0F172A", letterSpacing: "-0.3px" }}>
            LeadDrive <span style={{ color: "#2563EB" }}>Pro</span>
          </div>
          <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "10px", color: "#94A3B8", letterSpacing: "0.5px", textTransform: "uppercase" }}>
            HSR Motors
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
              border: "1px solid #E2E8F0",
              borderRadius: "10px",
              background: "#F8FAFC",
              color: "#475569",
              outline: "none",
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

        {/* Divider */}
        <div style={{ width: "1px", height: "28px", background: "#E2E8F0" }} />

        {/* User Avatar */}
        <div className="flex items-center gap-2.5 cursor-pointer">
          <div
            className="flex items-center justify-center w-9 h-9 rounded-xl text-white"
            style={{ background: "linear-gradient(135deg, #7C3AED, #2563EB)", fontFamily: "Inter", fontSize: "12px", fontWeight: 700 }}
          >
            KR
          </div>
          <div>
            <div style={{ fontFamily: "Inter", fontSize: "12px", fontWeight: 600, color: "#0F172A" }}>Kavya Reddy</div>
            <div style={{ fontFamily: "Inter", fontSize: "10px", color: "#94A3B8" }}>Sales Manager</div>
          </div>
          <ChevronDown size={14} style={{ color: "#94A3B8" }} />
        </div>
      </div>
    </nav>
  );
}
