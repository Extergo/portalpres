// First let's update the Patient interface to include the email field
export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  contact: string;
  email: string; // Added email field
  lastVisit: string;
  nextAppointment: string;
  status: string;
  insuranceProvider: string;
  policyNumber: string;
  profileImage: string;
  notes?: string; // Added optional notes field for patient reports
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

// New interface for patient reports
export interface PatientReport {
  id: string;
  patientId: string;
  date: string;
  content: string;
  createdBy: string;
}
