import React, { useState } from "react";
import {
  Edit,
  Calendar,
  FileText,
  Mail,
  MoreHorizontal,
  Clipboard,
} from "lucide-react";
import { Patient } from "@/types/types";

interface PatientCardProps {
  patient: Patient;
  onEdit?: () => void;
  onBookAppointment?: (patient: Patient) => void;
  onViewReport?: (patient: Patient) => void;
  onEmailResponse?: (email: string) => void;
  onPrescribeMedication?: (patient: Patient) => void;
}

export const PatientCard: React.FC<PatientCardProps> = ({
  patient,
  onEdit,
  onBookAppointment,
  onViewReport,
  onEmailResponse,
  onPrescribeMedication,
}) => {
  const [showActions, setShowActions] = useState(false);

  const handleBookAppointment = () => {
    if (onBookAppointment) {
      onBookAppointment(patient);
    }
  };

  const handleViewReport = () => {
    if (onViewReport) {
      onViewReport(patient);
    }
  };

  const handleEmailResponse = () => {
    if (onEmailResponse) {
      onEmailResponse(patient.email);
    }
  };

  const handlePrescribeMedication = () => {
    if (onPrescribeMedication) {
      onPrescribeMedication(patient);
    }
  };

  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center space-x-4">
        <img
          src={patient.profileImage}
          alt={`${patient.name}'s profile`}
          className="h-12 w-12 rounded-full object-cover"
        />
        <div>
          <h3 className="text-sm font-medium text-gray-900">{patient.name}</h3>
          <p className="text-sm text-gray-500">
            {patient.age} years old | {patient.gender}
          </p>
          <div className="flex items-center space-x-2">
            <p className="text-sm text-gray-500">{patient.contact}</p>
            {patient.email && (
              <p className="text-sm text-gray-500">{patient.email}</p>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-2 relative">
        <div className="flex space-x-2">
          {/* Desktop View - Show buttons directly */}
          <div className="hidden md:flex space-x-2">
            {onEdit && (
              <button
                onClick={onEdit}
                className="text-gray-500 hover:text-blue-600 focus:outline-none p-1 rounded hover:bg-gray-100"
                title="Edit Patient"
              >
                <Edit className="h-5 w-5" />
              </button>
            )}
            {onBookAppointment && (
              <button
                onClick={handleBookAppointment}
                className="text-gray-500 hover:text-green-600 focus:outline-none p-1 rounded hover:bg-gray-100"
                title="Book Appointment"
              >
                <Calendar className="h-5 w-5" />
              </button>
            )}
            {onViewReport && (
              <button
                onClick={handleViewReport}
                className="text-gray-500 hover:text-yellow-600 focus:outline-none p-1 rounded hover:bg-gray-100"
                title="View Report"
              >
                <FileText className="h-5 w-5" />
              </button>
            )}
            {onEmailResponse && (
              <button
                onClick={handleEmailResponse}
                className="text-gray-500 hover:text-purple-600 focus:outline-none p-1 rounded hover:bg-gray-100"
                title="Email Patient"
              >
                <Mail className="h-5 w-5" />
              </button>
            )}
            {onPrescribeMedication && (
              <button
                onClick={handlePrescribeMedication}
                className="text-gray-500 hover:text-red-600 focus:outline-none p-1 rounded hover:bg-gray-100"
                title="Prescribe Medication"
              >
                <Clipboard className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Mobile View - Show dropdown menu */}
          <div className="md:hidden">
            <button
              onClick={() => setShowActions(!showActions)}
              className="text-gray-500 hover:text-blue-600 focus:outline-none"
              title="More Actions"
            >
              <MoreHorizontal className="h-5 w-5" />
            </button>
            {showActions && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                {onEdit && (
                  <button
                    onClick={() => {
                      onEdit();
                      setShowActions(false);
                    }}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Patient
                  </button>
                )}
                {onBookAppointment && (
                  <button
                    onClick={() => {
                      handleBookAppointment();
                      setShowActions(false);
                    }}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Book Appointment
                  </button>
                )}
                {onViewReport && (
                  <button
                    onClick={() => {
                      handleViewReport();
                      setShowActions(false);
                    }}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    View Report
                  </button>
                )}
                {onEmailResponse && (
                  <button
                    onClick={() => {
                      handleEmailResponse();
                      setShowActions(false);
                    }}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Email Patient
                  </button>
                )}
                {onPrescribeMedication && (
                  <button
                    onClick={() => {
                      handlePrescribeMedication();
                      setShowActions(false);
                    }}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    <Clipboard className="h-4 w-4 mr-2" />
                    Prescribe Medication
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientCard;
