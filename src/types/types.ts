// src/types/types.ts
export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  contact: string;
  email: string;
  lastVisit: string;
  nextAppointment: string;
  status: string;
  insuranceProvider: string;
  policyNumber: string;
  profileImage: string;
  notes?: string;
  conversationId?: string; // ID link to conversation in MongoDB
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  profileImage: string;
  date: string;
  time: string;
  type: string;
  status: string;
}

export interface PatientReport {
  id: string;
  patientId: string;
  date: string;
  content: string;
  createdBy: string;
}

// Define the structure for condition matches
export interface ConditionMatch {
  cond_name_eng: string;
  severity: "High" | "Moderate" | "Low";
  count: number;
}

// Interface for conversation data from the API
export interface Conversation {
  _id: string;
  chat: Array<Record<string, string>>;
  user_info: {
    name: string;
    email: string;
    phone_number: string;
  };
  report: any;
  // Add matches as a top-level field that may or may not exist
  matches?: {
    match_1?: ConditionMatch;
    match_2?: ConditionMatch;
    match_3?: ConditionMatch;
    match_4?: ConditionMatch;
    match_5?: ConditionMatch;
    [key: string]: ConditionMatch | undefined;
  };
  timestamp: string;
  isActive?: boolean;
}
