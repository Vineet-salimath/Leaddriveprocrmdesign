import { useState } from "react";
import { X, User, Phone, Mail, Car, Wallet, Share2, UserCheck, CheckCircle } from "lucide-react";
import { useLeads } from "../context/LeadsContext";
import { Lead, LeadStatus, LeadSource } from "../data/leads";

interface AddLeadModalProps {
  onClose: () => void;
}

const sources: LeadSource[] = ["Website", "Referral", "Walk-in", "Social Media", "Phone", "Auto Expo"];
const reps = ["Priya Sharma", "Arjun Singh", "Kavya Reddy", "Rahul Verma"];
const carModels = [
  "Hyundai Creta 2024", "Maruti Brezza", "Tata Nexon EV", "Honda City",
  "MG Hector Plus", "Kia Seltos", "Tata Safari", "Hyundai Verna",
  "Toyota Innova Crysta", "Maruti Swift", "Other",
];

const budgets = [
  "₹5–7 Lakhs", "₹7–9 Lakhs", "₹10–12 Lakhs", "₹12–14 Lakhs",
  "₹14–16 Lakhs", "₹16–19 Lakhs", "₹18–22 Lakhs", "₹20–24 Lakhs",
  "₹22–25 Lakhs", "₹25+ Lakhs",
];

export function AddLeadModal({ onClose }: AddLeadModalProps) {
  const { addLead, leads } = useLeads();
  const [step, setStep] = useState<"form" | "success">("form");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    carInterest: "",
    budget: "",
    source: "Website" as LeadSource,
    assignedTo: "Priya Sharma",
    notes: "",
  });

  const set = (key: string, val: string) => {
    setForm((p) => ({ ...p, [key]: val }));
    if (errors[key]) setErrors((p) => { const n = { ...p }; delete n[key]; return n; });
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.phone.trim()) e.phone = "Phone is required";
    if (!form.carInterest) e.carInterest = "Car model is required";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }

    const newLead: Lead = {
      id: `L${String(leads.length + 1).padStart(3, "0")}`,
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim() || "—",
      carInterest: form.carInterest,
      budget: form.budget || "TBD",
      source: form.source,
      status: "New",
      assignedTo: form.assignedTo,
      followUpDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      leadScore: Math.floor(Math.random() * 30) + 50,
      createdAt: new Date().toISOString().split("T")[0],
      notes: form.notes,
      avatar: form.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2),
    };

    addLead(newLead);
    setStep("success");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(15, 23, 42, 0.45)", backdropFilter: "blur(4px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{
          width: "540px",
          background: "#FFFFFF",
          boxShadow: "0 24px 64px rgba(0,0,0,0.18)",
          border: "1px solid #E2E8F0",
        }}
      >
        {/* Header */}
        <div
          className="px-6 py-5 flex items-center justify-between"
          style={{ background: "linear-gradient(135deg, #1E40AF 0%, #2563EB 100%)", borderBottom: "1px solid #1D4ED8" }}
        >
          <div>
            <h2 style={{ fontFamily: "Inter", fontWeight: 700, fontSize: "16px", color: "#FFFFFF", margin: 0 }}>
              Add New Lead
            </h2>
            <p style={{ fontFamily: "Inter", fontSize: "12px", color: "rgba(255,255,255,0.7)", marginTop: "2px" }}>
              Fill in the details to create a new sales lead
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-xl transition-colors"
            style={{ background: "rgba(255,255,255,0.15)" }}
          >
            <X size={15} color="#fff" />
          </button>
        </div>

        {step === "success" ? (
          /* Success State */
          <div className="px-6 py-12 flex flex-col items-center text-center">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
              style={{ background: "#ECFDF5" }}
            >
              <CheckCircle size={32} style={{ color: "#10B981" }} />
            </div>
            <h3 style={{ fontFamily: "Inter", fontSize: "18px", fontWeight: 700, color: "#0F172A", margin: 0 }}>
              Lead Created!
            </h3>
            <p style={{ fontFamily: "Inter", fontSize: "13px", color: "#64748B", marginTop: "8px" }}>
              <strong style={{ color: "#0F172A" }}>{form.name}</strong> has been added and assigned to{" "}
              <strong style={{ color: "#2563EB" }}>{form.assignedTo}</strong>.
            </p>
            <div className="flex gap-3 mt-6">
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl transition-colors"
                style={{ border: "1px solid #E2E8F0", fontFamily: "Inter", fontSize: "13px", fontWeight: 500, color: "#475569" }}
              >
                Close
              </button>
              <button
                onClick={() => { setForm({ name: "", phone: "", email: "", carInterest: "", budget: "", source: "Website", assignedTo: "Priya Sharma", notes: "" }); setStep("form"); }}
                className="px-5 py-2.5 rounded-xl text-white"
                style={{ background: "#2563EB", fontFamily: "Inter", fontSize: "13px", fontWeight: 600 }}
              >
                Add Another
              </button>
            </div>
          </div>
        ) : (
          /* Form */
          <div className="px-6 py-5">
            <div className="grid grid-cols-2 gap-4 mb-4">
              {/* Name */}
              <div>
                <label style={{ fontFamily: "Inter", fontSize: "12px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "6px" }}>
                  Full Name <span style={{ color: "#EF4444" }}>*</span>
                </label>
                <div className="relative">
                  <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#94A3B8" }} />
                  <input
                    value={form.name}
                    onChange={(e) => set("name", e.target.value)}
                    placeholder="e.g. Rajesh Kumar"
                    style={{
                      fontFamily: "Inter", fontSize: "13px", width: "100%",
                      paddingLeft: "34px", paddingRight: "12px", paddingTop: "9px", paddingBottom: "9px",
                      border: `1px solid ${errors.name ? "#EF4444" : "#E2E8F0"}`, borderRadius: "10px",
                      background: errors.name ? "#FEF2F2" : "#F8FAFC", color: "#0F172A", outline: "none",
                    }}
                  />
                </div>
                {errors.name && <p style={{ fontFamily: "Inter", fontSize: "11px", color: "#EF4444", marginTop: "4px" }}>{errors.name}</p>}
              </div>

              {/* Phone */}
              <div>
                <label style={{ fontFamily: "Inter", fontSize: "12px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "6px" }}>
                  Phone <span style={{ color: "#EF4444" }}>*</span>
                </label>
                <div className="relative">
                  <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#94A3B8" }} />
                  <input
                    value={form.phone}
                    onChange={(e) => set("phone", e.target.value)}
                    placeholder="+91 98765 43210"
                    style={{
                      fontFamily: "Inter", fontSize: "13px", width: "100%",
                      paddingLeft: "34px", paddingRight: "12px", paddingTop: "9px", paddingBottom: "9px",
                      border: `1px solid ${errors.phone ? "#EF4444" : "#E2E8F0"}`, borderRadius: "10px",
                      background: errors.phone ? "#FEF2F2" : "#F8FAFC", color: "#0F172A", outline: "none",
                    }}
                  />
                </div>
                {errors.phone && <p style={{ fontFamily: "Inter", fontSize: "11px", color: "#EF4444", marginTop: "4px" }}>{errors.phone}</p>}
              </div>

              {/* Email */}
              <div>
                <label style={{ fontFamily: "Inter", fontSize: "12px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "6px" }}>
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#94A3B8" }} />
                  <input
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    placeholder="email@example.com"
                    style={{
                      fontFamily: "Inter", fontSize: "13px", width: "100%",
                      paddingLeft: "34px", paddingRight: "12px", paddingTop: "9px", paddingBottom: "9px",
                      border: "1px solid #E2E8F0", borderRadius: "10px",
                      background: "#F8FAFC", color: "#0F172A", outline: "none",
                    }}
                  />
                </div>
              </div>

              {/* Car Interest */}
              <div>
                <label style={{ fontFamily: "Inter", fontSize: "12px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "6px" }}>
                  Car Interest <span style={{ color: "#EF4444" }}>*</span>
                </label>
                <div className="relative">
                  <Car size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#94A3B8" }} />
                  <select
                    value={form.carInterest}
                    onChange={(e) => set("carInterest", e.target.value)}
                    style={{
                      fontFamily: "Inter", fontSize: "13px", width: "100%",
                      paddingLeft: "34px", paddingRight: "12px", paddingTop: "9px", paddingBottom: "9px",
                      border: `1px solid ${errors.carInterest ? "#EF4444" : "#E2E8F0"}`, borderRadius: "10px",
                      background: errors.carInterest ? "#FEF2F2" : "#F8FAFC", color: form.carInterest ? "#0F172A" : "#94A3B8", outline: "none", cursor: "pointer",
                      appearance: "none",
                    }}
                  >
                    <option value="" disabled>Select car model</option>
                    {carModels.map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                {errors.carInterest && <p style={{ fontFamily: "Inter", fontSize: "11px", color: "#EF4444", marginTop: "4px" }}>{errors.carInterest}</p>}
              </div>

              {/* Budget */}
              <div>
                <label style={{ fontFamily: "Inter", fontSize: "12px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "6px" }}>
                  Budget Range
                </label>
                <div className="relative">
                  <Wallet size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#94A3B8" }} />
                  <select
                    value={form.budget}
                    onChange={(e) => set("budget", e.target.value)}
                    style={{
                      fontFamily: "Inter", fontSize: "13px", width: "100%",
                      paddingLeft: "34px", paddingRight: "12px", paddingTop: "9px", paddingBottom: "9px",
                      border: "1px solid #E2E8F0", borderRadius: "10px",
                      background: "#F8FAFC", color: form.budget ? "#0F172A" : "#94A3B8", outline: "none", cursor: "pointer",
                      appearance: "none",
                    }}
                  >
                    <option value="" disabled>Select budget</option>
                    {budgets.map((b) => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
              </div>

              {/* Source */}
              <div>
                <label style={{ fontFamily: "Inter", fontSize: "12px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "6px" }}>
                  Lead Source
                </label>
                <div className="relative">
                  <Share2 size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#94A3B8" }} />
                  <select
                    value={form.source}
                    onChange={(e) => set("source", e.target.value as LeadSource)}
                    style={{
                      fontFamily: "Inter", fontSize: "13px", width: "100%",
                      paddingLeft: "34px", paddingRight: "12px", paddingTop: "9px", paddingBottom: "9px",
                      border: "1px solid #E2E8F0", borderRadius: "10px",
                      background: "#F8FAFC", color: "#0F172A", outline: "none", cursor: "pointer",
                      appearance: "none",
                    }}
                  >
                    {sources.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Assign To */}
            <div className="mb-4">
              <label style={{ fontFamily: "Inter", fontSize: "12px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "8px" }}>
                Assign To
              </label>
              <div className="flex gap-2">
                {reps.map((rep) => (
                  <button
                    key={rep}
                    onClick={() => set("assignedTo", rep)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl flex-1 transition-all"
                    style={{
                      border: `1.5px solid ${form.assignedTo === rep ? "#2563EB" : "#E2E8F0"}`,
                      background: form.assignedTo === rep ? "#EFF6FF" : "#F8FAFC",
                    }}
                  >
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-white flex-shrink-0"
                      style={{ background: "#2563EB", fontFamily: "Inter", fontSize: "9px", fontWeight: 700 }}
                    >
                      {rep.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <span style={{ fontFamily: "Inter", fontSize: "11px", fontWeight: form.assignedTo === rep ? 600 : 400, color: form.assignedTo === rep ? "#2563EB" : "#64748B" }}>
                      {rep.split(" ")[0]}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="mb-5">
              <label style={{ fontFamily: "Inter", fontSize: "12px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "6px" }}>
                Initial Notes
              </label>
              <textarea
                value={form.notes}
                onChange={(e) => set("notes", e.target.value)}
                placeholder="Any initial observations, requirements, or context..."
                rows={3}
                style={{
                  fontFamily: "Inter", fontSize: "13px", width: "100%",
                  padding: "10px 12px", border: "1px solid #E2E8F0", borderRadius: "10px",
                  background: "#F8FAFC", color: "#0F172A", outline: "none", resize: "none", lineHeight: "1.5",
                }}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-slate-100">
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl flex-1 transition-colors"
                style={{ border: "1px solid #E2E8F0", fontFamily: "Inter", fontSize: "13px", fontWeight: 500, color: "#475569", background: "#F8FAFC" }}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-5 py-2.5 rounded-xl flex-1 text-white transition-opacity hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #2563EB, #1D4ED8)", fontFamily: "Inter", fontSize: "13px", fontWeight: 600, boxShadow: "0 2px 8px rgba(37,99,235,0.3)" }}
              >
                Create Lead
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
