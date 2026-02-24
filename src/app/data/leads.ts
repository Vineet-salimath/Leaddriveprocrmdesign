export type LeadStatus = "New" | "Contacted" | "Qualified" | "Test Drive" | "Closed Won" | "Lost";
export type LeadSource = "Walk-in" | "Website" | "Referral" | "Social Media" | "Phone" | "Auto Expo";

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  carInterest: string;
  budget: string;
  source: LeadSource;
  status: LeadStatus;
  assignedTo: string;
  followUpDate: string;
  leadScore: number;
  createdAt: string;
  notes?: string;
  avatar: string;
}

export interface Activity {
  id: string;
  leadId: string;
  type: "note" | "call" | "email" | "follow-up" | "status-change" | "test-drive";
  content: string;
  user: string;
  timestamp: string;
}

export const leads: Lead[] = [
  {
    id: "L001",
    name: "Rajesh Kumar",
    phone: "+91 98765 43210",
    email: "rajesh.kumar@gmail.com",
    carInterest: "Hyundai Creta 2024",
    budget: "₹15–18 Lakhs",
    source: "Website",
    status: "New",
    assignedTo: "Priya Sharma",
    followUpDate: "2026-02-26",
    leadScore: 82,
    createdAt: "2026-02-24",
    avatar: "RK",
    notes: "Interested in petrol variant, wants EMI options",
  },
  {
    id: "L002",
    name: "Meena Patel",
    phone: "+91 87654 32109",
    email: "meena.patel@yahoo.com",
    carInterest: "Maruti Brezza",
    budget: "₹12–14 Lakhs",
    source: "Referral",
    status: "Contacted",
    assignedTo: "Arjun Singh",
    followUpDate: "2026-02-25",
    leadScore: 74,
    createdAt: "2026-02-22",
    avatar: "MP",
    notes: "Called twice, prefers weekend visit",
  },
  {
    id: "L003",
    name: "Suresh Nair",
    phone: "+91 76543 21098",
    email: "suresh.nair@outlook.com",
    carInterest: "Tata Nexon EV",
    budget: "₹18–22 Lakhs",
    source: "Auto Expo",
    status: "Qualified",
    assignedTo: "Kavya Reddy",
    followUpDate: "2026-02-27",
    leadScore: 91,
    createdAt: "2026-02-20",
    avatar: "SN",
    notes: "Very interested, comparing with MG ZS EV",
  },
  {
    id: "L004",
    name: "Anita Desai",
    phone: "+91 65432 10987",
    email: "anita.desai@gmail.com",
    carInterest: "Honda City",
    budget: "₹13–16 Lakhs",
    source: "Walk-in",
    status: "Test Drive",
    assignedTo: "Priya Sharma",
    followUpDate: "2026-02-28",
    leadScore: 88,
    createdAt: "2026-02-19",
    avatar: "AD",
    notes: "Took test drive, awaiting final decision",
  },
  {
    id: "L005",
    name: "Vikram Mehta",
    phone: "+91 54321 09876",
    email: "vikram.mehta@gmail.com",
    carInterest: "MG Hector Plus",
    budget: "₹22–25 Lakhs",
    source: "Social Media",
    status: "Closed Won",
    assignedTo: "Arjun Singh",
    followUpDate: "2026-02-20",
    leadScore: 95,
    createdAt: "2026-02-10",
    avatar: "VM",
    notes: "Booked on Feb 20, delivery scheduled March 5",
  },
  {
    id: "L006",
    name: "Deepa Krishnan",
    phone: "+91 43210 98765",
    email: "deepa.k@gmail.com",
    carInterest: "Toyota Innova Crysta",
    budget: "₹20–24 Lakhs",
    source: "Phone",
    status: "Lost",
    assignedTo: "Kavya Reddy",
    followUpDate: "2026-02-15",
    leadScore: 45,
    createdAt: "2026-02-05",
    avatar: "DK",
    notes: "Went with competitor dealership",
  },
  {
    id: "L007",
    name: "Rohit Sharma",
    phone: "+91 99887 66554",
    email: "rohit.sharma@gmail.com",
    carInterest: "Kia Seltos",
    budget: "₹16–19 Lakhs",
    source: "Website",
    status: "New",
    assignedTo: "Priya Sharma",
    followUpDate: "2026-02-26",
    leadScore: 70,
    createdAt: "2026-02-24",
    avatar: "RS",
    notes: "Filled enquiry form today morning",
  },
  {
    id: "L008",
    name: "Pooja Iyer",
    phone: "+91 88776 55443",
    email: "pooja.iyer@gmail.com",
    carInterest: "Hyundai Verna",
    budget: "₹11–13 Lakhs",
    source: "Referral",
    status: "Contacted",
    assignedTo: "Arjun Singh",
    followUpDate: "2026-02-27",
    leadScore: 66,
    createdAt: "2026-02-21",
    avatar: "PI",
    notes: "Referred by Vikram Mehta",
  },
  {
    id: "L009",
    name: "Arun Gupta",
    phone: "+91 77665 44332",
    email: "arun.gupta@outlook.com",
    carInterest: "Tata Safari",
    budget: "₹24–28 Lakhs",
    source: "Auto Expo",
    status: "Qualified",
    assignedTo: "Kavya Reddy",
    followUpDate: "2026-03-01",
    leadScore: 85,
    createdAt: "2026-02-18",
    avatar: "AG",
  },
  {
    id: "L010",
    name: "Sneha Joshi",
    phone: "+91 66554 33221",
    email: "sneha.joshi@gmail.com",
    carInterest: "Maruti Swift",
    budget: "₹7–9 Lakhs",
    source: "Social Media",
    status: "New",
    assignedTo: "Priya Sharma",
    followUpDate: "2026-02-28",
    leadScore: 58,
    createdAt: "2026-02-23",
    avatar: "SJ",
  },
];

export const activities: Activity[] = [
  {
    id: "A001",
    leadId: "L001",
    type: "note",
    content: "Customer enquired about petrol variant and finance options. Very responsive on WhatsApp.",
    user: "Priya Sharma",
    timestamp: "2026-02-24T10:30:00",
  },
  {
    id: "A002",
    leadId: "L001",
    type: "call",
    content: "Called customer, spoke for 8 minutes. Interested in EMI of ₹18,000/month.",
    user: "Priya Sharma",
    timestamp: "2026-02-23T14:15:00",
  },
  {
    id: "A003",
    leadId: "L001",
    type: "email",
    content: "Sent brochure and price list for Creta 2024 petrol and diesel variants.",
    user: "System",
    timestamp: "2026-02-22T09:00:00",
  },
  {
    id: "A004",
    leadId: "L001",
    type: "status-change",
    content: "Status changed from 'Contacted' to 'New'",
    user: "Priya Sharma",
    timestamp: "2026-02-21T16:45:00",
  },
  {
    id: "A005",
    leadId: "L001",
    type: "follow-up",
    content: "Follow-up scheduled for Feb 26, 2026 at 11:00 AM",
    user: "Priya Sharma",
    timestamp: "2026-02-21T16:50:00",
  },
];

export const salesReps = [
  { id: "R001", name: "Priya Sharma", leads: 28, closed: 9, revenue: "₹47.2L", avatar: "PS", convRate: "32%", target: 75 },
  { id: "R002", name: "Arjun Singh", leads: 24, closed: 7, revenue: "₹38.6L", avatar: "AS", convRate: "29%", target: 65 },
  { id: "R003", name: "Kavya Reddy", leads: 31, closed: 11, revenue: "₹62.1L", avatar: "KR", convRate: "35%", target: 85 },
  { id: "R004", name: "Rahul Verma", leads: 19, closed: 5, revenue: "₹29.4L", avatar: "RV", convRate: "26%", target: 50 },
];

export const kpiData = {
  totalLeads: 148,
  newToday: 12,
  conversionRate: "31.2%",
  revenueClosed: "₹2.34 Cr",
  avgResponseTime: "18 min",
};

export const leadsBySource = [
  { source: "Website", leads: 42 },
  { source: "Referral", leads: 31 },
  { source: "Walk-in", leads: 28 },
  { source: "Social Media", leads: 24 },
  { source: "Auto Expo", leads: 15 },
  { source: "Phone", leads: 8 },
];

export const monthlyTrend = [
  { month: "Sep", leads: 78, closed: 22 },
  { month: "Oct", leads: 95, closed: 29 },
  { month: "Nov", leads: 87, closed: 24 },
  { month: "Dec", leads: 110, closed: 35 },
  { month: "Jan", leads: 132, closed: 41 },
  { month: "Feb", leads: 148, closed: 46 },
];

export const funnelData = [
  { stage: "Total Leads", count: 148, color: "#2563EB" },
  { stage: "Contacted", count: 112, color: "#3B82F6" },
  { stage: "Qualified", count: 74, color: "#60A5FA" },
  { stage: "Test Drive", count: 46, color: "#93C5FD" },
  { stage: "Closed Won", count: 46, color: "#10B981" },
];
