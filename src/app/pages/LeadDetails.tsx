import { useState } from "react";
import { Layout } from "../components/layout/Layout";
import { Activity } from "../data/leads";
import { useLeads } from "../context/LeadsContext";
import { useParams, useNavigate } from "react-router";
import {
  Phone, Mail, MessageSquare, Calendar, ChevronLeft, Star,
  Car, Wallet, MapPin, Clock, User, CheckCircle, XCircle,
  Edit2, Plus, PhoneCall, MessageCircle, FileText, Share2, Trophy,
  ArrowUpRight, AlertCircle, Send
} from "lucide-react";

const statusOptions = ["New", "Contacted", "Qualified", "Test Drive", "Closed Won", "Lost"];
const reps = ["Priya Sharma", "Arjun Singh", "Kavya Reddy", "Rahul Verma"];

const activityIcons: Record<Activity["type"], React.ReactNode> = {
  "note": <FileText size={14} color="#8B5CF6" />,
  "call": <PhoneCall size={14} color="#2563EB" />,
  "email": <Mail size={14} color="#10B981" />,
  "follow-up": <Calendar size={14} color="#F97316" />,
  "status-change": <ArrowUpRight size={14} color="#94A3B8" />,
  "test-drive": <Car size={14} color="#EC4899" />,
};

const activityBg: Record<Activity["type"], string> = {
  "note": "#F5F3FF",
  "call": "#EFF6FF",
  "email": "#ECFDF5",
  "follow-up": "#FFF7ED",
  "status-change": "#F8FAFC",
  "test-drive": "#FDF2F8",
};

function ScoreRing({ score }: { score: number }) {
  const r = 28;
  const circ = 2 * Math.PI * r;
  const progress = (score / 100) * circ;
  const color = score >= 80 ? "#10B981" : score >= 60 ? "#F97316" : "#EF4444";

  return (
    <div className="relative flex items-center justify-center" style={{ width: 72, height: 72 }}>
      <svg width="72" height="72" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="36" cy="36" r={r} fill="none" stroke="#E2E8F0" strokeWidth="5" />
        <circle
          cx="36" cy="36" r={r} fill="none" stroke={color} strokeWidth="5"
          strokeDasharray={circ} strokeDashoffset={circ - progress}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span style={{ fontFamily: "Inter", fontSize: "16px", fontWeight: 700, color: "#0F172A" }}>{score}</span>
        <span style={{ fontFamily: "Inter", fontSize: "9px", color: "#94A3B8", textTransform: "uppercase" }}>Score</span>
      </div>
    </div>
  );
}

export function LeadDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { leads, activities, updateLead, addActivity } = useLeads();
  const lead = leads.find((l) => l.id === id) || leads[0];
  const leadActivities = activities.filter((a) => a.leadId === lead.id);
  const [newNote, setNewNote] = useState("");
  const [selectedStatus, setSelectedStatus] = useState(lead.status);
  const [selectedRep, setSelectedRep] = useState(lead.assignedTo);
  const [activeTab, setActiveTab] = useState<"all" | "calls" | "notes" | "emails">("all");
  const [noteSaved, setNoteSaved] = useState(false);
  const [statusUpdated, setStatusUpdated] = useState(false);
  const [repUpdated, setRepUpdated] = useState(false);

  const handleSaveNote = (type: Activity["type"] = "note") => {
    if (!newNote.trim()) return;
    addActivity({
      id: `A${Date.now()}`,
      leadId: lead.id,
      type,
      content: newNote.trim(),
      user: "Kavya Reddy",
      timestamp: new Date().toISOString(),
    });
    setNewNote("");
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 2000);
  };

  const handleStatusUpdate = () => {
    updateLead(lead.id, { status: selectedStatus as any });
    addActivity({
      id: `A${Date.now()}`,
      leadId: lead.id,
      type: "status-change",
      content: `Status changed to "${selectedStatus}"`,
      user: "Kavya Reddy",
      timestamp: new Date().toISOString(),
    });
    setStatusUpdated(true);
    setTimeout(() => setStatusUpdated(false), 2000);
  };

  const handleRepUpdate = () => {
    updateLead(lead.id, { assignedTo: selectedRep });
    setRepUpdated(true);
    setTimeout(() => setRepUpdated(false), 2000);
  };

  const handleMarkWon = () => {
    updateLead(lead.id, { status: "Closed Won" });
    addActivity({ id: `A${Date.now()}`, leadId: lead.id, type: "status-change", content: "Lead marked as Closed Won 🎉", user: "Kavya Reddy", timestamp: new Date().toISOString() });
    navigate("/");
  };

  const handleMarkLost = () => {
    updateLead(lead.id, { status: "Lost" });
    addActivity({ id: `A${Date.now()}`, leadId: lead.id, type: "status-change", content: "Lead marked as Lost", user: "Kavya Reddy", timestamp: new Date().toISOString() });
    navigate("/");
  };

  const filteredActivities = leadActivities.filter((a) => {
    if (activeTab === "all") return true;
    if (activeTab === "calls") return a.type === "call";
    if (activeTab === "notes") return a.type === "note";
    if (activeTab === "emails") return a.type === "email";
    return true;
  });

  const statusColor: Record<string, { bg: string; text: string }> = {
    "New":        { bg: "#EFF6FF", text: "#1D4ED8" },
    "Contacted":  { bg: "#FFF7ED", text: "#C2410C" },
    "Qualified":  { bg: "#F0FDF4", text: "#15803D" },
    "Test Drive": { bg: "#F5F3FF", text: "#6D28D9" },
    "Closed Won": { bg: "#F0FDF4", text: "#065F46" },
    "Lost":       { bg: "#FEF2F2", text: "#B91C1C" },
  };
  const sc = statusColor[selectedStatus] || statusColor["New"];

  return (
    <Layout>
      <div className="p-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-5">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-1.5 transition-colors hover:text-blue-600"
            style={{ fontFamily: "Inter", fontSize: "13px", color: "#64748B" }}
          >
            <ChevronLeft size={15} />
            Back to Leads
          </button>
          <span style={{ color: "#CBD5E1" }}>/</span>
          <span style={{ fontFamily: "Inter", fontSize: "13px", color: "#0F172A", fontWeight: 500 }}>{lead.name}</span>
          <span
            className="px-2.5 py-0.5 rounded-lg ml-1"
            style={{ background: sc.bg, color: sc.text, fontFamily: "Inter", fontSize: "11px", fontWeight: 600 }}
          >
            {selectedStatus}
          </span>
        </div>

        {/* 3-column layout */}
        <div className="grid gap-5" style={{ gridTemplateColumns: "280px 1fr 260px" }}>

          {/* ===== LEFT: Customer Info ===== */}
          <div className="flex flex-col gap-4">
            {/* Main Card */}
            <div
              className="rounded-xl overflow-hidden"
              style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
            >
              {/* Header gradient */}
              <div
                className="px-5 pt-6 pb-8 relative"
                style={{ background: "linear-gradient(135deg, #1E40AF 0%, #2563EB 50%, #3B82F6 100%)" }}
              >
                <div className="absolute top-3 right-3">
                  <button className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "rgba(255,255,255,0.15)" }}>
                    <Edit2 size={12} color="#fff" />
                  </button>
                </div>
                <div
                  className="flex items-center justify-center w-16 h-16 rounded-2xl text-white mx-auto mb-3"
                  style={{ background: "rgba(255,255,255,0.2)", fontFamily: "Inter", fontSize: "20px", fontWeight: 700, backdropFilter: "blur(8px)" }}
                >
                  {lead.avatar}
                </div>
                <div className="text-center">
                  <h2 style={{ fontFamily: "Inter", fontSize: "16px", fontWeight: 700, color: "#FFFFFF", margin: 0 }}>{lead.name}</h2>
                  <p style={{ fontFamily: "Inter", fontSize: "12px", color: "rgba(255,255,255,0.75)", marginTop: "2px" }}>Lead ID: {lead.id}</p>
                </div>
              </div>

              {/* Score */}
              <div className="flex justify-center -mt-9 mb-3 relative z-10">
                <div
                  className="rounded-2xl px-4 py-2 flex items-center gap-3"
                  style={{ background: "#FFFFFF", border: "2px solid #E2E8F0", boxShadow: "0 2px 12px rgba(0,0,0,0.1)" }}
                >
                  <ScoreRing score={lead.leadScore} />
                  <div>
                    <div style={{ fontFamily: "Inter", fontSize: "11px", color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.5px" }}>Lead Score</div>
                    <div style={{ fontFamily: "Inter", fontSize: "12px", fontWeight: 600, color: lead.leadScore >= 80 ? "#10B981" : "#F97316", marginTop: "2px" }}>
                      {lead.leadScore >= 80 ? "Hot Lead" : lead.leadScore >= 60 ? "Warm Lead" : "Cold Lead"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Details */}
              <div className="px-4 pb-4 flex flex-col gap-3">
                {[
                  { icon: Phone, label: "Phone", value: lead.phone, color: "#2563EB" },
                  { icon: Mail, label: "Email", value: lead.email, color: "#8B5CF6" },
                  { icon: Car, label: "Car Interest", value: lead.carInterest, color: "#F97316" },
                  { icon: Wallet, label: "Budget", value: lead.budget, color: "#10B981" },
                  { icon: Share2, label: "Source", value: lead.source, color: "#EC4899" },
                  { icon: Calendar, label: "Created", value: new Date(lead.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }), color: "#64748B" },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="flex items-start gap-3">
                      <div
                        className="flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0"
                        style={{ background: item.color + "14" }}
                      >
                        <Icon size={14} style={{ color: item.color }} />
                      </div>
                      <div>
                        <div style={{ fontFamily: "Inter", fontSize: "10px", color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.5px" }}>{item.label}</div>
                        <div style={{ fontFamily: "Inter", fontSize: "12px", fontWeight: 500, color: "#334155", marginTop: "1px" }}>{item.value}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Actions Card */}
            <div
              className="rounded-xl p-4"
              style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}
            >
              <h3 style={{ fontFamily: "Inter", fontSize: "12px", fontWeight: 600, color: "#0F172A", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Quick Contact</h3>
              <div className="flex gap-2">
                {[
                  { icon: Phone, label: "Call", color: "#2563EB", bg: "#EFF6FF" },
                  { icon: MessageCircle, label: "WhatsApp", color: "#10B981", bg: "#ECFDF5" },
                  { icon: Mail, label: "Email", color: "#8B5CF6", bg: "#F5F3FF" },
                ].map((btn) => {
                  const Icon = btn.icon;
                  return (
                    <button
                      key={btn.label}
                      className="flex-1 flex flex-col items-center gap-1.5 py-2.5 rounded-xl transition-all hover:opacity-80"
                      style={{ background: btn.bg, border: `1px solid ${btn.color}22` }}
                    >
                      <Icon size={16} style={{ color: btn.color }} />
                      <span style={{ fontFamily: "Inter", fontSize: "11px", fontWeight: 500, color: btn.color }}>{btn.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ===== MIDDLE: Activity Timeline ===== */}
          <div
            className="rounded-xl"
            style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
          >
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 style={{ fontFamily: "Inter", fontSize: "15px", fontWeight: 600, color: "#0F172A", margin: 0 }}>Activity Timeline</h2>
              <div className="flex gap-1">
                {(["all", "calls", "notes", "emails"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className="px-3 py-1.5 rounded-lg capitalize"
                    style={{
                      fontFamily: "Inter", fontSize: "11px", fontWeight: activeTab === tab ? 600 : 400,
                      background: activeTab === tab ? "#2563EB" : "#F1F5F9",
                      color: activeTab === tab ? "#FFFFFF" : "#64748B"
                    }}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Add Note */}
            <div className="px-5 py-4 border-b border-slate-100">
              <div className="flex gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white flex-shrink-0"
                  style={{ background: "#2563EB", fontFamily: "Inter", fontSize: "10px", fontWeight: 700 }}
                >
                  KR
                </div>
                <div className="flex-1">
                  <textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Add a note, log a call, or set a reminder..."
                    rows={3}
                    style={{
                      fontFamily: "Inter", fontSize: "13px", width: "100%", padding: "10px 12px",
                      border: "1px solid #E2E8F0", borderRadius: "10px", background: "#F8FAFC",
                      color: "#475569", outline: "none", resize: "none", lineHeight: "1.5"
                    }}
                  />
                  <div className="flex items-center gap-2 mt-2">
                    {[
                      { icon: PhoneCall, label: "Log Call", color: "#2563EB", type: "call" as const },
                      { icon: Calendar, label: "Schedule", color: "#F97316", type: "follow-up" as const },
                      { icon: FileText, label: "Add Note", color: "#8B5CF6", type: "note" as const },
                    ].map((btn) => {
                      const Icon = btn.icon;
                      return (
                        <button
                          key={btn.label}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
                          style={{ border: `1px solid ${btn.color}33`, background: `${btn.color}0D`, fontFamily: "Inter", fontSize: "11px", fontWeight: 500, color: btn.color }}
                          onClick={() => handleSaveNote(btn.type)}
                        >
                          <Icon size={12} />
                          {btn.label}
                        </button>
                      );
                    })}
                    <button
                      className="ml-auto flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-white"
                      style={{ background: "#2563EB", fontFamily: "Inter", fontSize: "12px", fontWeight: 600 }}
                      onClick={() => handleSaveNote()}
                    >
                      <Send size={12} />
                      Save
                    </button>
                    {noteSaved && (
                      <span className="ml-2 text-sm text-green-500">Saved!</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="px-5 py-4 flex flex-col gap-4">
              {filteredActivities.map((activity, idx) => (
                <div key={activity.id} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: activityBg[activity.type] }}
                    >
                      {activityIcons[activity.type]}
                    </div>
                    {idx < filteredActivities.length - 1 && (
                      <div style={{ width: "1px", flex: 1, background: "#E2E8F0", marginTop: "4px", minHeight: "20px" }} />
                    )}
                  </div>
                  <div className="flex-1 pb-1">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span style={{ fontFamily: "Inter", fontSize: "12px", fontWeight: 600, color: "#334155" }}>
                          {activity.user}
                        </span>
                        <span
                          className="px-2 py-0.5 rounded capitalize"
                          style={{ background: activityBg[activity.type], fontFamily: "Inter", fontSize: "10px", fontWeight: 500, color: "#475569" }}
                        >
                          {activity.type.replace("-", " ")}
                        </span>
                      </div>
                      <span style={{ fontFamily: "Inter", fontSize: "11px", color: "#94A3B8" }}>
                        {new Date(activity.timestamp).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                    <p style={{ fontFamily: "Inter", fontSize: "12px", color: "#64748B", lineHeight: "1.5", margin: 0 }}>
                      {activity.content}
                    </p>
                  </div>
                </div>
              ))}

              {/* Older activities simulation */}
              {[
                { type: "email" as const, user: "System", content: "Welcome email sent to rajesh.kumar@gmail.com", time: "Feb 20, 09:00 AM" },
                { type: "note" as const, user: "Admin", content: "Lead created from website enquiry form submission", time: "Feb 20, 08:55 AM" },
              ].map((act, i) => (
                <div key={i} className="flex gap-3">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: activityBg[act.type] }}
                  >
                    {activityIcons[act.type]}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span style={{ fontFamily: "Inter", fontSize: "12px", fontWeight: 600, color: "#334155" }}>{act.user}</span>
                      <span style={{ fontFamily: "Inter", fontSize: "11px", color: "#94A3B8" }}>{act.time}</span>
                    </div>
                    <p style={{ fontFamily: "Inter", fontSize: "12px", color: "#64748B", lineHeight: "1.5", margin: 0 }}>{act.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ===== RIGHT: Actions Panel ===== */}
          <div className="flex flex-col gap-4">
            {/* Status */}
            <div
              className="rounded-xl p-4"
              style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
            >
              <h3 style={{ fontFamily: "Inter", fontSize: "12px", fontWeight: 600, color: "#0F172A", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Change Status</h3>
              <div className="flex flex-col gap-2">
                {statusOptions.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedStatus(s as any)}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all text-left"
                    style={{
                      background: selectedStatus === s ? "#EFF6FF" : "#F8FAFC",
                      border: `1px solid ${selectedStatus === s ? "#BFDBFE" : "#E2E8F0"}`,
                      fontFamily: "Inter", fontSize: "12px", fontWeight: selectedStatus === s ? 600 : 400,
                      color: selectedStatus === s ? "#2563EB" : "#64748B"
                    }}
                  >
                    <div
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{
                        background: s === "New" ? "#3B82F6" : s === "Contacted" ? "#F97316" : s === "Qualified" ? "#22C55E" : s === "Test Drive" ? "#8B5CF6" : s === "Closed Won" ? "#10B981" : "#EF4444"
                      }}
                    />
                    {s}
                    {selectedStatus === s && (
                      <CheckCircle size={13} className="ml-auto" style={{ color: "#2563EB" }} />
                    )}
                  </button>
                ))}
              </div>
              <button
                className="mt-3 w-full py-2 rounded-xl text-white text-center transition-opacity hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #2563EB, #1D4ED8)", fontFamily: "Inter", fontSize: "12px", fontWeight: 600 }}
                onClick={handleStatusUpdate}
              >
                Update Status
              </button>
              {statusUpdated && (
                <span className="mt-1 text-sm text-green-500">Status updated!</span>
              )}
            </div>

            {/* Assign Rep */}
            <div
              className="rounded-xl p-4"
              style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}
            >
              <h3 style={{ fontFamily: "Inter", fontSize: "12px", fontWeight: 600, color: "#0F172A", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Assign Sales Rep</h3>
              <div className="flex flex-col gap-2">
                {reps.map((rep) => (
                  <button
                    key={rep}
                    onClick={() => setSelectedRep(rep)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all"
                    style={{
                      background: selectedRep === rep ? "#EFF6FF" : "#F8FAFC",
                      border: `1px solid ${selectedRep === rep ? "#BFDBFE" : "#E2E8F0"}`,
                    }}
                  >
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-white flex-shrink-0"
                      style={{ background: "#2563EB", fontFamily: "Inter", fontSize: "10px", fontWeight: 700 }}
                    >
                      {rep.split(" ").map(n => n[0]).join("")}
                    </div>
                    <span style={{ fontFamily: "Inter", fontSize: "12px", fontWeight: selectedRep === rep ? 600 : 400, color: selectedRep === rep ? "#2563EB" : "#475569" }}>
                      {rep}
                    </span>
                    {selectedRep === rep && <CheckCircle size={13} className="ml-auto" style={{ color: "#2563EB" }} />}
                  </button>
                ))}
              </div>
              <button
                className="mt-3 w-full py-2 rounded-xl text-center transition-colors"
                style={{ background: "#F1F5F9", fontFamily: "Inter", fontSize: "12px", fontWeight: 600, color: "#475569", border: "1px solid #E2E8F0" }}
                onClick={handleRepUpdate}
              >
                Reassign Lead
              </button>
              {repUpdated && (
                <span className="mt-1 text-sm text-green-500">Rep updated!</span>
              )}
            </div>

            {/* Schedule Follow-up */}
            <div
              className="rounded-xl p-4"
              style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}
            >
              <h3 style={{ fontFamily: "Inter", fontSize: "12px", fontWeight: 600, color: "#0F172A", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Schedule Follow-up</h3>
              <input
                type="date"
                defaultValue="2026-02-26"
                style={{ fontFamily: "Inter", fontSize: "12px", width: "100%", padding: "8px 10px", border: "1px solid #E2E8F0", borderRadius: "8px", background: "#F8FAFC", color: "#475569", outline: "none", marginBottom: "8px" }}
              />
              <select
                style={{ fontFamily: "Inter", fontSize: "12px", width: "100%", padding: "8px 10px", border: "1px solid #E2E8F0", borderRadius: "8px", background: "#F8FAFC", color: "#475569", outline: "none", marginBottom: "8px" }}
              >
                <option>10:00 AM</option>
                <option>11:00 AM</option>
                <option>12:00 PM</option>
                <option>02:00 PM</option>
                <option>03:00 PM</option>
                <option>04:00 PM</option>
              </select>
              <button
                className="w-full py-2 rounded-xl text-center"
                style={{ background: "#FFF7ED", border: "1px solid #FED7AA", fontFamily: "Inter", fontSize: "12px", fontWeight: 600, color: "#C2410C" }}
              >
                Set Reminder
              </button>
            </div>

            {/* Win/Lost CTA */}
            <div className="flex gap-2">
              <button
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-white transition-opacity hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #10B981, #059669)", fontFamily: "Inter", fontSize: "12px", fontWeight: 600 }}
                onClick={handleMarkWon}
              >
                <Trophy size={13} />
                Mark Won
              </button>
              <button
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl transition-opacity hover:opacity-90"
                style={{ background: "#FEF2F2", border: "1px solid #FECACA", fontFamily: "Inter", fontSize: "12px", fontWeight: 600, color: "#B91C1C" }}
                onClick={handleMarkLost}
              >
                <XCircle size={13} />
                Mark Lost
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}