// src/lib/api.ts
import {
  Conversation,
  Patient,
  Appointment,
  PatientReport,
  ConditionMatch,
} from "@/types/types";

const API_BASE_URL = "http://localhost:5000"; // Update this with your API URL

// Conversation endpoints
export async function fetchConversationById(
  id: string
): Promise<Conversation | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/log/${id}`);

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data as Conversation;
  } catch (error) {
    console.error("Error fetching conversation:", error);
    return null;
  }
}

export async function fetchAllConversations(): Promise<Conversation[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/log`);

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data as Conversation[];
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return [];
  }
}

export async function saveConversation(
  chat: Array<Record<string, string>>,
  user_info: { name: string; email: string; phone_number: string },
  report: any,
  matches?: Record<string, ConditionMatch>
): Promise<{ success: boolean; saved?: Conversation; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/log`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ chat, user_info, report, matches }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error saving conversation:", error);
    return { success: false, error: "Failed to save conversation" };
  }
}

export async function updateConversation(
  id: string,
  updates: {
    chat?: Array<Record<string, string>>;
    user_info?: { name: string; email: string; phone_number: string };
    report?: any;
    matches?: Record<string, ConditionMatch>;
  }
): Promise<{ success: boolean; updated?: Conversation; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/log/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating conversation:", error);
    return { success: false, error: "Failed to update conversation" };
  }
}

export async function deleteConversation(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/log/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error deleting conversation:", error);
    return { success: false, error: "Failed to delete conversation" };
  }
}

// Extract patient info from conversation
export function extractPatientFromConversation(
  conversation: Conversation
): Patient | null {
  if (!conversation || !conversation.user_info) {
    return null;
  }

  // Extract basic info from the conversation
  const { user_info, _id, report, matches } = conversation;

  // Try to extract age, gender from report or chat context
  let age = 0;
  let gender = "";
  let notes = "";

  // If we have a structured report, try to extract from there
  if (report && typeof report === "object") {
    // Attempt to extract from various possible report structures
    if (report.patient_info) {
      age = report.patient_info.age || 0;
      gender = report.patient_info.gender || "";
    }

    // Try to extract notes from the report
    notes = report.summary || report.assessment || "";
  }

  // If not found in the report, try to search in the chat
  if ((!age || !gender) && conversation.chat && conversation.chat.length > 0) {
    // Search for age and gender mentions in the chat
    const chatText = conversation.chat
      .map((msg) => Object.values(msg)[0])
      .join(" ")
      .toLowerCase();

    // Very basic extraction - in a real app, you'd want more sophisticated NLP
    const ageMatch = chatText.match(/\b(\d+)\s*(?:years old|yrs|year old)\b/i);
    if (ageMatch && !age) {
      age = parseInt(ageMatch[1], 10);
    }

    // Simple gender detection
    if (!gender) {
      if (chatText.includes(" male ") || chatText.includes("i am male")) {
        gender = "Male";
      } else if (
        chatText.includes(" female ") ||
        chatText.includes("i am female")
      ) {
        gender = "Female";
      }
    }
  }

  // Generate a patient ID if none exists
  const patientId = `PT-${_id.substring(0, 8)}`;

  // Create a patient object from the conversation data
  const patient: Patient = {
    id: patientId,
    name: user_info.name || "Unknown Patient",
    age: age || 30, // Default age if we couldn't extract it
    gender: gender || "Unknown",
    contact: user_info.phone_number || "",
    email: user_info.email || "",
    lastVisit: new Date().toISOString().split("T")[0], // Today's date as last visit
    nextAppointment: "",
    status: "Active",
    insuranceProvider: "",
    policyNumber: "",
    profileImage: `https://avatars.dicebear.com/api/personas/${
      user_info.name || patientId
    }.svg`,
    notes: notes,
    conversationId: _id,
  };

  return patient;
}

// Convert all conversations to patients
export async function getAllPatientsFromAPI(): Promise<Patient[]> {
  try {
    const conversations = await fetchAllConversations();

    // Filter out conversations without proper user info
    const validConversations = conversations.filter(
      (conv) => conv && conv.user_info && conv.user_info.name
    );

    // Map conversations to patients
    const patients = validConversations
      .map(extractPatientFromConversation)
      .filter((patient): patient is Patient => patient !== null);

    return patients;
  } catch (error) {
    console.error("Error loading patients from API:", error);
    return [];
  }
}

// Save patient data by updating the conversation
export async function savePatientToAPI(patient: Patient): Promise<boolean> {
  // If there's no conversation ID, we need to create a new conversation
  if (!patient.conversationId) {
    // Create basic condition matches for new patients
    const matches = {
      match_1: {
        cond_name_eng: "Check Required",
        severity: "Moderate",
        count: 1,
      },
    };

    // Create a minimal conversation to represent this patient
    const result = await saveConversation(
      [{ User: `Initial patient record for ${patient.name}` }],
      {
        name: patient.name,
        email: patient.email,
        phone_number: patient.contact,
      },
      {
        patient_info: {
          age: patient.age,
          gender: patient.gender,
        },
        summary: patient.notes || "New patient record",
      },
      matches
    );

    if (result.success && result.saved) {
      // Update the patient with the new conversation ID
      patient.conversationId = result.saved._id;
      return true;
    }
    return false;
  }

  // If there is a conversation ID, try to fetch and update it
  const existingConversation = await fetchConversationById(
    patient.conversationId
  );
  if (!existingConversation) {
    return false;
  }

  // Update the conversation with the latest patient data
  const updatedUserInfo = {
    ...existingConversation.user_info,
    name: patient.name,
    email: patient.email,
    phone_number: patient.contact,
  };

  // Update or create a report object with patient info
  const updatedReport = existingConversation.report || {};
  if (typeof updatedReport === "object") {
    updatedReport.patient_info = {
      ...(updatedReport.patient_info || {}),
      age: patient.age,
      gender: patient.gender,
    };

    if (patient.notes) {
      updatedReport.summary = patient.notes;
    }
  }

  // Keep the existing matches
  const updatedMatches = existingConversation.matches;

  // Save the updated conversation
  const result = await updateConversation(patient.conversationId, {
    chat: existingConversation.chat,
    user_info: updatedUserInfo,
    report: updatedReport,
    matches: updatedMatches,
  });

  return result.success;
}

// Delete a patient (mark as inactive in API)
export async function deletePatientFromAPI(
  patientId: string,
  conversationId?: string
): Promise<boolean> {
  if (!conversationId) {
    return false;
  }

  // Mark the conversation as inactive
  const result = await deleteConversation(conversationId);
  return result.success;
}

// Functions for appointments would work similarly - stored in conversation report
export async function saveAppointmentToAPI(
  appointment: Appointment
): Promise<boolean> {
  // Get the patient associated with this appointment
  const patients = await getAllPatientsFromAPI();
  const patient = patients.find((p) => p.id === appointment.patientId);

  if (!patient || !patient.conversationId) {
    return false;
  }

  // Fetch the existing conversation
  const conversation = await fetchConversationById(patient.conversationId);
  if (!conversation) {
    return false;
  }

  // Update the report with appointment info
  const updatedReport = {
    ...(conversation.report || {}),
    appointments: [
      ...((conversation.report?.appointments || []) as Appointment[]),
      appointment,
    ],
  };

  // Save the updated conversation
  const result = await updateConversation(patient.conversationId, {
    report: updatedReport,
  });

  return result.success;
}

// Get all appointments from the API
export async function getAllAppointmentsFromAPI(): Promise<Appointment[]> {
  try {
    const conversations = await fetchAllConversations();

    // Extract appointments from all conversations
    const appointments: Appointment[] = [];

    conversations.forEach((conversation) => {
      if (
        conversation.report &&
        conversation.report.appointments &&
        Array.isArray(conversation.report.appointments)
      ) {
        appointments.push(...conversation.report.appointments);
      }
    });

    return appointments;
  } catch (error) {
    console.error("Error loading appointments from API:", error);
    return [];
  }
}

// Similar function for patient reports
export async function savePatientReportToAPI(
  patientId: string,
  reportContent: string
): Promise<boolean> {
  // Get the patient
  const patients = await getAllPatientsFromAPI();
  const patient = patients.find((p) => p.id === patientId);

  if (!patient || !patient.conversationId) {
    return false;
  }

  // Fetch the existing conversation
  const conversation = await fetchConversationById(patient.conversationId);
  if (!conversation) {
    return false;
  }

  // Create a new report entry
  const newReport: PatientReport = {
    id: `R${Math.floor(Math.random() * 10000)}`,
    patientId,
    date: new Date().toISOString(),
    content: reportContent,
    createdBy: "Dr. Sarah Miller", // This would come from auth in a real app
  };

  // Update the report structure
  const updatedReport = {
    ...(conversation.report || {}),
    patientReports: [
      ...((conversation.report?.patientReports || []) as PatientReport[]),
      newReport,
    ],
    // Also update the main summary/notes
    summary: reportContent,
  };

  // Save the updated conversation
  const result = await updateConversation(patient.conversationId, {
    report: updatedReport,
  });

  return result.success;
}

// Get all patient reports from API
export async function getPatientReportsFromAPI(
  patientId: string
): Promise<PatientReport[]> {
  try {
    // Get the patient
    const patients = await getAllPatientsFromAPI();
    const patient = patients.find((p) => p.id === patientId);

    if (!patient || !patient.conversationId) {
      return [];
    }

    // Fetch the conversation
    const conversation = await fetchConversationById(patient.conversationId);
    if (
      !conversation ||
      !conversation.report ||
      !conversation.report.patientReports
    ) {
      return [];
    }

    return conversation.report.patientReports as PatientReport[];
  } catch (error) {
    console.error("Error loading patient reports from API:", error);
    return [];
  }
}
