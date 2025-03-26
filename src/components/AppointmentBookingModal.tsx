import React, { useState } from "react";
import { X } from "lucide-react";
import { Patient } from "@/types/types";
import { format } from "date-fns";

interface AppointmentBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient;
  onSaveAppointment: (
    patientId: string,
    date: string,
    time: string,
    type: string
  ) => void;
}

const AppointmentBookingModal: React.FC<AppointmentBookingModalProps> = ({
  isOpen,
  onClose,
  patient,
  onSaveAppointment,
}) => {
  const today = new Date();
  const formattedToday = format(today, "yyyy-MM-dd");

  const [appointmentDate, setAppointmentDate] = useState(formattedToday);
  const [appointmentTime, setAppointmentTime] = useState("09:00");
  const [appointmentType, setAppointmentType] = useState("Check-up");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveAppointment(
      patient.id,
      appointmentDate,
      appointmentTime,
      appointmentType
    );
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#f0f0f0] bg-opacity-80">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Book Appointment for {patient.name}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label
              htmlFor="appointmentDate"
              className="block text-sm font-medium text-gray-700"
            >
              Appointment Date
            </label>
            <input
              type="date"
              id="appointmentDate"
              value={appointmentDate}
              min={formattedToday}
              onChange={(e) => setAppointmentDate(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label
              htmlFor="appointmentTime"
              className="block text-sm font-medium text-gray-700"
            >
              Appointment Time
            </label>
            <input
              type="time"
              id="appointmentTime"
              value={appointmentTime}
              onChange={(e) => setAppointmentTime(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label
              htmlFor="appointmentType"
              className="block text-sm font-medium text-gray-700"
            >
              Appointment Type
            </label>
            <select
              id="appointmentType"
              value={appointmentType}
              onChange={(e) => setAppointmentType(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              required
            >
              <option value="Check-up">Check-up</option>
              <option value="Follow-up">Follow-up</option>
              <option value="Consultation">Consultation</option>
              <option value="Test Results">Test Results</option>
              <option value="Specialist Referral">Specialist Referral</option>
            </select>
          </div>
          <div className="pt-4 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Book Appointment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentBookingModal;
