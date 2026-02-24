import { useState, useRef, useEffect } from "react";
import { Layout } from "../components/layout/Layout";
import { LeadStatus } from "../data/leads";
import { useLeads } from "../context/LeadsContext";
import { AddLeadModal } from "../components/AddLeadModal";
import { MiniSparkline } from "../components/MiniSparkline";
import {
  Plus, Filter, Download, MoreHorizontal, Eye,
  Edit2, Search, SlidersHorizontal, CalendarDays,
  TrendingUp, Users, Star, Trash2, ChevronDown, CheckCircle,
  X, AlertTriangle
} from "lucide-react";
import { useNavigate } from "react-router";

const statusColors: Record<LeadStatus, { bg: string; text: string; dot: string }> = {
  "New":        { bg: "#EFF6FF", text: "#1D4ED8", dot: "#3B82F6" },
  "Contacted":  { bg: "#FFF7ED", text: "#C2410C", dot: "#F97316" },
  "Qualified":  { bg: "#F0FDF4", text: "#15803D", dot: "#22C55E" },
  "Test Drive": { bg: "#F5F3FF", text: "#6D28D9", dot: "#8B5CF6" },
  "Closed Won": { bg: "#F0FDF4", text: "#065F46", dot: "#10B981" },
  "Lost":       { bg: "#FEF2F2", text: "#B91C1C", dot: "#EF4444" },
};

const sourceColors: Record<string, { bg: string; text: string }> = {
  "Website":      { bg: "#EFF6FF", text: "#2563EB" },
  "Referral":     { bg: "#FDF4FF", text: "#9333EA" },
  "Walk-in":      { bg: "#F0FDF4", text: "#16A34A" },
  "Social Media": { bg: "#FFF7ED", text: "#EA580C" },
  "Phone":        { bg: "#F8FAFC", text: "#475569" },
  "Auto Expo":    { bg: "#FFF1F2", text: "#E11D48" },
};

const STATUS_OPTIONS: LeadStatus[] = ["New", "Contacted", "Qualified", "Test Drive", "Closed Won", "Lost"];

// Mini sparkline data per KPI (last 6 weeks)
const kpiSparklines: Record<string, number[]> = {
  "Total Leads":    [98, 112, 105, 124, 138, 148],
  "Hot Leads":      [18, 22, 19, 27, 31, 34],
  "Follow-ups Due": [22, 18, 25, 20, 16, 18],
  "Avg Lead Score": [72, 74, 71, 75, 74, 76],
};

function StatusDropdown({
  current, onSelect, onClose,
}: { current: LeadStatus; onSelect: (s: LeadStatus) => void; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="absolute top-8 left-0 rounded-xl z-30 overflow-hidden"
      style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", boxShadow: "0 8px 24px rgba(0,0,0,0.12)", width: "160px" }}
    >
      <div className="px-3 py-2 border-b border-slate-100">
        <span style={{ fontFamily: "Inter", fontSize: "11px", fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.5px" }}>Change Status</span>
      </div>
      {STATUS_OPTIONS.map((s) => {
        const sc = statusColors[s];
        return (
          <button
            key={s}
            onClick={() => { onSelect(s); onClose(); }}
            className="w-full flex items-center gap-2 px-3 py-2.5 hover:bg-slate-50 transition-colors"
          >
            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: sc.dot }} />
            <span style={{ fontFamily: "Inter", fontSize: "12px", fontWeight: s === current ? 600 : 400, color: s === current ? "#2563EB" : "#475569" }}>{s}</span>
            {s === current && <CheckCircle size={12} className="ml-auto" style={{ color: "#2563EB" }} />}
          </button>
        );
      })}
    </div>
  );
}

function DeleteConfirm({ name, onConfirm, onCancel }: { name: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(15,23,42,0.4)", backdropFilter: "blur(3px)" }}
    >
      <div
        className="rounded-2xl p-6 text-center"
        style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", boxShadow: "0 16px 48px rgba(0,0,0,0.14)", width: "380px" }}
      >
        <div className="flex items-center justify-center w-12 h-12 rounded-full mx-auto mb-4" style={{ background: "#FEF2F2" }}>
          <AlertTriangle size={22} style={{ color: "#EF4444" }} />
        </div>
        <h3 style={{ fontFamily: "Inter", fontWeight: 700, fontSize: "16px", color: "#0F172A", margin: "0 0 8px" }}>Delete Lead?</h3>
        <p style={{ fontFamily: "Inter", fontSize: "13px", color: "#64748B", margin: "0 0 20px" }}>
          Are you sure you want to delete <strong style={{ color: "#0F172A" }}>{name}</strong>? This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl"
            style={{ border: "1px solid #E2E8F0", fontFamily: "Inter", fontSize: "13px", fontWeight: 500, color: "#475569" }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl text-white"
            style={{ background: "#EF4444", fontFamily: "Inter", fontSize: "13px", fontWeight: 600 }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export function LeadListing() {
  const navigate = useNavigate();
  const { leads, updateLead, deleteLead } = useLeads();

  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [sourceFilter, setSourceFilter] = useState<string>("All");
  const [searchText, setSearchText] = useState("");
  const [actionMenuId, setActionMenuId] = useState<string | null>(null);
  const [statusEditId, setStatusEditId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeKpi, setActiveKpi] = useState<string | null>(null);

  // Dynamic KPI values from live data
  const today = new Date().toISOString().split("T")[0];
  const hotLeads = leads.filter((l) => l.leadScore >= 75).length;
  const followUpsDue = leads.filter((l) => l.followUpDate <= today && !["Closed Won", "Lost"].includes(l.status)).length;
  const avgScore = leads.length > 0 ? (leads.reduce((s, l) => s + l.leadScore, 0) / leads.length).toFixed(1) : "0";

  const kpiCards = [
    { label: "Total Leads",    value: String(leads.length), change: "+12 today", color: "#2563EB", bg: "#EFF6FF", icon: Users,        filterKey: "all" },
    { label: "Hot Leads",      value: String(hotLeads),    change: "Score ≥ 75",  color: "#F97316", bg: "#FFF7ED", icon: TrendingUp,   filterKey: "hot" },
    { label: "Follow-ups Due", value: String(followUpsDue),change: "Action needed",color:"#8B5CF6", bg: "#F5F3FF", icon: CalendarDays, filterKey: "followup" },
    { label: "Avg Lead Score", value: avgScore,            change: "+2.1 pts",    color: "#10B981", bg: "#ECFDF5", icon: Star,         filterKey: "score" },
  ];

  // KPI card click filtering logic
  const handleKpiClick = (filterKey: string) => {
    if (activeKpi === filterKey) {
      setActiveKpi(null);
      setStatusFilter("All");
      setSearchText("");
      return;
    }
    setActiveKpi(filterKey);
    setSearchText("");
    if (filterKey === "all") {
      setStatusFilter("All");
    } else if (filterKey === "hot") {
      setStatusFilter("All");
      // will apply extra filter below
    } else if (filterKey === "followup") {
      setStatusFilter("All");
    } else if (filterKey === "score") {
      setStatusFilter("All");
    }
  };

  const filtered = leads
    .filter((l) => {
      const matchStatus = statusFilter === "All" || l.status === statusFilter;
      const matchSource = sourceFilter === "All" || l.source === sourceFilter;
      const matchSearch = !searchText ||
        l.name.toLowerCase().includes(searchText.toLowerCase()) ||
        l.carInterest.toLowerCase().includes(searchText.toLowerCase()) ||
        l.phone.includes(searchText);

      let matchKpi = true;
      if (activeKpi === "hot") matchKpi = l.leadScore >= 75;
      if (activeKpi === "followup") matchKpi = l.followUpDate <= today && !["Closed Won", "Lost"].includes(l.status);

      return matchStatus && matchSource && matchSearch && matchKpi;
    })
    .sort((a, b) => activeKpi === "score" ? b.leadScore - a.leadScore : 0);

  const deleteTarget = deleteId ? leads.find((l) => l.id === deleteId) : null;

  return (
    <Layout>
      <div className="p-6" onClick={() => { setActionMenuId(null); setStatusEditId(null); }}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 style={{ fontFamily: "Inter", fontWeight: 700, fontSize: "22px", color: "#0F172A", margin: 0 }}>Leads</h1>
            <p style={{ fontFamily: "Inter", fontSize: "13px", color: "#64748B", marginTop: "2px" }}>
              {leads.length} total leads · Click a KPI card to filter instantly
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-xl transition-colors"
              style={{ border: "1px solid #E2E8F0", background: "#FFFFFF", fontFamily: "Inter", fontSize: "13px", fontWeight: 500, color: "#475569" }}
            >
              <Download size={14} />
              Export CSV
            </button>
            <button
              onClick={() => navigate("/kanban")}
              className="flex items-center gap-2 px-4 py-2 rounded-xl"
              style={{ background: "#EFF6FF", fontFamily: "Inter", fontSize: "13px", fontWeight: 500, color: "#2563EB", border: "1px solid #BFDBFE" }}
            >
              <SlidersHorizontal size={14} />
              Kanban View
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-5 py-2 rounded-xl text-white transition-opacity hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)", fontFamily: "Inter", fontSize: "13px", fontWeight: 600, boxShadow: "0 2px 8px rgba(37,99,235,0.3)" }}
            >
              <Plus size={15} />
              Add Lead
            </button>
          </div>
        </div>

        {/* KPI Cards — clickable with sparklines */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {kpiCards.map((kpi) => {
            const Icon = kpi.icon;
            const isActive = activeKpi === kpi.filterKey;
            const sparkData = kpiSparklines[kpi.label] || [];
            return (
              <button
                key={kpi.label}
                onClick={(e) => { e.stopPropagation(); handleKpiClick(kpi.filterKey); }}
                className="rounded-xl p-4 text-left transition-all"
                style={{
                  background: isActive ? kpi.color : "#FFFFFF",
                  border: `1.5px solid ${isActive ? kpi.color : "#E2E8F0"}`,
                  boxShadow: isActive ? `0 4px 16px ${kpi.color}30` : "0 1px 4px rgba(0,0,0,0.05)",
                  transform: isActive ? "translateY(-2px)" : "none",
                  cursor: "pointer",
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div
                    className="flex items-center justify-center w-9 h-9 rounded-xl"
                    style={{ background: isActive ? "rgba(255,255,255,0.2)" : kpi.bg }}
                  >
                    <Icon size={16} style={{ color: isActive ? "#FFFFFF" : kpi.color }} />
                  </div>
                  {isActive ? (
                    <span style={{ fontFamily: "Inter", fontSize: "10px", fontWeight: 600, color: "rgba(255,255,255,0.8)", background: "rgba(255,255,255,0.15)", padding: "2px 8px", borderRadius: "20px" }}>
                      Filtering ✓
                    </span>
                  ) : (
                    <span style={{ fontFamily: "Inter", fontSize: "11px", color: "#10B981", fontWeight: 500, background: "#F0FDF4", padding: "2px 8px", borderRadius: "20px" }}>
                      {kpi.change}
                    </span>
                  )}
                </div>
                <div style={{ fontFamily: "Inter", fontSize: "24px", fontWeight: 700, color: isActive ? "#FFFFFF" : "#0F172A" }}>{kpi.value}</div>
                <div style={{ fontFamily: "Inter", fontSize: "12px", color: isActive ? "rgba(255,255,255,0.8)" : "#64748B", marginTop: "2px", marginBottom: "8px" }}>{kpi.label}</div>
                {/* Mini Sparkline */}
                <div style={{ opacity: 0.7 }}>
                  <MiniSparkline data={sparkData} color={isActive ? "#FFFFFF" : kpi.color} width={100} height={24} />
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Filter Banner */}
        {activeKpi && activeKpi !== "all" && (
          <div
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl mb-4"
            style={{ background: "#EFF6FF", border: "1px solid #BFDBFE" }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            <span style={{ fontFamily: "Inter", fontSize: "12px", fontWeight: 500, color: "#1D4ED8" }}>
              Showing {filtered.length} leads · Filtered by:{" "}
              <strong>{activeKpi === "hot" ? "Hot Leads (Score ≥ 75)" : activeKpi === "followup" ? "Follow-ups Due Today" : "Sorted by Lead Score"}</strong>
            </span>
            <button
              onClick={() => { setActiveKpi(null); setStatusFilter("All"); }}
              className="ml-auto flex items-center gap-1"
              style={{ fontFamily: "Inter", fontSize: "12px", color: "#2563EB", fontWeight: 500 }}
            >
              <X size={12} /> Clear filter
            </button>
          </div>
        )}

        {/* Filters */}
        <div
          className="rounded-xl p-4 mb-5 flex items-center gap-4 flex-wrap"
          style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex-1 min-w-48 relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#94A3B8" }} />
            <input
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search name, car, phone..."
              style={{
                fontFamily: "Inter", fontSize: "13px", width: "100%",
                paddingLeft: "34px", paddingRight: "12px", paddingTop: "8px", paddingBottom: "8px",
                border: "1px solid #E2E8F0", borderRadius: "10px", background: "#F8FAFC",
                color: "#475569", outline: "none"
              }}
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span style={{ fontFamily: "Inter", fontSize: "12px", color: "#94A3B8", fontWeight: 500 }}>Status:</span>
            {["All", "New", "Contacted", "Qualified", "Test Drive", "Closed Won", "Lost"].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className="px-3 py-1.5 rounded-lg transition-all"
                style={{
                  fontFamily: "Inter", fontSize: "12px", fontWeight: statusFilter === s ? 600 : 400,
                  background: statusFilter === s ? "#2563EB" : "#F1F5F9",
                  color: statusFilter === s ? "#FFFFFF" : "#64748B", border: "none"
                }}
              >
                {s}
              </button>
            ))}
          </div>
          <div style={{ width: "1px", height: "28px", background: "#E2E8F0" }} />
          <div className="flex items-center gap-2">
            <span style={{ fontFamily: "Inter", fontSize: "12px", color: "#94A3B8", fontWeight: 500 }}>Source:</span>
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              style={{ fontFamily: "Inter", fontSize: "12px", padding: "6px 10px", border: "1px solid #E2E8F0", borderRadius: "8px", background: "#F8FAFC", color: "#475569", outline: "none", cursor: "pointer" }}
            >
              <option>All</option>
              {["Website","Referral","Walk-in","Social Media","Phone","Auto Expo"].map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <button
            className="flex items-center gap-2 px-3 py-2 rounded-lg"
            style={{ border: "1px solid #E2E8F0", background: "#F8FAFC", fontFamily: "Inter", fontSize: "12px", color: "#475569" }}
          >
            <Filter size={13} /> More Filters
          </button>
        </div>

        {/* Table */}
        <div
          className="rounded-xl overflow-hidden"
          style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div
            className="grid items-center px-5 py-3"
            style={{ gridTemplateColumns: "2fr 1.3fr 1.8fr 1fr 1.2fr 1.2fr 1fr 100px", background: "#F8FAFC", borderBottom: "1px solid #E2E8F0" }}
          >
            {["Name & Contact","Phone","Car Interest","Source","Status ↕","Assigned To","Follow-up","Actions"].map((h) => (
              <div key={h} style={{ fontFamily: "Inter", fontSize: "11px", fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                {h}
              </div>
            ))}
          </div>

          {/* Rows */}
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center py-16">
              <Users size={32} style={{ color: "#CBD5E1" }} />
              <p style={{ fontFamily: "Inter", fontSize: "14px", color: "#94A3B8", marginTop: "12px" }}>No leads match your filters</p>
              <button
                onClick={() => { setStatusFilter("All"); setSourceFilter("All"); setSearchText(""); setActiveKpi(null); }}
                className="mt-3 px-4 py-2 rounded-xl"
                style={{ background: "#EFF6FF", color: "#2563EB", fontFamily: "Inter", fontSize: "12px", fontWeight: 600 }}
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            filtered.map((lead, idx) => {
              const sc = statusColors[lead.status];
              const src = sourceColors[lead.source] || { bg: "#F8FAFC", text: "#475569" };
              const isOverdue = lead.followUpDate < today && !["Closed Won","Lost"].includes(lead.status);
              return (
                <div
                  key={lead.id}
                  className="grid items-center px-5 py-4 hover:bg-blue-50/30 transition-colors cursor-pointer relative"
                  style={{
                    gridTemplateColumns: "2fr 1.3fr 1.8fr 1fr 1.2fr 1.2fr 1fr 100px",
                    borderBottom: idx < filtered.length - 1 ? "1px solid #F1F5F9" : "none",
                  }}
                  onClick={() => navigate(`/lead/${lead.id}`)}
                >
                  {/* Name */}
                  <div className="flex items-center gap-3">
                    <div
                      className="flex items-center justify-center w-9 h-9 rounded-xl flex-shrink-0 text-white"
                      style={{ background: `hsl(${(lead.id.charCodeAt(3) * 47) % 360}, 60%, 50%)`, fontFamily: "Inter", fontSize: "12px", fontWeight: 700 }}
                    >
                      {lead.avatar}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span style={{ fontFamily: "Inter", fontSize: "13px", fontWeight: 600, color: "#0F172A" }}>{lead.name}</span>
                        {lead.leadScore >= 80 && (
                          <span style={{ fontSize: "10px" }}>🔥</span>
                        )}
                      </div>
                      <div style={{ fontFamily: "Inter", fontSize: "11px", color: "#94A3B8", marginTop: "1px" }}>{lead.email}</div>
                    </div>
                  </div>

                  {/* Phone */}
                  <div style={{ fontFamily: "Inter", fontSize: "12px", color: "#475569" }}>{lead.phone}</div>

                  {/* Car Interest */}
                  <div>
                    <div style={{ fontFamily: "Inter", fontSize: "12px", fontWeight: 500, color: "#334155" }}>{lead.carInterest}</div>
                    <div style={{ fontFamily: "Inter", fontSize: "11px", color: "#94A3B8", marginTop: "1px" }}>{lead.budget}</div>
                  </div>

                  {/* Source */}
                  <div>
                    <span className="px-2 py-1 rounded-lg" style={{ background: src.bg, color: src.text, fontFamily: "Inter", fontSize: "11px", fontWeight: 500 }}>
                      {lead.source}
                    </span>
                  </div>

                  {/* Status — click to change inline */}
                  <div className="relative" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => setStatusEditId(statusEditId === lead.id ? null : lead.id)}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg w-fit transition-all hover:opacity-80 group"
                      style={{ background: sc.bg, fontFamily: "Inter", fontSize: "11px", fontWeight: 600, color: sc.text }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: sc.dot }} />
                      {lead.status}
                      <ChevronDown size={10} className="ml-0.5 opacity-50 group-hover:opacity-100" />
                    </button>
                    {statusEditId === lead.id && (
                      <StatusDropdown
                        current={lead.status}
                        onSelect={(s) => updateLead(lead.id, { status: s })}
                        onClose={() => setStatusEditId(null)}
                      />
                    )}
                  </div>

                  {/* Assigned To */}
                  <div className="flex items-center gap-2">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-white flex-shrink-0"
                      style={{ background: "#2563EB", fontFamily: "Inter", fontSize: "10px", fontWeight: 700 }}
                    >
                      {lead.assignedTo.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <span style={{ fontFamily: "Inter", fontSize: "12px", color: "#475569" }}>{lead.assignedTo.split(" ")[0]}</span>
                  </div>

                  {/* Follow-up */}
                  <div className="flex items-center gap-1">
                    {isOverdue && <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 bg-red-500" />}
                    <span style={{ fontFamily: "Inter", fontSize: "12px", color: isOverdue ? "#EF4444" : "#475569", fontWeight: isOverdue ? 600 : 400 }}>
                      {new Date(lead.followUpDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <button
                      className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-blue-50"
                      onClick={() => navigate(`/lead/${lead.id}`)}
                      title="View Details"
                    >
                      <Eye size={13} style={{ color: "#2563EB" }} />
                    </button>
                    <button
                      className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-red-50"
                      title="Delete Lead"
                      onClick={() => setDeleteId(lead.id)}
                    >
                      <Trash2 size={13} style={{ color: "#EF4444" }} />
                    </button>
                    <div className="relative">
                      <button
                        className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-slate-100"
                        onClick={() => setActionMenuId(actionMenuId === lead.id ? null : lead.id)}
                      >
                        <MoreHorizontal size={13} style={{ color: "#64748B" }} />
                      </button>
                      {actionMenuId === lead.id && (
                        <div
                          className="absolute right-0 top-8 w-40 rounded-xl z-20 overflow-hidden"
                          style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", boxShadow: "0 4px 16px rgba(0,0,0,0.1)" }}
                        >
                          {[
                            { label: "View Details", action: () => navigate(`/lead/${lead.id}`) },
                            { label: "Mark as Won", action: () => updateLead(lead.id, { status: "Closed Won" }) },
                            { label: "Mark as Lost", action: () => updateLead(lead.id, { status: "Lost" }) },
                            { label: "Schedule Follow-up", action: () => {} },
                          ].map((item) => (
                            <button
                              key={item.label}
                              className="w-full text-left px-3 py-2.5 hover:bg-slate-50 transition-colors"
                              style={{ fontFamily: "Inter", fontSize: "12px", color: item.label === "Mark as Lost" ? "#EF4444" : item.label === "Mark as Won" ? "#10B981" : "#475569" }}
                              onClick={() => { item.action(); setActionMenuId(null); }}
                            >
                              {item.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4 px-1">
          <span style={{ fontFamily: "Inter", fontSize: "12px", color: "#94A3B8" }}>
            Showing <strong style={{ color: "#334155" }}>{filtered.length}</strong> of <strong style={{ color: "#334155" }}>{leads.length}</strong> leads
          </span>
          <div className="flex items-center gap-1">
            {[1, 2, 3, "...", 8].map((p, i) => (
              <button
                key={i}
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{
                  fontFamily: "Inter", fontSize: "13px",
                  background: p === 1 ? "#2563EB" : "#F8FAFC",
                  color: p === 1 ? "#FFFFFF" : "#64748B",
                  border: "1px solid", borderColor: p === 1 ? "#2563EB" : "#E2E8F0"
                }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showAddModal && <AddLeadModal onClose={() => setShowAddModal(false)} />}
      {deleteTarget && (
        <DeleteConfirm
          name={deleteTarget.name}
          onConfirm={() => { deleteLead(deleteId!); setDeleteId(null); }}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </Layout>
  );
}
