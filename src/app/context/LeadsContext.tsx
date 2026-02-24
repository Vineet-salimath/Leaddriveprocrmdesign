import { createContext, useContext, useState, ReactNode } from "react";
import { leads as initialLeads, activities as initialActivities, Lead, LeadStatus, Activity } from "../data/leads";

interface LeadsContextType {
  leads: Lead[];
  activities: Activity[];
  addLead: (lead: Lead) => void;
  updateLead: (id: string, updates: Partial<Lead>) => void;
  deleteLead: (id: string) => void;
  addActivity: (activity: Activity) => void;
}

const LeadsContext = createContext<LeadsContextType | null>(null);

export function LeadsProvider({ children }: { children: ReactNode }) {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [activities, setActivities] = useState<Activity[]>(initialActivities);

  const addLead = (lead: Lead) => setLeads((p) => [lead, ...p]);

  const updateLead = (id: string, updates: Partial<Lead>) =>
    setLeads((p) => p.map((l) => (l.id === id ? { ...l, ...updates } : l)));

  const deleteLead = (id: string) =>
    setLeads((p) => p.filter((l) => l.id !== id));

  const addActivity = (activity: Activity) =>
    setActivities((p) => [activity, ...p]);

  return (
    <LeadsContext.Provider value={{ leads, activities, addLead, updateLead, deleteLead, addActivity }}>
      {children}
    </LeadsContext.Provider>
  );
}

export function useLeads() {
  const ctx = useContext(LeadsContext);
  if (!ctx) throw new Error("useLeads must be used within LeadsProvider");
  return ctx;
}
