import React, { useState, useEffect } from "react";
import { X, Trash2 } from "lucide-react";
import { Patient } from "@/types/types";
import { faker } from "@faker-js/faker";

interface PatientManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSavePatient: (patient: Patient) => void;
  onDeletePatient?: (patientId: string) => void;
  initialPatient?: Patient | null;
}

export const PatientManagementModal: React.FC<PatientManagementModalProps> = ({
  isOpen,
  onClose,
  onSavePatient,
  onDeletePatient,
  initialPatient = null,
}) => {
  const [patient, setPatient] = useState<Patient>({
    id: "",
    name: "",
    age: 0,
    gender: "",
    contact: "",
    email: "", // Added email field with empty initial value
    lastVisit: "",
    nextAppointment: "",
    status: "Active",
    insuranceProvider: "",
    policyNumber: "",
    profileImage: "",
    notes: "", // Added notes field with empty initial value
  });

  // Reset or populate form when modal opens/changes
  useEffect(() => {
    if (initialPatient) {
      // If editing an existing patient
      setPatient(initialPatient);
    } else {
      // If adding a new patient
      setPatient({
        id: `PT-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        name: "",
        age: 0,
        gender: "",
        contact: "",
        email: "", // Added email field
        lastVisit: new Date().toISOString().split("T")[0],
        nextAppointment: "",
        status: "Active",
        insuranceProvider: "",
        policyNumber: "",
        profileImage: faker.image.avatarGitHub(),
        notes: "", // Added notes field
      });
    }
  }, [initialPatient, isOpen]);

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setPatient((prev) => ({
      ...prev,
      [name]: name === "age" ? parseInt(value, 10) : value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (
      !patient.name ||
      !patient.age ||
      !patient.gender ||
      !patient.contact ||
      !patient.email
    ) {
      alert("Please fill in all required fields");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(patient.email)) {
      alert("Please enter a valid email address");
      return;
    }

    // Save the patient
    onSavePatient(patient);
    onClose();
  };

  // Handle patient deletion
  const handleDelete = () => {
    if (onDeletePatient && patient.id) {
      if (window.confirm("Are you sure you want to delete this patient?")) {
        onDeletePatient(patient.id);
        onClose();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#f0f0f0] bg-opacity-80">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {initialPatient ? "Edit Patient" : "Add New Patient"}
          </h2>
          <div className="flex items-center space-x-2">
            {initialPatient && onDeletePatient && (
              <button
                onClick={handleDelete}
                className="text-red-500 hover:text-red-700"
                title="Delete Patient"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            )}
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>
        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-4 max-h-[70vh] overflow-y-auto"
        >
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={patient.name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={patient.email}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label
              htmlFor="age"
              className="block text-sm font-medium text-gray-700"
            >
              Age
            </label>
            <input
              type="number"
              id="age"
              name="age"
              value={patient.age}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label
              htmlFor="gender"
              className="block text-sm font-medium text-gray-700"
            >
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              value={patient.gender}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="contact"
              className="block text-sm font-medium text-gray-700"
            >
              Contact Number
            </label>
            <input
              type="tel"
              id="contact"
              name="contact"
              value={patient.contact}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label
              htmlFor="insuranceProvider"
              className="block text-sm font-medium text-gray-700"
            >
              Insurance Provider
            </label>
            <input
              type="text"
              id="insuranceProvider"
              name="insuranceProvider"
              value={patient.insuranceProvider}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="policyNumber"
              className="block text-sm font-medium text-gray-700"
            >
              Policy Number
            </label>
            <input
              type="text"
              id="policyNumber"
              name="policyNumber"
              value={patient.policyNumber}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="notes"
              className="block text-sm font-medium text-gray-700"
            >
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              value={patient.notes || ""}
              onChange={handleChange}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="Any important information about the patient..."
            />
          </div>
          <div className="flex justify-end space-x-3">
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
              {initialPatient ? "Update Patient" : "Add Patient"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
