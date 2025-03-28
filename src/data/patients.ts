import { Patient, Appointment } from "../types/types";

export const patients: Patient[] = [
  {
    id: "P1001",
    name: "Emma Johnson",
    age: 42,
    gender: "Female",
    contact: "+1 (555) 123-4567",
    email: "emma.johnson@example.com",
    lastVisit: "2025-02-25",
    nextAppointment: "2025-03-05",
    status: "Active",
    insuranceProvider: "Blue Cross",
    policyNumber: "BC7890123",
    profileImage: "https://avatars.dicebear.com/api/personas/Emma-Johnson.svg",
    notes:
      "Patient has a history of hypertension. Currently on medication and responding well. Diet restrictions advised.",
  },
  {
    id: "P1002",
    name: "Michael Chen",
    age: 35,
    gender: "Male",
    contact: "+1 (555) 987-6543",
    email: "michael.chen@example.com",
    lastVisit: "2025-02-28",
    nextAppointment: "2025-03-10",
    status: "Active",
    insuranceProvider: "Aetna",
    policyNumber: "AE4567890",
    profileImage: "https://avatars.dicebear.com/api/personas/Michael-Chen.svg",
    notes:
      "Regular check-up patient. No major health concerns. Recommended annual screenings.",
  },
  {
    id: "P1003",
    name: "Sophia Martinez",
    age: 28,
    gender: "Female",
    contact: "+1 (555) 456-7890",
    email: "sophia.martinez@example.com",
    lastVisit: "2025-01-15",
    nextAppointment: "2025-03-03",
    status: "Active",
    insuranceProvider: "United Healthcare",
    policyNumber: "UH1234567",
    profileImage:
      "https://avatars.dicebear.com/api/personas/Sophia-Martinez.svg",
    notes:
      "Patient reported mild allergic reactions to seasonal changes. Prescribed antihistamines as needed.",
  },
  {
    id: "P1004",
    name: "James Wilson",
    age: 59,
    gender: "Male",
    contact: "+1 (555) 789-0123",
    email: "james.wilson@example.com",
    lastVisit: "2025-02-10",
    nextAppointment: "2025-03-15",
    status: "Critical",
    insuranceProvider: "Medicare",
    policyNumber: "MC7891234",
    profileImage: "https://avatars.dicebear.com/api/personas/James-Wilson.svg",
    notes:
      "Patient has been diagnosed with type 2 diabetes. Regular monitoring required. Referred to nutritionist for dietary advice.",
  },
  {
    id: "P1005",
    name: "Olivia Brown",
    age: 31,
    gender: "Female",
    contact: "+1 (555) 234-5678",
    email: "olivia.brown@example.com",
    lastVisit: "2025-02-20",
    nextAppointment: "2025-03-07",
    status: "Pending",
    insuranceProvider: "Cigna",
    policyNumber: "CI5678901",
    profileImage: "https://avatars.dicebear.com/api/personas/Olivia-Brown.svg",
    notes:
      "First-time patient. Came in for general check-up. All vitals normal. Recommended preventive screenings.",
  },
];

export const appointments: Appointment[] = [
  {
    id: "A2001",
    patientId: "P1003",
    patientName: "Sophia Martinez",
    profileImage:
      "https://avatars.dicebear.com/api/personas/Sophia-Martinez.svg",
    date: "2025-03-03",
    time: "09:30 AM",
    type: "Follow-up",
    status: "Confirmed",
  },
  {
    id: "A2002",
    patientId: "P1001",
    patientName: "Emma Johnson",
    profileImage: "https://avatars.dicebear.com/api/personas/Emma-Johnson.svg",
    date: "2025-03-05",
    time: "11:00 AM",
    type: "Check-up",
    status: "Confirmed",
  },
  {
    id: "A2003",
    patientId: "P1005",
    patientName: "Olivia Brown",
    profileImage: "https://avatars.dicebear.com/api/personas/Olivia-Brown.svg",
    date: "2025-03-07",
    time: "02:15 PM",
    type: "Consultation",
    status: "Pending",
  },
  {
    id: "A2004",
    patientId: "P1002",
    patientName: "Michael Chen",
    profileImage: "https://avatars.dicebear.com/api/personas/Michael-Chen.svg",
    date: "2025-03-10",
    time: "10:45 AM",
    type: "Test Results",
    status: "Confirmed",
  },
  {
    id: "A2005",
    patientId: "P1004",
    patientName: "James Wilson",
    profileImage: "https://avatars.dicebear.com/api/personas/James-Wilson.svg",
    date: "2025-03-15",
    time: "03:30 PM",
    type: "Specialist Referral",
    status: "Confirmed",
  },
];

export const stats = [
  {
    name: "Total Patients",
    value: 487,
    icon: "Users",
    change: "+12%",
    color: "bg-blue-100 text-blue-800",
  },
  {
    name: "Appointments Today",
    value: 24,
    icon: "Calendar",
    change: "+5%",
    color: "bg-green-100 text-green-800",
  },
  {
    name: "Critical Patients",
    value: 8,
    icon: "Activity",
    change: "-3%",
    color: "bg-red-100 text-red-800",
  },
  {
    name: "Avg. Wait Time",
    value: "18 min",
    icon: "Clock",
    change: "-10%",
    color: "bg-purple-100 text-purple-800",
  },
];
