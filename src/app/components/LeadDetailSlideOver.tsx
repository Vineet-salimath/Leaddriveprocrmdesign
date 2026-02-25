import React, { useState } from "react";
import { X, MapPin, Phone, Mail, Calendar, Award, ArrowRight } from "lucide-react";

interface LeadDetailSlideOverProps {
  isOpen: boolean;
  onClose: () => void;
  lead: {
    id: string;
    name: string;
    phone: string;
    email?: string;
    carInterest: string;
    source: string;
    status: "New" | "Contacted" | "Qualified" | "Test Drive" | "Closed Won" | "Lost";
    assignedTo?: string;
    followUpDate?: string;
    leadScore?: number;
    location?: string;
  };
  onStatusChange?: (status: string) => void;
  onAssign?: (rep: string) => void;
}

const statusColors: Record<string, { bg: string; text: string; dot: string }> = {
  "New": { bg: "#EFF6FF", text: "#1D4ED8", dot: "#3B82F6" },
  "Contacted": { bg: "#FFF7ED", text: "#C2410C", dot: "#F97316" },
  "Qualified": { bg: "#F0FDF4", text: "#15803D", dot: "#22C55E" },
  "Test Drive": { bg: "#F5F3FF", text: "#6D28D9", dot: "#8B5CF6" },
  "Closed Won": { bg: "#F0FDF4", text: "#065F46", dot: "#10B981" },
  "Lost": { bg: "#FEF2F2", text: "#B91C1C", dot: "#EF4444" },
};

const sourceColors: Record<string, { bg: string; text: string }> = {
  "Website": { bg: "#EFF6FF", text: "#2563EB" },
  "Referral": { bg: "#FDF4FF", text: "#9333EA" },
  "Walk-in": { bg: "#F0FDF4", text: "#16A34A" },
  "Social Media": { bg: "#FFF7ED", text: "#EA580C" },
  "Phone": { bg: "#F8FAFC", text: "#475569" },
  "Auto Expo": { bg: "#FFF1F2", text: "#E11D48" },
};

export function LeadDetailSlideOver({ 
  isOpen, 
  onClose, 
  lead,
  onStatusChange,
  onAssign 
}: LeadDetailSlideOverProps) {
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(lead.status);

  const statuses = ["New", "Contacted", "Qualified", "Test Drive", "Closed Won", "Lost"];

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status as any);
    if (onStatusChange) onStatusChange(status);
    setShowStatusDropdown(false);
  };

  const statusColor = statusColors[selectedStatus];
  const sourceColor = sourceColors[lead.source];

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 transition-opacity"
          style={{ background: "rgba(0,0,0,0.2)" }}
          onClick={onClose}
        />
      )}

      {/* Slide-Over Panel */}
      <div
        className="fixed top-0 right-0 h-full flex flex-col transition-transform duration-300 z-50"
        style={{
          width: "420px",
          background: "#FFFFFF",
          boxShadow: "0px 8px 32px rgba(0,0,0,0.15)",
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: "1px solid #E2E8F0" }}
        >
          <h2 style={{ fontFamily: "Inter", fontSize: "16px", fontWeight: 700, color: "#0F172A" }}>
            Lead Details
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
            <X size={20} style={{ color: "#475569" }} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {/* Lead Info Card */}
          <div style={{ padding: "16px", background: "#F8FAFC", borderRadius: "12px" }}>
            <div style={{ marginBottom: "12px" }}>
              <h3 style={{ fontFamily: "Inter", fontSize: "16px", fontWeight: 700, color: "#0F172A", marginBottom: "4px" }}>
                {lead.name}
              </h3>
              <p style={{ fontFamily: "Inter", fontSize: "13px", color: "#64748B" }}>
                {lead.carInterest}
              </p>
            </div>

            {/* Status & Score Row */}
            <div style={{ display: "flex", gap: "12px", marginBottom: "12px" }}>
              <div
                style={{
                  ...statusColor,
                  padding: "6px 12px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: 600,
                  fontFamily: "Inter",
                }}
              >
                {selectedStatus}
              </div>
              {lead.leadScore && (
                <div
                  style={{
                    padding: "6px 12px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: 600,
                    fontFamily: "Inter",
                    background: "#EFF6FF",
                    color: "#2563EB",
                  }}
                >
                  Score: {lead.leadScore}
                </div>
              )}
            </div>

            <div
              style={{
                ...sourceColor,
                padding: "6px 12px",
                borderRadius: "20px",
                fontSize: "12px",
                fontWeight: 600,
                fontFamily: "Inter",
                display: "inline-block",
              }}
            >
              {lead.source}
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 style={{ fontFamily: "Inter", fontSize: "12px", fontWeight: 700, color: "#64748B", textTransform: "uppercase", marginBottom: "12px", letterSpacing: "0.5px" }}>
              Contact Information
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <Phone size={16} style={{ color: "#2563EB" }} />
                <a href={`tel:${lead.phone}`} style={{ fontFamily: "Inter", fontSize: "13px", color: "#2563EB", textDecoration: "none" }}>
                  {lead.phone}
                </a>
              </div>
              {lead.email && (
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <Mail size={16} style={{ color: "#2563EB" }} />
                  <a href={`mailto:${lead.email}`} style={{ fontFamily: "Inter", fontSize: "13px", color: "#2563EB", textDecoration: "none" }}>
                    {lead.email}
                  </a>
                </div>
              )}
              {lead.location && (
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <MapPin size={16} style={{ color: "#2563EB" }} />
                  <span style={{ fontFamily: "Inter", fontSize: "13px", color: "#0F172A" }}>
                    {lead.location}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Activity Timeline */}
          <div>
            <h4 style={{ fontFamily: "Inter", fontSize: "12px", fontWeight: 700, color: "#64748B", textTransform: "uppercase", marginBottom: "12px", letterSpacing: "0.5px" }}>
              Activity Timeline
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "flex", gap: "12px", paddingLeft: "12px", borderLeft: "2px solid #2563EB" }}>
                <div>
                  <div style={{ fontFamily: "Inter", fontSize: "12px", fontWeight: 600, color: "#0F172A" }}>
                    Lead created
                  </div>
                  <div style={{ fontFamily: "Inter", fontSize: "12px", color: "#64748B", marginTop: "2px" }}>
                    2 days ago
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", gap: "12px", paddingLeft: "12px", borderLeft: "2px solid #E2E8F0" }}>
                <div>
                  <div style={{ fontFamily: "Inter", fontSize: "12px", fontWeight: 600, color: "#0F172A" }}>
                    First contact
                  </div>
                  <div style={{ fontFamily: "Inter", fontSize: "12px", color: "#64748B", marginTop: "2px" }}>
                    1 day ago
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Follow-up Info */}
          {lead.followUpDate && (
            <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px", background: "#F0FDF4", borderRadius: "12px" }}>
              <Calendar size={16} style={{ color: "#16A34A" }} />
              <div>
                <div style={{ fontFamily: "Inter", fontSize: "12px", fontWeight: 600, color: "#16A34A" }}>
                  Follow-up scheduled
                </div>
                <div style={{ fontFamily: "Inter", fontSize: "13px", color: "#0F172A", marginTop: "2px" }}>
                  {lead.followUpDate}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div
          className="px-6 py-4"
          style={{ borderTop: "1px solid #E2E8F0", display: "flex", flexDirection: "column", gap: "12px" }}
        >
          {/* Change Status */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setShowStatusDropdown(!showStatusDropdown)}
              className="w-full"
              style={{
                padding: "12px 16px",
                borderRadius: "12px",
                border: "1px solid #E2E8F0",
                background: "#F8FAFC",
                fontFamily: "Inter",
                fontSize: "13px",
                fontWeight: 600,
                color: "#0F172A",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "#F0F4F8"}
              onMouseLeave={(e) => e.currentTarget.style.background = "#F8FAFC"}
            >
              Change Status
              <ArrowRight size={16} style={{ color: "#64748B" }} />
            </button>

            {showStatusDropdown && (
              <div
                style={{
                  position: "absolute",
                  bottom: "100%",
                  left: 0,
                  right: 0,
                  background: "#FFFFFF",
                  border: "1px solid #E2E8F0",
                  borderRadius: "12px",
                  marginBottom: "8px",
                  zIndex: 50,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
                  overflow: "hidden",
                }}
              >
                {statuses.map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(status)}
                    style={{
                      width: "100%",
                      padding: "10px 16px",
                      textAlign: "left",
                      fontFamily: "Inter",
                      fontSize: "13px",
                      color: status === selectedStatus ? "#2563EB" : "#0F172A",
                      fontWeight: status === selectedStatus ? 600 : 400,
                      background: status === selectedStatus ? "#EFF6FF" : "transparent",
                      border: "none",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      borderBottom: status !== statuses[statuses.length - 1] ? "1px solid #E2E8F0" : "none",
                    }}
                    onMouseEnter={(e) => status !== selectedStatus && (e.currentTarget.style.background = "#F8FAFC")}
                  >
                    {status}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Assign Rep */}
          <button
            style={{
              padding: "12px 16px",
              borderRadius: "12px",
              border: "1px solid #E2E8F0",
              background: "#F8FAFC",
              fontFamily: "Inter",
              fontSize: "13px",
              fontWeight: 600,
              color: "#0F172A",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "#F0F4F8"}
            onMouseLeave={(e) => e.currentTarget.style.background = "#F8FAFC"}
          >
            Assign Representative
          </button>

          {/* Primary Action */}
          <button
            style={{
              padding: "12px 16px",
              borderRadius: "12px",
              background: "#2563EB",
              color: "#FFFFFF",
              fontFamily: "Inter",
              fontSize: "13px",
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "#1D4ED8"}
            onMouseLeave={(e) => e.currentTarget.style.background = "#2563EB"}
          >
            Schedule Follow-up
          </button>
        </div>
      </div>
    </>
  );
}
