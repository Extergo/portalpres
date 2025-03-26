"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  Users,
  Calendar,
  Activity,
  Clock,
  Database,
} from "lucide-react";

import {
  AppointmentList,
  PatientCard,
  Stats,
  Sidebar,
  TopNavigation,
  PatientManagementModal,
} from "@/components";

// Import our components
import AppointmentBookingModal from "@/components/AppointmentBookingModal";
import PatientReportModal from "@/components/PatientReportModal";
import PrescribeMedicationModal from "@/components/PrescribeMedicationModal";
import ConversationHistoryModal from "@/components/ConversationHistoryModal";
import ConversationBrowser from "@/components/ConversationBrowser";

import { Patient, Appointment, PatientReport } from "@/types/types";
import { format } from "date-fns";

// Import our enhanced API service functions
import {
  getAllPatientsFromAPI,
  savePatientToAPI,
  deletePatientFromAPI,
  getAllAppointmentsFromAPI,
  saveAppointmentToAPI,
  savePatientReportToAPI,
  getPatientReportsFromAPI,
  saveConversation,
  fetchConversationById,
} from "@/lib/api";

// Define the prescription data interface
interface PrescriptionData {
  medications: string;
  dosage: string;
  instructions: string;
  notes: string;
  attachedPdf?: File | null;
}

export default function Home() {
  const [patientsData, setPatientsData] = useState<Patient[]>([]);
  const [appointmentsData, setAppointmentsData] = useState<Appointment[]>([]);
  const [reportsData, setReportsData] = useState<PatientReport[]>([]);
  const [prescriptionsData, setPrescriptionsData] = useState<any[]>([]); // Could create a proper type for this
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  // Modal states
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isPrescribeModalOpen, setIsPrescribeModalOpen] = useState(false);
  const [isConversationModalOpen, setIsConversationModalOpen] = useState(false);
  const [isConversationBrowserOpen, setIsConversationBrowserOpen] =
    useState(false);

  // Selected entities for modals
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  // Load all data from API on component mount
  useEffect(() => {
    loadAllData();
  }, []);

  // Function to load all data from API
  const loadAllData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Load patients from API
      const patients = await getAllPatientsFromAPI();
      setPatientsData(patients);

      // Load appointments from API
      const appointments = await getAllAppointmentsFromAPI();
      setAppointmentsData(appointments);

      // For reports, we'll load them when needed for specific patients
    } catch (err) {
      console.error("Failed to load data:", err);
      setError("Failed to load data from server. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to get icon component by name
  function getIconComponent(iconName: string) {
    switch (iconName) {
      case "Users":
        return <Users className="h-6 w-6" />;
      case "Calendar":
        return <Calendar className="h-6 w-6" />;
      case "Activity":
        return <Activity className="h-6 w-6" />;
      case "Clock":
        return <Clock className="h-6 w-6" />;
      default:
        return <Activity className="h-6 w-6" />;
    }
  }

  // Statistics data
  const statsData = [
    {
      name: "Total Patients",
      value: patientsData.length,
      icon: "Users",
      change: "+12%",
      color: "bg-blue-100 text-blue-800",
    },
    {
      name: "Appointments Today",
      value: appointmentsData.filter(
        (a) => new Date(a.date).toDateString() === new Date().toDateString()
      ).length,
      icon: "Calendar",
      change: "+5%",
      color: "bg-green-100 text-green-800",
    },
    {
      name: "Critical Patients",
      value: patientsData.filter((p) => p.status === "Critical").length,
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

  // Map icon strings to actual components for stats
  const stats = statsData.map((stat) => ({
    ...stat,
    icon: getIconComponent(stat.icon),
  }));

  // Handle adding a new patient
  const handleAddPatient = async (newPatient: Patient) => {
    try {
      // Save the patient to the API
      const success = await savePatientToAPI(newPatient);

      if (success) {
        // Refresh patient data from API to ensure we have the correct conversation ID
        await loadAllData();
      } else {
        console.error("Failed to add patient");
      }
    } catch (error) {
      console.error("Error adding patient:", error);
    }
  };

  // Handle updating an existing patient
  const handleUpdatePatient = async (updatedPatient: Patient) => {
    try {
      // Save the updated patient to API
      const success = await savePatientToAPI(updatedPatient);

      if (success) {
        // Update the local state with the new patient data
        setPatientsData((prevPatients) =>
          prevPatients.map((patient) =>
            patient.id === updatedPatient.id ? updatedPatient : patient
          )
        );
      } else {
        console.error("Failed to update patient");
      }
    } catch (error) {
      console.error("Error updating patient:", error);
    }
  };

  // Handle deleting a patient
  const handleDeletePatient = async (patientId: string) => {
    // Find the patient to get its conversation ID
    const patient = patientsData.find((p) => p.id === patientId);

    if (!patient || !patient.conversationId) {
      console.error(
        "Cannot delete patient: Patient ID or conversation ID not found"
      );
      return;
    }

    try {
      // Delete the patient from the API (mark as inactive)
      const success = await deletePatientFromAPI(
        patientId,
        patient.conversationId
      );

      if (success) {
        // Remove from local state
        setPatientsData((prevPatients) =>
          prevPatients.filter((patient) => patient.id !== patientId)
        );
      } else {
        console.error("Failed to delete patient");
      }
    } catch (error) {
      console.error("Error deleting patient:", error);
    }
  };

  // Open modal for editing a patient
  const handleEditPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsPatientModalOpen(true);
  };

  // Open modal for adding a new patient
  const handleOpenAddPatientModal = () => {
    setSelectedPatient(null);
    setIsPatientModalOpen(true);
  };

  // Handle booking an appointment
  const handleBookAppointment = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsAppointmentModalOpen(true);
  };

  // Handle saving a new appointment
  const handleSaveAppointment = async (
    patientId: string,
    date: string,
    time: string,
    type: string
  ) => {
    const patient = patientsData.find((p) => p.id === patientId);
    if (!patient) return;

    const newAppointment: Appointment = {
      id: `A${Math.floor(Math.random() * 10000)}`,
      patientId,
      patientName: patient.name,
      profileImage: patient.profileImage,
      date,
      time,
      type,
      status: "Pending",
    };

    try {
      // Save the appointment to API
      const success = await saveAppointmentToAPI(newAppointment);

      if (success) {
        // Update local state
        setAppointmentsData((prev) => [newAppointment, ...prev]);

        // Also update the patient's next appointment date
        const updatedPatient = {
          ...patient,
          nextAppointment: date,
        };

        // Save the updated patient
        await savePatientToAPI(updatedPatient);

        // Update patients list
        setPatientsData((prevPatients) =>
          prevPatients.map((p) => (p.id === patientId ? updatedPatient : p))
        );
      } else {
        console.error("Failed to save appointment");
      }
    } catch (error) {
      console.error("Error saving appointment:", error);
    }
  };

  // Handle viewing a patient report
  const handleViewReport = async (patient: Patient) => {
    setSelectedPatient(patient);

    // If the patient has a conversation ID, load their reports
    if (patient.conversationId) {
      try {
        const reports = await getPatientReportsFromAPI(patient.id);
        setReportsData(reports);
      } catch (error) {
        console.error("Error loading patient reports:", error);
      }
    }

    setIsReportModalOpen(true);
  };

  // Handle saving a patient report
  const handleSaveReport = async (patientId: string, reportContent: string) => {
    const patient = patientsData.find((p) => p.id === patientId);
    if (!patient) return;

    try {
      // Save the report to API
      const success = await savePatientReportToAPI(patientId, reportContent);

      if (success) {
        // Create a new report for local state
        const newReport: PatientReport = {
          id: `R${Math.floor(Math.random() * 10000)}`,
          patientId,
          date: new Date().toISOString(),
          content: reportContent,
          createdBy: "Sarah Miller", // Currently hardcoded, would come from auth in a real app
        };

        // Update reports list
        setReportsData((prev) => [newReport, ...prev]);

        // Also update the patient's notes
        const updatedPatient = {
          ...patient,
          notes: reportContent,
        };

        // Save the updated patient
        await savePatientToAPI(updatedPatient);

        // Update patients list
        setPatientsData((prevPatients) =>
          prevPatients.map((p) => (p.id === patientId ? updatedPatient : p))
        );
      } else {
        console.error("Failed to save report");
      }
    } catch (error) {
      console.error("Error saving report:", error);
    }
  };

  // Handle emailing a patient
  const handleEmailResponse = (email: string) => {
    // In a real application, this would integrate with an email client
    // For now, we'll just open the default email client with the patient's email
    window.location.href = `mailto:${email}`;
  };

  // Handle prescribing medication
  const handlePrescribeMedication = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsPrescribeModalOpen(true);
  };

  // Handle saving a prescription
  const handleSavePrescription = async (
    patientId: string,
    prescriptionData: PrescriptionData
  ) => {
    const patient = patientsData.find((p) => p.id === patientId);
    if (!patient || !patient.conversationId) return;

    try {
      // Get the existing conversation
      const conversation = await fetchConversationById(patient.conversationId);
      if (!conversation) {
        console.error("Failed to fetch conversation for patient");
        return;
      }

      // Create a new prescription
      const newPrescription = {
        id: `P${Math.floor(Math.random() * 10000)}`,
        patientId,
        patientName: patient.name,
        date: new Date().toISOString(),
        ...prescriptionData,
      };

      // Update the report with prescription data
      const updatedReport = {
        ...(conversation.report || {}),
        prescriptions: [
          ...((conversation.report?.prescriptions || []) as any[]),
          newPrescription,
        ],
      };

      // Add a message to the chat about the prescription
      const updatedChat = [
        ...conversation.chat,
        {
          Doctor: `Prescribed medication: ${
            prescriptionData.medications
          }. Dosage: ${prescriptionData.dosage}. ${
            prescriptionData.notes
              ? `Additional notes: ${prescriptionData.notes}`
              : ""
          }`,
        },
      ];

      // Save the updated conversation
      const result = await saveConversation(
        updatedChat,
        conversation.user_info,
        updatedReport
      );

      if (result.success) {
        // Update local state
        setPrescriptionsData((prev) => [newPrescription, ...prev]);
      } else {
        console.error("Failed to save prescription");
      }
    } catch (error) {
      console.error("Error saving prescription:", error);
    }
  };

  // Handle viewing conversation history
  const handleViewConversation = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsConversationModalOpen(true);
  };

  // Handle updating conversation ID
  const handleUpdateConversationId = async (
    patientId: string,
    conversationId: string
  ) => {
    // Find the patient
    const patient = patientsData.find((p) => p.id === patientId);
    if (!patient) {
      console.error("Patient not found");
      return;
    }

    // Update the patient with the new conversation ID
    const updatedPatient = {
      ...patient,
      conversationId,
    };

    try {
      // Save the updated patient
      const success = await savePatientToAPI(updatedPatient);

      if (success) {
        // Update local state
        setPatientsData((prevPatients) =>
          prevPatients.map((p) => (p.id === patientId ? updatedPatient : p))
        );
      } else {
        console.error("Failed to update conversation ID");
      }
    } catch (error) {
      console.error("Error updating conversation ID:", error);
    }
  };

  // Filter patients based on search term
  const filteredPatients = patientsData.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (patient.email &&
        patient.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Filter appointments based on active filter
  const filteredAppointments =
    activeFilter === "All"
      ? appointmentsData
      : appointmentsData.filter(
          (appointment) => appointment.status === activeFilter
        );

  // Get patient reports for the selected patient
  const patientReports = selectedPatient
    ? reportsData.filter((report) => report.patientId === selectedPatient.id)
    : [];

  // If data is loading, show loading state
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mb-4">
            <Activity className="h-12 w-12 animate-pulse text-blue-500 mx-auto" />
          </div>
          <h1 className="text-xl font-semibold text-gray-900 mb-2">
            Loading PulseAI Portal
          </h1>
          <p className="text-gray-500">Retrieving data from server...</p>
        </div>
      </div>
    );
  }

  // If there was an error loading data, show error state
  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
          <div className="mb-4 text-red-500">
            <Activity className="h-12 w-12 mx-auto" />
          </div>
          <h1 className="text-xl font-semibold text-gray-900 mb-2">
            Error Loading Data
          </h1>
          <p className="text-gray-700 mb-4">{error}</p>
          <button
            onClick={loadAllData}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Patient Management Modal */}
      <PatientManagementModal
        isOpen={isPatientModalOpen}
        onClose={() => setIsPatientModalOpen(false)}
        onSavePatient={selectedPatient ? handleUpdatePatient : handleAddPatient}
        onDeletePatient={handleDeletePatient}
        initialPatient={selectedPatient}
      />

      {/* Appointment Booking Modal */}
      {selectedPatient && (
        <AppointmentBookingModal
          isOpen={isAppointmentModalOpen}
          onClose={() => setIsAppointmentModalOpen(false)}
          patient={selectedPatient}
          onSaveAppointment={handleSaveAppointment}
        />
      )}

      {/* Patient Report Modal */}
      {selectedPatient && (
        <PatientReportModal
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
          patient={selectedPatient}
          onSaveReport={handleSaveReport}
          existingReports={patientReports}
        />
      )}

      {/* Prescribe Medication Modal */}
      {selectedPatient && (
        <PrescribeMedicationModal
          isOpen={isPrescribeModalOpen}
          onClose={() => setIsPrescribeModalOpen(false)}
          patient={selectedPatient}
          onSendPrescription={handleSavePrescription}
        />
      )}

      {/* Conversation History Modal */}
      {selectedPatient && (
        <ConversationHistoryModal
          isOpen={isConversationModalOpen}
          onClose={() => setIsConversationModalOpen(false)}
          patient={selectedPatient}
          onUpdateConversationId={handleUpdateConversationId}
        />
      )}

      {/* Conversation Browser Modal */}
      <ConversationBrowser
        isOpen={isConversationBrowserOpen}
        onClose={() => setIsConversationBrowserOpen(false)}
        patients={patientsData}
        onLinkConversation={handleUpdateConversationId}
      />
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top navigation */}
        <TopNavigation />

        {/* Main area */}
        <main className="flex-1 overflow-auto bg-gray-50 p-4 sm:p-6 lg:p-8">
          {/* Stats */}
          <Stats stats={stats} />

          {/* Search and filters */}
          <div className="mt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
            <div className="relative w-full sm:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Search patients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex space-x-3 w-full sm:w-auto">
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </button>
              <button
                onClick={() => setIsConversationBrowserOpen(true)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Database className="h-4 w-4 mr-2" />
                Chat Database
              </button>
              <button
                onClick={handleOpenAddPatientModal}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Patient
              </button>
            </div>
          </div>
          {/* Content grid */}
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Patient List */}
            <div className="bg-white rounded-lg shadow col-span-2">
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900">Patients</h2>
                <div className="mt-4 space-y-4">
                  {filteredPatients.length > 0 ? (
                    filteredPatients.map((patient) => (
                      <div
                        key={patient.id}
                        className="flex items-center justify-between hover:bg-gray-50 p-2 rounded-md transition-colors"
                      >
                        <PatientCard
                          patient={patient}
                          onEdit={() => handleEditPatient(patient)}
                          onBookAppointment={handleBookAppointment}
                          onViewReport={handleViewReport}
                          onEmailResponse={handleEmailResponse}
                          onPrescribeMedication={handlePrescribeMedication}
                          onViewConversation={handleViewConversation}
                        />
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">
                      No patients match your search criteria.
                    </p>
                  )}
                </div>
                <div className="mt-6 flex justify-between items-center">
                  <p className="text-sm text-gray-500">
                    Showing {filteredPatients.length} of {patientsData.length}{" "}
                    patients
                  </p>
                  <div className="flex space-x-2">
                    <button className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                      Previous
                    </button>
                    <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Appointments */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-medium text-gray-900">
                    Upcoming Appointments
                  </h2>
                  <button>
                    <MoreHorizontal className="h-5 w-5 text-gray-400" />
                  </button>
                </div>
                <div className="mt-4 flex space-x-3 overflow-x-auto">
                  <button
                    className={`px-3 py-1 text-sm rounded-full whitespace-nowrap ${
                      activeFilter === "All"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                    onClick={() => setActiveFilter("All")}
                  >
                    All
                  </button>
                  <button
                    className={`px-3 py-1 text-sm rounded-full whitespace-nowrap ${
                      activeFilter === "Confirmed"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                    onClick={() => setActiveFilter("Confirmed")}
                  >
                    Confirmed
                  </button>
                  <button
                    className={`px-3 py-1 text-sm rounded-full whitespace-nowrap ${
                      activeFilter === "Pending"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                    onClick={() => setActiveFilter("Pending")}
                  >
                    Pending
                  </button>
                </div>
                <div className="mt-4">
                  <AppointmentList appointments={filteredAppointments} />
                </div>
                <div className="mt-4">
                  <button className="w-full px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    View All Appointments
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
