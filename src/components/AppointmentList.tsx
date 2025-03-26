"use client";

import React from "react";
import { Appointment } from "@/types";

interface AppointmentListProps {
  appointments: Appointment[];
}

const AppointmentList: React.FC<AppointmentListProps> = ({ appointments }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmed":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Check-up":
        return "bg-blue-100 text-blue-800";
      case "Follow-up":
        return "bg-purple-100 text-purple-800";
      case "Consultation":
        return "bg-indigo-100 text-indigo-800";
      case "Test Results":
        return "bg-teal-100 text-teal-800";
      case "Specialist Referral":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="divide-y divide-gray-200">
      {appointments.length > 0 ? (
        appointments.map((appointment) => (
          <div
            key={appointment.id}
            className="py-3 flex justify-between items-center"
          >
            <div className="flex space-x-3">
              <img
                src={appointment.profileImage}
                alt={appointment.patientName}
                className="h-10 w-10 rounded-full"
              />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {appointment.patientName}
                </p>
                <div className="flex space-x-2 mt-1">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getTypeColor(
                      appointment.type
                    )}`}
                  >
                    {appointment.type}
                  </span>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                      appointment.status
                    )}`}
                  >
                    {appointment.status}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">
                {appointment.time}
              </p>
              <p className="text-xs text-gray-500">
                {new Date(appointment.date).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))
      ) : (
        <p className="py-4 text-center text-gray-500">No appointments found.</p>
      )}
    </div>
  );
};

export default AppointmentList;
