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
  conversationId?: string; // Added conversation ID to link to external API
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

// New interface for conversation data from the API
export interface Conversation {
  _id: string;
  chat: Array<Record<string, string>>;
  user_info: {
    name: string;
    email: string;
    phone_number: string;
  };
  report: any;
  timestamp: string;
}
