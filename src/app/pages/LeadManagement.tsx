import { useState, useCallback, useRef } from "react";
import { Layout } from "../components/layout/Layout";
import { Lead, LeadStatus } from "../data/leads";
import { useLeads } from "../context/LeadsContext";
import { AddLeadModal } from "../components/AddLeadModal";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {
  Plus, Zap, AlertTriangle, GripVertical, Clock, MessageCircle,
  Phone, FileText, ChevronRight, Eye, X, Check, Send
} from "lucide-react";
import { useNavigate } from "react-router";

const ITEM_TYPE = "LEAD_CARD";

const columns: { status: LeadStatus; color: string; bg: string; textColor: string; dotColor: string }[] = [
  { status: "New",        color: "#DBEAFE", bg: "#EFF6FF", textColor: "#1D4ED8", dotColor: "#3B82F6" },
  { status: "Contacted",  color: "#FED7AA", bg: "#FFF7ED", textColor: "#C2410C", dotColor: "#F97316" },
  { status: "Qualified",  color: "#BBF7D0", bg: "#F0FDF4", textColor: "#15803D", dotColor: "#22C55E" },
  { status: "Test Drive", color: "#DDD6FE", bg: "#F5F3FF", textColor: "#6D28D9", dotColor: "#8B5CF6" },
  { status: "Closed Won", color: "#A7F3D0", bg: "#ECFDF5", textColor: "#065F46", dotColor: "#10B981" },
  { status: "Lost",       color: "#FECACA", bg: "#FEF2F2", textColor: "#B91C1C", dotColor: "#EF4444" },
];

const sourceColors: Record<string, string> = {
  "Website": "#2563EB", "Referral": "#9333EA", "Walk-in": "#16A34A",
  "Social Media": "#EA580C", "Phone": "#475569", "Auto Expo": "#E11D48",
};

// Next status map for quick "Move Forward"
const nextStatus: Partial<Record<LeadStatus, LeadStatus>> = {
  "New": "Contacted",
  "Contacted": "Qualified",
  "Qualified": "Test Drive",
  "Test Drive": "Closed Won",
};

interface DraggableCardProps {
  lead: Lead;
  onStatusChange: (leadId: string, newStatus: LeadStatus) => void;
}

function DraggableCard({ lead, onStatusChange }: DraggableCardProps) {
  const navigate = useNavigate();
  const { addActivity } = useLeads();

  const [isHovered, setIsHovered] = useState(false);
  const [showMoveMenu, setShowMoveMenu] = useState(false);
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [noteSaved, setNoteSaved] = useState(false);
  const moveMenuRef = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: ITEM_TYPE,
    item: { id: lead.id, status: lead.status },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  }));

  const sc = columns.find((c) => c.status === lead.status)!;
  const today = new Date().toISOString().split("T")[0];
  const daysUntilFollowup = Math.ceil(
    (new Date(lead.followUpDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );
  const isOverdue = lead.followUpDate < today && !["Closed Won", "Lost"].includes(lead.status);

  const handleSaveNote = () => {
    if (!noteText.trim()) return;
    addActivity({
      id: `A${Date.now()}`,
      leadId: lead.id,
      type: "note",
      content: noteText.trim(),
      user: "Kavya Reddy",
      timestamp: new Date().toISOString(),
    });
    setNoteText("");
    setNoteSaved(true);
    setTimeout(() => { setNoteSaved(false); setShowNoteInput(false); }, 1500);
  };

  const handleCall = (e: React.MouseEvent) => {
    e.stopPropagation();
    addActivity({
      id: `A${Date.now()}`,
      leadId: lead.id,
      type: "call",
      content: `Quick call initiated from Kanban board.`,
      user: "Kavya Reddy",
      timestamp: new Date().toISOString(),
    });
  };

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    addActivity({
      id: `A${Date.now()}`,
      leadId: lead.id,
      type: "note",
      content: `WhatsApp message sent to ${lead.phone}.`,
      user: "Kavya Reddy",
      timestamp: new Date().toISOString(),
    });
  };

  const next = nextStatus[lead.status];

  return (
    <div
      ref={drag as any}
      className="rounded-xl transition-all"
      style={{
        background: "#FFFFFF",
        border: `1px solid ${isHovered ? "#BFDBFE" : "#E2E8F0"}`,
        boxShadow: isDragging
          ? "0 8px 24px rgba(37,99,235,0.2)"
          : isHovered
          ? "0 4px 16px rgba(37,99,235,0.1)"
          : "0 1px 3px rgba(0,0,0,0.06)",
        opacity: isDragging ? 0.6 : 1,
        transform: isDragging ? "rotate(2deg) scale(1.02)" : "none",
        marginBottom: "8px",
        cursor: isDragging ? "grabbing" : "grab",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setShowMoveMenu(false); }}
    >
      {/* Card Body */}
      <div className="p-3" onClick={() => navigate(`/lead/${lead.id}`)}>
        {/* Header */}
        <div className="flex items-start justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center text-white flex-shrink-0"
              style={{ background: `hsl(${(lead.id.charCodeAt(3) * 47) % 360}, 55%, 50%)`, fontFamily: "Inter", fontSize: "11px", fontWeight: 700 }}
            >
              {lead.avatar}
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span style={{ fontFamily: "Inter", fontSize: "12px", fontWeight: 600, color: "#0F172A" }}>{lead.name}</span>
              </div>
              <div style={{ fontFamily: "Inter", fontSize: "10px", color: "#94A3B8" }}>{lead.id} · {lead.phone}</div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <GripVertical size={12} style={{ color: "#CBD5E1" }} />
          </div>
        </div>

        {/* Car */}
        <div
          className="flex items-center gap-2 px-2 py-1.5 rounded-lg mb-2"
          style={{ background: "#F8FAFC" }}
        >
          <span style={{ fontFamily: "Inter", fontSize: "11px", color: "#334155", fontWeight: 500 }}>🚗 {lead.carInterest}</span>
        </div>

        {/* Tags row */}
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span
            className="px-2 py-0.5 rounded-lg"
            style={{ background: "#F1F5F9", fontFamily: "Inter", fontSize: "10px", fontWeight: 500, color: "#475569" }}
          >
            {lead.budget}
          </span>
          <span
            className="px-2 py-0.5 rounded-lg"
            style={{ background: `${sourceColors[lead.source]}14`, fontFamily: "Inter", fontSize: "10px", fontWeight: 500, color: sourceColors[lead.source] }}
          >
            {lead.source}
          </span>
          {lead.leadScore >= 80 && (
            <span
              className="px-2 py-0.5 rounded-lg"
              style={{ background: "#FFF7ED", fontFamily: "Inter", fontSize: "10px", fontWeight: 600, color: "#F97316" }}
            >
              Hot
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center text-white"
              style={{ background: "#2563EB", fontFamily: "Inter", fontSize: "7px", fontWeight: 700 }}
            >
              {lead.assignedTo.split(" ").map((n) => n[0]).join("")}
            </div>
            <span style={{ fontFamily: "Inter", fontSize: "10px", color: "#64748B" }}>{lead.assignedTo.split(" ")[0]}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={10} style={{ color: isOverdue ? "#EF4444" : "#94A3B8" }} />
            <span
              style={{ fontFamily: "Inter", fontSize: "10px", fontWeight: 500, color: isOverdue ? "#EF4444" : "#94A3B8" }}
            >
              {isOverdue ? "⚠ Overdue" : daysUntilFollowup <= 1 ? "Tomorrow" : `${daysUntilFollowup}d`}
            </span>
          </div>
        </div>

        {/* Score bar */}
        <div className="mt-2.5">
          <div style={{ height: "3px", background: "#F1F5F9", borderRadius: "4px" }}>
            <div
              style={{
                height: "100%",
                width: `${lead.leadScore}%`,
                borderRadius: "4px",
                background: lead.leadScore >= 80 ? "#10B981" : lead.leadScore >= 60 ? "#F97316" : "#EF4444",
                transition: "width 0.4s ease",
              }}
            />
          </div>
        </div>
      </div>

      {/* Hover Quick Actions */}
      {isHovered && (
        <div
          className="px-3 pb-3 pt-0"
          onClick={(e) => e.stopPropagation()}
          style={{ borderTop: "1px dashed #E2E8F0" }}
        >
          {/* Quick Note Input */}
          {showNoteInput ? (
            <div className="pt-2">
              {noteSaved ? (
                <div className="flex items-center gap-2 py-2">
                  <Check size={13} style={{ color: "#10B981" }} />
                  <span style={{ fontFamily: "Inter", fontSize: "11px", color: "#10B981", fontWeight: 600 }}>Note saved!</span>
                </div>
              ) : (
                <>
                  <textarea
                    autoFocus
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder="Quick note..."
                    rows={2}
                    style={{
                      fontFamily: "Inter", fontSize: "11px", width: "100%",
                      padding: "6px 8px", border: "1px solid #BFDBFE", borderRadius: "8px",
                      background: "#F8FAFC", color: "#334155", outline: "none", resize: "none",
                    }}
                    onKeyDown={(e) => { if (e.key === "Enter" && e.metaKey) handleSaveNote(); }}
                  />
                  <div className="flex gap-1.5 mt-1.5">
                    <button
                      onClick={() => { setShowNoteInput(false); setNoteText(""); }}
                      className="flex items-center justify-center w-6 h-6 rounded-lg"
                      style={{ background: "#FEF2F2" }}
                    >
                      <X size={11} style={{ color: "#EF4444" }} />
                    </button>
                    <button
                      onClick={handleSaveNote}
                      className="flex items-center gap-1 flex-1 justify-center py-1 rounded-lg text-white"
                      style={{ background: "#2563EB", fontFamily: "Inter", fontSize: "10px", fontWeight: 600 }}
                    >
                      <Send size={9} /> Save Note
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1.5 pt-2">
              {/* Call */}
              <button
                onClick={handleCall}
                className="flex items-center gap-1 px-2 py-1.5 rounded-lg flex-1 justify-center transition-colors hover:opacity-80"
                style={{ background: "#EFF6FF", border: "1px solid #BFDBFE" }}
                title="Log Call"
              >
                <Phone size={11} style={{ color: "#2563EB" }} />
                <span style={{ fontFamily: "Inter", fontSize: "10px", fontWeight: 600, color: "#2563EB" }}>Call</span>
              </button>

              {/* WhatsApp */}
              <button
                onClick={handleWhatsApp}
                className="flex items-center gap-1 px-2 py-1.5 rounded-lg flex-1 justify-center transition-colors hover:opacity-80"
                style={{ background: "#ECFDF5", border: "1px solid #A7F3D0" }}
                title="WhatsApp"
              >
                <MessageCircle size={11} style={{ color: "#10B981" }} />
                <span style={{ fontFamily: "Inter", fontSize: "10px", fontWeight: 600, color: "#10B981" }}>WA</span>
              </button>

              {/* Note */}
              <button
                onClick={() => setShowNoteInput(true)}
                className="flex items-center gap-1 px-2 py-1.5 rounded-lg flex-1 justify-center transition-colors hover:opacity-80"
                style={{ background: "#F5F3FF", border: "1px solid #DDD6FE" }}
                title="Add Note"
              >
                <FileText size={11} style={{ color: "#8B5CF6" }} />
                <span style={{ fontFamily: "Inter", fontSize: "10px", fontWeight: 600, color: "#8B5CF6" }}>Note</span>
              </button>

              {/* Move Forward / Status Menu */}
              <div className="relative flex-1" ref={moveMenuRef}>
                {next ? (
                  <button
                    onClick={() => onStatusChange(lead.id, next)}
                    className="flex items-center gap-0.5 px-2 py-1.5 rounded-lg w-full justify-center transition-colors hover:opacity-80"
                    style={{ background: "#FFF7ED", border: "1px solid #FED7AA" }}
                    title={`Move to ${next}`}
                  >
                    <ChevronRight size={11} style={{ color: "#F97316" }} />
                    <span style={{ fontFamily: "Inter", fontSize: "10px", fontWeight: 600, color: "#F97316", whiteSpace: "nowrap" }}>Move</span>
                  </button>
                ) : (
                  <button
                    onClick={() => navigate(`/lead/${lead.id}`)}
                    className="flex items-center gap-0.5 px-2 py-1.5 rounded-lg w-full justify-center transition-colors hover:opacity-80"
                    style={{ background: "#F8FAFC", border: "1px solid #E2E8F0" }}
                  >
                    <Eye size={11} style={{ color: "#64748B" }} />
                    <span style={{ fontFamily: "Inter", fontSize: "10px", fontWeight: 600, color: "#64748B" }}>View</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface DropColumnProps {
  status: LeadStatus;
  leads: Lead[];
  color: string;
  bg: string;
  textColor: string;
  dotColor: string;
  onStatusChange: (leadId: string, newStatus: LeadStatus) => void;
}

function DropColumn({ status, leads: colLeads, color, bg, textColor, dotColor, onStatusChange }: DropColumnProps) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ITEM_TYPE,
    drop: (item: { id: string; status: LeadStatus }) => {
      if (item.status !== status) onStatusChange(item.id, status);
    },
    collect: (monitor) => ({ isOver: monitor.isOver() }),
  }));

  const totalBudgetMin = colLeads.reduce((s, l) => {
    const m = l.budget.match(/₹(\d+)/);
    return s + (m ? parseInt(m[1]) : 0);
  }, 0);

  return (
    <div
      ref={drop as any}
      className="flex flex-col rounded-xl overflow-hidden transition-all flex-1"
      style={{
        minWidth: "280px",
        flex: "1 1 0",
        background: isOver ? bg : bg + "80",
        border: `1.5px solid ${isOver ? dotColor : "#E2E8F0"}`,
        boxShadow: isOver ? `0 0 0 3px ${dotColor}25` : "0 2px 8px rgba(0,0,0,0.04)",
        borderRadius: "12px",
      }}
    >
      {/* Column Header */}
      <div className="px-3 py-3" style={{ background: isOver ? bg : "#FFFFFF", borderBottom: `2px solid ${color}` }}>
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ background: dotColor }} />
            <span style={{ fontFamily: "Inter", fontSize: "12px", fontWeight: 700, color: textColor }}>{status}</span>
          </div>
          <span
            className="flex items-center justify-center w-5 h-5 rounded-full"
            style={{ background: color, fontFamily: "Inter", fontSize: "10px", fontWeight: 700, color: textColor }}
          >
            {colLeads.length}
          </span>
        </div>
        <div style={{ fontFamily: "Inter", fontSize: "10px", color: "#94A3B8" }}>
          {totalBudgetMin > 0 ? `Pipeline: ₹${totalBudgetMin}L+` : "Empty stage"}
        </div>
      </div>

      {/* Cards */}
      <div className="p-2.5 flex-1 overflow-y-auto" style={{ maxHeight: "calc(100vh - 310px)", minHeight: "100px" }}>
        {colLeads.map((lead) => (
          <DraggableCard key={lead.id} lead={lead} onStatusChange={onStatusChange} />
        ))}
        {colLeads.length === 0 && (
          <div
            className="flex flex-col items-center justify-center py-10 rounded-xl border-2 border-dashed mt-1"
            style={{ borderColor: "#E2E8F0" }}
          >
            <span style={{ fontSize: "20px" }}>📋</span>
            <span style={{ fontFamily: "Inter", fontSize: "10px", color: "#CBD5E1", marginTop: "6px" }}>Drop here</span>
          </div>
        )}
      </div>
    </div>
  );
}

export function LeadManagement() {
  const { leads, updateLead } = useLeads();
  const [autoAssign, setAutoAssign] = useState(true);
  const [roundRobin, setRoundRobin] = useState(true);
  const [escalation, setEscalation] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const handleStatusChange = useCallback((leadId: string, newStatus: LeadStatus) => {
    updateLead(leadId, { status: newStatus });
  }, [updateLead]);

  const groupedLeads = columns.reduce((acc, col) => {
    acc[col.status] = leads.filter((l) => l.status === col.status);
    return acc;
  }, {} as Record<LeadStatus, Lead[]>);

  const totalWon  = leads.filter((l) => l.status === "Closed Won").length;
  const totalLost = leads.filter((l) => l.status === "Lost").length;
  const totalActive = leads.filter((l) => !["Closed Won","Lost"].includes(l.status)).length;
  const overdueLeads = leads.filter((l) => {
    const today = new Date().toISOString().split("T")[0];
    return l.followUpDate < today && !["Closed Won","Lost"].includes(l.status);
  }).length;

  const Toggle = ({ on, onChange }: { on: boolean; onChange: () => void }) => (
    <button onClick={onChange}>
      <div className="flex items-center w-11 h-6 rounded-full relative transition-colors" style={{ background: on ? "#2563EB" : "#E2E8F0" }}>
        <div
          className="absolute w-4 h-4 rounded-full bg-white shadow transition-all"
          style={{ left: on ? "calc(100% - 20px)" : "4px" }}
        />
      </div>
    </button>
  );

  return (
    <DndProvider backend={HTML5Backend}>
      <Layout>
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <h1 style={{ fontFamily: "Inter", fontWeight: 700, fontSize: "22px", color: "#0F172A", margin: 0 }}>Lead Management</h1>
              <p style={{ fontFamily: "Inter", fontSize: "13px", color: "#64748B", marginTop: "2px" }}>
                Drag & drop to move leads · Hover a card for quick actions
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* Stats */}
              <div className="flex items-center gap-4 px-4 py-2.5 rounded-xl" style={{ background: "#FFFFFF", border: "1px solid #E2E8F0" }}>
                <div className="text-center">
                  <div style={{ fontFamily: "Inter", fontSize: "18px", fontWeight: 700, color: "#0F172A" }}>{totalActive}</div>
                  <div style={{ fontFamily: "Inter", fontSize: "10px", color: "#94A3B8" }}>Active</div>
                </div>
                <div style={{ width: "1px", height: "28px", background: "#E2E8F0" }} />
                <div className="text-center">
                  <div style={{ fontFamily: "Inter", fontSize: "18px", fontWeight: 700, color: "#10B981" }}>{totalWon}</div>
                  <div style={{ fontFamily: "Inter", fontSize: "10px", color: "#94A3B8" }}>Won</div>
                </div>
                <div style={{ width: "1px", height: "28px", background: "#E2E8F0" }} />
                <div className="text-center">
                  <div style={{ fontFamily: "Inter", fontSize: "18px", fontWeight: 700, color: "#EF4444" }}>{totalLost}</div>
                  <div style={{ fontFamily: "Inter", fontSize: "10px", color: "#94A3B8" }}>Lost</div>
                </div>
                {overdueLeads > 0 && (
                  <>
                    <div style={{ width: "1px", height: "28px", background: "#E2E8F0" }} />
                    <div className="text-center">
                      <div style={{ fontFamily: "Inter", fontSize: "18px", fontWeight: 700, color: "#F97316" }}>{overdueLeads}</div>
                      <div style={{ fontFamily: "Inter", fontSize: "10px", color: "#94A3B8" }}>Overdue</div>
                    </div>
                  </>
                )}
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-white"
                style={{ background: "linear-gradient(135deg, #2563EB, #1D4ED8)", fontFamily: "Inter", fontSize: "13px", fontWeight: 600, boxShadow: "0 2px 8px rgba(37,99,235,0.3)" }}
              >
                <Plus size={14} /> Add Lead
              </button>
            </div>
          </div>

          {/* Automation Panel */}
          <div
            className="rounded-xl p-4 mb-5"
            style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}
          >
            <div className="flex items-center gap-6 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-7 h-7 rounded-lg" style={{ background: "linear-gradient(135deg, #2563EB, #7C3AED)" }}>
                  <Zap size={13} color="#fff" />
                </div>
                <span style={{ fontFamily: "Inter", fontSize: "13px", fontWeight: 600, color: "#0F172A" }}>Automation</span>
                <span className="px-2 py-0.5 rounded-full" style={{ background: "#ECFDF5", fontFamily: "Inter", fontSize: "10px", fontWeight: 600, color: "#059669" }}>
                  {[autoAssign, roundRobin, escalation].filter(Boolean).length} Active
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Toggle on={autoAssign} onChange={() => setAutoAssign(!autoAssign)} />
                <div>
                  <div style={{ fontFamily: "Inter", fontSize: "12px", fontWeight: 600, color: "#334155" }}>Auto-Assign</div>
                  <div style={{ fontFamily: "Inter", fontSize: "10px", color: "#94A3B8" }}>New leads auto-assigned</div>
                </div>
              </div>

              <div style={{ width: "1px", height: "32px", background: "#E2E8F0" }} />

              <div className="flex items-center gap-2">
                <Toggle on={roundRobin} onChange={() => setRoundRobin(!roundRobin)} />
                <div>
                  <div style={{ fontFamily: "Inter", fontSize: "12px", fontWeight: 600, color: "#334155" }}>Round-Robin</div>
                  <div style={{ fontFamily: "Inter", fontSize: "10px", color: "#94A3B8" }}>Balanced assignment</div>
                </div>
              </div>

              <div style={{ width: "1px", height: "32px", background: "#E2E8F0" }} />

              <div className="flex items-center gap-2">
                <Toggle on={escalation} onChange={() => setEscalation(!escalation)} />
                <div>
                  <div style={{ fontFamily: "Inter", fontSize: "12px", fontWeight: 600, color: "#334155" }}>Escalation</div>
                  <div style={{ fontFamily: "Inter", fontSize: "10px", color: "#94A3B8" }}>Alert after 24h</div>
                </div>
              </div>

              <div style={{ width: "1px", height: "32px", background: "#E2E8F0" }} />

              {overdueLeads > 0 && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl" style={{ background: "#FFF7ED", border: "1px solid #FED7AA" }}>
                  <AlertTriangle size={13} style={{ color: "#F97316" }} />
                  <span style={{ fontFamily: "Inter", fontSize: "11px", color: "#C2410C", fontWeight: 500 }}>
                    <strong>{overdueLeads} leads</strong> overdue for follow-up
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Kanban Board */}
          <div className="flex gap-4 overflow-x-auto pb-4" style={{ minHeight: "calc(100vh - 330px)" }}>
            {columns.map((col) => (
              <DropColumn
                key={col.status}
                status={col.status}
                leads={groupedLeads[col.status] || []}
                color={col.color}
                bg={col.bg}
                textColor={col.textColor}
                dotColor={col.dotColor}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        </div>

        {showAddModal && <AddLeadModal onClose={() => setShowAddModal(false)} />}
      </Layout>
    </DndProvider>
  );
}
