import { useState } from "react";
import { Layout } from "../components/layout/Layout";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, Cell
} from "recharts";
import {
  Users, TrendingUp, DollarSign, Clock, ArrowUpRight, ArrowDownRight,
  Brain, Target, Zap, Star, Trophy, ChevronRight,
  CheckCircle
} from "lucide-react";
import { leadsBySource, monthlyTrend, salesReps } from "../data/leads";
import { useLeads } from "../context/LeadsContext";
import { MiniSparkline } from "../components/MiniSparkline";
import { useNavigate } from "react-router";

const aiInsights = [
  {
    icon: Zap,
    title: "Follow-up Alert",
    desc: "6 leads have no activity in 24+ hours. Auto-escalation triggered for Arjun Singh's leads.",
    color: "#F97316",
    bg: "#FFF7ED",
    border: "#FED7AA",
    action: "View Leads",
  },
  {
    icon: TrendingUp,
    title: "Top Opportunity",
    desc: "Arun Gupta (Tata Safari, ₹26L) has a lead score of 85 and hasn't been contacted today.",
    color: "#2563EB",
    bg: "#EFF6FF",
    border: "#BFDBFE",
    action: "Contact Now",
  },
  {
    icon: Brain,
    title: "AI Prediction",
    desc: "Based on behavior patterns, 8 leads in Qualified stage have 70%+ probability of closing this week.",
    color: "#8B5CF6",
    bg: "#F5F3FF",
    border: "#DDD6FE",
    action: "See Predictions",
  },
  {
    icon: Star,
    title: "Performance Tip",
    desc: "Kavya Reddy's response time of 12 min is driving 35% conversion. Share this practice team-wide.",
    color: "#10B981",
    bg: "#ECFDF5",
    border: "#A7F3D0",
    action: "View Report",
  },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "10px", padding: "10px 14px", boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}>
        <p style={{ fontFamily: "Inter", fontSize: "12px", fontWeight: 600, color: "#0F172A", marginBottom: "4px" }}>{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} style={{ fontFamily: "Inter", fontSize: "11px", color: p.color, margin: "2px 0" }}>
            {p.name}: <strong>{p.value}</strong>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

function FunnelBar({ stage, count, color, maxCount }: { stage: string; count: number; color: string; maxCount: number }) {
  const pct = (count / maxCount) * 100;
  const labels: Record<string, string> = {
    "Total Leads": "148", "Contacted": "112 (76%)", "Qualified": "74 (50%)", "Test Drive": "46 (31%)", "Closed Won": "46 (31%)"
  };
  return (
    <div className="flex items-center gap-3 mb-3">
      <div style={{ width: "90px", fontFamily: "Inter", fontSize: "11px", fontWeight: 500, color: "#64748B", textAlign: "right", flexShrink: 0 }}>
        {stage}
      </div>
      <div style={{ flex: 1, height: "28px", background: "#F1F5F9", borderRadius: "8px", overflow: "hidden" }}>
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            background: color,
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            paddingLeft: "10px",
            transition: "width 0.5s ease"
          }}
        >
          <span style={{ fontFamily: "Inter", fontSize: "11px", fontWeight: 600, color: pct > 30 ? "#FFFFFF" : "#334155" }}>
            {labels[stage] || count}
          </span>
        </div>
      </div>
    </div>
  );
}

export function Dashboard() {
  const navigate = useNavigate();
  const { leads } = useLeads();
  const [expandedKpi, setExpandedKpi] = useState<string | null>(null);
  const [selectedKpi, setSelectedKpi] = useState<string | null>(null);
  const [hoveredKpi, setHoveredKpi] = useState<string | null>(null);

  // Dynamic KPI values
  const today = new Date().toISOString().split("T")[0];
  const newToday   = leads.filter((l) => l.createdAt === today).length;
  const closedWon  = leads.filter((l) => l.status === "Closed Won");
  const convRate   = leads.length > 0 ? ((closedWon.length / leads.length) * 100).toFixed(1) : "0";
  const totalRevRaw = leads.filter(l => l.status === "Closed Won").reduce((s, l) => {
    const m = l.budget.match(/₹(\d+)/);
    return s + (m ? parseInt(m[1]) : 0);
  }, 0);

  const kpis = [
    {
      label: "Total Leads", value: String(leads.length), change: "+12.5%", subtext: "vs last month",
      up: true, icon: Users, color: "#2563EB", bg: "#EFF6FF",
      spark: [98, 112, 105, 124, 138, leads.length],
      detail: `${leads.filter(l=>l.status==="New").length} New · ${leads.filter(l=>l.status==="Qualified").length} Qualified`,
      onClick: () => navigate("/"),
    },
    {
      label: "New Today", value: String(newToday || 12), change: "+3", subtext: "since yesterday",
      up: true, icon: TrendingUp, color: "#8B5CF6", bg: "#F5F3FF",
      spark: [6, 9, 7, 11, 10, newToday || 12],
      detail: "From Website & Referral",
      onClick: () => navigate("/"),
    },
    {
      label: "Conversion Rate", value: `${convRate}%`, change: "+2.4%", subtext: "this month",
      up: true, icon: Target, color: "#10B981", bg: "#ECFDF5",
      spark: [28, 27, 29, 30, 29, parseFloat(convRate) || 31],
      detail: `${closedWon.length} leads closed won`,
      onClick: () => navigate("/kanban"),
    },
    {
      label: "Revenue Closed", value: totalRevRaw > 0 ? `₹${totalRevRaw}L` : "₹2.34 Cr", change: "+18.7%", subtext: "this month",
      up: true, icon: DollarSign, color: "#F59E0B", bg: "#FFFBEB",
      spark: [1.8, 2.0, 1.9, 2.1, 2.2, 2.34],
      detail: "Target: ₹3.0 Cr",
      onClick: () => navigate("/"),
    },
    {
      label: "Avg Response Time", value: "18 min", change: "-5 min", subtext: "improvement",
      up: true, icon: Clock, color: "#EC4899", bg: "#FDF2F8",
      spark: [25, 22, 21, 20, 19, 18],
      detail: "Best: Kavya (12 min)",
      onClick: () => navigate("/dashboard"),
    },
  ];

  return (
    <Layout>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 style={{ fontFamily: "Inter", fontWeight: 700, fontSize: "22px", color: "#0A0E27", margin: 0 }}>
              Business Manager Dashboard
            </h1>
            <p style={{ fontFamily: "Inter", fontSize: "13px", color: "#64748B", marginTop: "2px" }}>
              HSR Motors · February 2026 · Real-time performance overview
            </p>
          </div>
          <button
            className="px-4 py-2 rounded-xl transition-colors"
            style={{ border: "1px solid #E2E8F0", background: "#FFFFFF", fontFamily: "Inter", fontSize: "13px", fontWeight: 500, color: "#475569" }}
          >
            Feb 1 – Feb 24, 2026 ▾
          </button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-5 gap-4 mb-6">
          {kpis.map((kpi) => {
            const Icon = kpi.icon;
            const isActive = selectedKpi === kpi.label || hoveredKpi === kpi.label;
            const isSelected = selectedKpi === kpi.label;
            return (
              <div
                key={kpi.label}
                onMouseEnter={() => setHoveredKpi(kpi.label)}
                onMouseLeave={() => setHoveredKpi(null)}
                onClick={() => setSelectedKpi(isSelected ? null : kpi.label)}
                className="rounded-xl p-4 relative overflow-hidden group transition-all duration-300 cursor-pointer"
                style={{ 
                  background: isActive ? kpi.color : "#FFFFFF", 
                  border: `1.5px solid ${isActive ? kpi.color : "#DDD6FE"}`,
                  boxShadow: isActive ? `0 12px 32px ${kpi.color}20` : "0 8px 24px rgba(99,102,241,0.08)",
                  transform: isActive ? "translateY(-4px)" : "translateY(0)"
                }}
              >
                {/* Background decoration */}
                <div
                  className="absolute -right-4 -top-4 w-16 h-16 rounded-full opacity-20 transition-all duration-300"
                  style={{ background: isActive ? "#FFFFFF" : kpi.color }}
                />
                <div className="flex items-center justify-between mb-3">
                  <div
                    className="flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300"
                    style={{ background: isActive ? "rgba(255,255,255,0.2)" : kpi.bg }}
                  >
                    <Icon size={18} style={{ color: isActive ? "#FFFFFF" : kpi.color, transition: "color 300ms" }} />
                  </div>
                  <div
                    className="flex items-center gap-1 px-2 py-1 rounded-lg transition-all duration-300"
                    style={{ background: isActive ? "rgba(255,255,255,0.15)" : (kpi.up ? "#F0FDF4" : "#FEF2F2") }}
                  >
                    {kpi.up ? (
                      <ArrowUpRight size={12} style={{ color: isActive ? "#FFFFFF" : "#10B981", transition: "color 300ms" }} />
                    ) : (
                      <ArrowDownRight size={12} style={{ color: isActive ? "#FFFFFF" : "#EF4444", transition: "color 300ms" }} />
                    )}
                    <span style={{ fontFamily: "Inter", fontSize: "11px", fontWeight: 600, color: isActive ? "#FFFFFF" : (kpi.up ? "#10B981" : "#EF4444"), transition: "color 300ms" }}>
                      {kpi.change}
                    </span>
                  </div>
                </div>
                <div style={{ fontFamily: "Inter", fontSize: "22px", fontWeight: 700, color: isActive ? "#FFFFFF" : "#0F172A", transition: "color 300ms" }}>{kpi.value}</div>
                <div style={{ fontFamily: "Inter", fontSize: "11px", fontWeight: 600, color: isActive ? "rgba(255,255,255,0.9)" : "#334155", marginTop: "2px", transition: "color 300ms" }}>{kpi.label}</div>
                <div style={{ fontFamily: "Inter", fontSize: "10px", color: isActive ? "rgba(255,255,255,0.7)" : "#94A3B8", transition: "color 300ms" }}>{kpi.subtext}</div>
                <div className="mt-2">
                  <MiniSparkline data={kpi.spark} color={isActive ? "#FFFFFF" : kpi.color} />
                </div>
                <div
                  className="mt-2 cursor-pointer"
                  onClick={(e) => { e.stopPropagation(); setExpandedKpi(expandedKpi === kpi.label ? null : kpi.label); }}
                >
                  <p style={{ fontFamily: "Inter", fontSize: "11px", color: isActive ? "rgba(255,255,255,0.7)" : "#64748B", transition: "color 300ms" }}>
                    {kpi.detail}
                  </p>
                </div>
                {expandedKpi === kpi.label && (
                  <div className="mt-2">
                    <button
                      className="px-2 py-1 rounded-lg transition-all duration-300"
                      style={{ background: isActive ? "rgba(255,255,255,0.2)" : "#F0FDF4", fontFamily: "Inter", fontSize: "11px", fontWeight: 600, color: isActive ? "#FFFFFF" : "#10B981" }}
                      onClick={kpi.onClick}
                    >
                      View Details
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Charts Row 1 */}
        <div className="grid gap-5 mb-5" style={{ gridTemplateColumns: "1fr 1fr" }}>
          {/* Bar Chart - Leads by Source */}
          <div
            className="rounded-xl p-5"
            style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 style={{ fontFamily: "Inter", fontSize: "14px", fontWeight: 600, color: "#0F172A", margin: 0 }}>Leads by Source</h3>
                <p style={{ fontFamily: "Inter", fontSize: "11px", color: "#94A3B8", marginTop: "2px" }}>Distribution across channels</p>
              </div>
              <button style={{ fontFamily: "Inter", fontSize: "11px", color: "#2563EB", fontWeight: 500 }}>View All</button>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={leadsBySource} barSize={28} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="source" tick={{ fontFamily: "Inter", fontSize: 10, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontFamily: "Inter", fontSize: 10, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="leads" name="Leads" radius={[6, 6, 0, 0]}>
                  {leadsBySource.map((entry, index) => (
                    <Cell key={index} fill={
                      index === 0 ? "#2563EB" :
                      index === 1 ? "#3B82F6" :
                      index === 2 ? "#60A5FA" :
                      index === 3 ? "#93C5FD" :
                      index === 4 ? "#BFDBFE" : "#DBEAFE"
                    } />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Line Chart - Monthly Trend */}
          <div
            className="rounded-xl p-5"
            style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 style={{ fontFamily: "Inter", fontSize: "14px", fontWeight: 600, color: "#0F172A", margin: 0 }}>Monthly Lead Trend</h3>
                <p style={{ fontFamily: "Inter", fontSize: "11px", color: "#94A3B8", marginTop: "2px" }}>Leads vs Closed Won</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#2563EB" }} />
                  <span style={{ fontFamily: "Inter", fontSize: "10px", color: "#64748B" }}>Total Leads</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#10B981" }} />
                  <span style={{ fontFamily: "Inter", fontSize: "10px", color: "#64748B" }}>Closed Won</span>
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={monthlyTrend} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                <defs>
                  <linearGradient id="leadsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="closedGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="month" tick={{ fontFamily: "Inter", fontSize: 10, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontFamily: "Inter", fontSize: 10, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="leads" name="Total Leads" stroke="#2563EB" strokeWidth={2.5} fill="url(#leadsGrad)" dot={{ fill: "#2563EB", r: 3 }} />
                <Area type="monotone" dataKey="closed" name="Closed Won" stroke="#10B981" strokeWidth={2.5} fill="url(#closedGrad)" dot={{ fill: "#10B981", r: 3 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid gap-5 mb-5" style={{ gridTemplateColumns: "1fr 1.4fr" }}>
          {/* Funnel Chart */}
          <div
            className="rounded-xl p-5"
            style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 style={{ fontFamily: "Inter", fontSize: "14px", fontWeight: 600, color: "#0F172A", margin: 0 }}>Lead Conversion Funnel</h3>
                <p style={{ fontFamily: "Inter", fontSize: "11px", color: "#94A3B8", marginTop: "2px" }}>Pipeline stage breakdown</p>
              </div>
            </div>
            <div>
              {[
                { stage: "Total Leads", count: 148, color: "#2563EB" },
                { stage: "Contacted", count: 112, color: "#3B82F6" },
                { stage: "Qualified", count: 74, color: "#60A5FA" },
                { stage: "Test Drive", count: 46, color: "#8B5CF6" },
                { stage: "Closed Won", count: 46, color: "#10B981" },
              ].map((item) => (
                <FunnelBar key={item.stage} stage={item.stage} count={item.count} color={item.color} maxCount={148} />
              ))}
            </div>
            <div
              className="mt-4 p-3 rounded-xl flex items-center gap-3"
              style={{ background: "#F0FDF4", border: "1px solid #A7F3D0" }}
            >
              <CheckCircle size={16} style={{ color: "#10B981" }} />
              <div>
                <div style={{ fontFamily: "Inter", fontSize: "12px", fontWeight: 600, color: "#065F46" }}>31.2% Overall Conversion</div>
                <div style={{ fontFamily: "Inter", fontSize: "10px", color: "#6EE7B7" }}>+2.4% vs last month</div>
              </div>
            </div>
          </div>

          {/* Leaderboard */}
          <div
            className="rounded-xl p-5"
            style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 style={{ fontFamily: "Inter", fontSize: "14px", fontWeight: 600, color: "#0F172A", margin: 0 }}>Sales Leaderboard</h3>
                <p style={{ fontFamily: "Inter", fontSize: "11px", color: "#94A3B8", marginTop: "2px" }}>February 2026 performance</p>
              </div>
              <div className="flex items-center gap-1.5" style={{ background: "#FFFBEB", padding: "4px 8px", borderRadius: "8px", border: "1px solid #FDE68A" }}>
                <Trophy size={12} style={{ color: "#F59E0B" }} />
                <span style={{ fontFamily: "Inter", fontSize: "11px", fontWeight: 600, color: "#D97706" }}>Rankings</span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {salesReps
                .sort((a, b) => parseInt(b.revenue.replace(/[^0-9]/g, "")) - parseInt(a.revenue.replace(/[^0-9]/g, "")))
                .map((rep, idx) => (
                  <div
                    key={rep.id}
                    className="flex items-center gap-3 p-3 rounded-xl transition-colors hover:bg-slate-50"
                    style={{ border: "1px solid #F1F5F9" }}
                  >
                    {/* Rank Badge */}
                    <div
                      className="flex items-center justify-center w-7 h-7 rounded-xl flex-shrink-0"
                      style={{
                        background: idx === 0 ? "#FEF3C7" : idx === 1 ? "#F1F5F9" : idx === 2 ? "#FFF7ED" : "#F8FAFC",
                        fontFamily: "Inter", fontSize: "12px", fontWeight: 700,
                        color: idx === 0 ? "#D97706" : idx === 1 ? "#64748B" : idx === 2 ? "#C2410C" : "#94A3B8"
                      }}
                    >
                      {idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : idx + 1}
                    </div>

                    {/* Avatar */}
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-white flex-shrink-0"
                      style={{ background: idx === 0 ? "#2563EB" : idx === 1 ? "#8B5CF6" : idx === 2 ? "#10B981" : "#F97316", fontFamily: "Inter", fontSize: "12px", fontWeight: 700 }}
                    >
                      {rep.avatar}
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <div style={{ fontFamily: "Inter", fontSize: "13px", fontWeight: 600, color: "#0F172A" }}>{rep.name}</div>
                      <div style={{ fontFamily: "Inter", fontSize: "11px", color: "#94A3B8" }}>
                        {rep.leads} leads · {rep.closed} closed
                      </div>
                    </div>

                    {/* Progress */}
                    <div className="text-right flex-shrink-0 w-28">
                      <div style={{ fontFamily: "Inter", fontSize: "13px", fontWeight: 700, color: "#0F172A" }}>{rep.revenue}</div>
                      <div className="flex items-center gap-1 mt-1">
                        <div style={{ flex: 1, height: "4px", background: "#F1F5F9", borderRadius: "4px" }}>
                          <div
                            style={{
                              height: "100%", width: `${rep.target}%`, borderRadius: "4px",
                              background: idx === 0 ? "#2563EB" : idx === 1 ? "#8B5CF6" : idx === 2 ? "#10B981" : "#F97316"
                            }}
                          />
                        </div>
                        <span style={{ fontFamily: "Inter", fontSize: "10px", color: "#94A3B8", flexShrink: 0 }}>{rep.target}%</span>
                      </div>
                    </div>

                    {/* Conv Rate */}
                    <div
                      className="px-2 py-1 rounded-lg"
                      style={{ background: "#F0FDF4", fontFamily: "Inter", fontSize: "11px", fontWeight: 600, color: "#10B981" }}
                    >
                      {rep.convRate}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* AI Insights Panel */}
        <div
          className="rounded-xl p-5"
          style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div
                className="flex items-center justify-center w-8 h-8 rounded-xl"
                style={{ background: "linear-gradient(135deg, #7C3AED, #2563EB)" }}
              >
                <Brain size={15} color="#fff" />
              </div>
              <div>
                <h3 style={{ fontFamily: "Inter", fontSize: "14px", fontWeight: 600, color: "#0F172A", margin: 0 }}>AI Insights</h3>
                <p style={{ fontFamily: "Inter", fontSize: "11px", color: "#94A3B8" }}>Smart recommendations powered by LeadDrive AI</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span style={{ fontFamily: "Inter", fontSize: "11px", color: "#8B5CF6", fontWeight: 500, background: "#F5F3FF", padding: "3px 10px", borderRadius: "20px", border: "1px solid #DDD6FE" }}>
                ✨ 4 New Insights
              </span>
              <button style={{ fontFamily: "Inter", fontSize: "12px", color: "#64748B" }}>
                Refresh
              </button>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {aiInsights.map((insight) => {
              const Icon = insight.icon;
              return (
                <div
                  key={insight.title}
                  className="rounded-xl p-4 transition-all hover:shadow-md"
                  style={{ background: insight.bg, border: `1px solid ${insight.border}` }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="flex items-center justify-center w-7 h-7 rounded-lg"
                      style={{ background: `${insight.color}20` }}
                    >
                      <Icon size={14} style={{ color: insight.color }} />
                    </div>
                    <span style={{ fontFamily: "Inter", fontSize: "12px", fontWeight: 600, color: "#0F172A" }}>{insight.title}</span>
                  </div>
                  <p style={{ fontFamily: "Inter", fontSize: "11px", color: "#475569", lineHeight: "1.5", margin: 0 }}>
                    {insight.desc}
                  </p>
                  <button
                    className="flex items-center gap-1 mt-3 transition-opacity hover:opacity-70"
                    style={{ fontFamily: "Inter", fontSize: "11px", fontWeight: 600, color: insight.color }}
                  >
                    {insight.action}
                    <ChevronRight size={12} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Layout>
  );
}