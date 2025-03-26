import React, { useState, useRef } from "react";
import { X, Paperclip, Mail, Printer } from "lucide-react";
import { Patient } from "@/types/types";

interface PrescribeMedicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient;
  onSendPrescription: (
    patientId: string,
    prescriptionData: PrescriptionData
  ) => void;
}

interface PrescriptionData {
  medications: string;
  dosage: string;
  instructions: string;
  notes: string;
  attachedPdf?: File | null;
}

const PrescribeMedicationModal: React.FC<PrescribeMedicationModalProps> = ({
  isOpen,
  onClose,
  patient,
  onSendPrescription,
}) => {
  const [prescriptionData, setPrescriptionData] = useState<PrescriptionData>({
    medications: "",
    dosage: "",
    instructions: "",
    notes: "",
    attachedPdf: null,
  });

  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setPrescriptionData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setPrescriptionData((prev) => ({
      ...prev,
      attachedPdf: file,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSendPrescription(patient.id, prescriptionData);
    setShowSuccessMessage(true);

    // Hide success message after 3 seconds
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000);
  };

  const handlePrint = () => {
    const prescriptionContent = `
      PRESCRIPTION
      
      Patient: ${patient.name}
      Date: ${new Date().toLocaleDateString()}
      
      Medications: ${prescriptionData.medications}
      Dosage: ${prescriptionData.dosage}
      Instructions: ${prescriptionData.instructions}
      
      Additional Notes: ${prescriptionData.notes}
      
      Dr. Sarah Miller
      General Practitioner
      PulseAI Medical Center
    `;

    // Create a new window and print the prescription
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Prescription for ${patient.name}</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; }
              h1 { text-align: center; margin-bottom: 20px; }
              .prescription { white-space: pre-line; }
              .footer { margin-top: 40px; border-top: 1px solid #ccc; padding-top: 10px; }
            </style>
          </head>
          <body>
            <h1>Prescription</h1>
            <div class="prescription">${prescriptionContent}</div>
            <div class="footer">
              <p>This prescription was generated via PulseAI Patient Management System.</p>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleEmailPrescription = () => {
    // Create a subject and body for the email
    const subject = `Prescription from Dr. Sarah Miller`;
    const body = `Dear ${patient.name},

Please find attached your prescription details.

Medications: ${prescriptionData.medications}
Dosage: ${prescriptionData.dosage}
Instructions: ${prescriptionData.instructions}

Additional Notes: ${prescriptionData.notes}

Best regards,
Dr. Sarah Miller
PulseAI Medical Center`;

    // Open the default email client with pre-populated fields
    window.location.href = `mailto:${
      patient.email
    }?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#f0f0f0] bg-opacity-80">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Prescribe Medication for {patient.name}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {showSuccessMessage && (
          <div className="m-6 p-4 bg-green-100 text-green-800 rounded-md">
            Prescription has been saved successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label
              htmlFor="medications"
              className="block text-sm font-medium text-gray-700"
            >
              Medications
            </label>
            <input
              type="text"
              id="medications"
              name="medications"
              value={prescriptionData.medications}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="e.g., Amoxicillin 500mg, Ibuprofen 400mg"
              required
            />
          </div>

          <div>
            <label
              htmlFor="dosage"
              className="block text-sm font-medium text-gray-700"
            >
              Dosage
            </label>
            <input
              type="text"
              id="dosage"
              name="dosage"
              value={prescriptionData.dosage}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="e.g., 1 tablet three times daily"
              required
            />
          </div>

          <div>
            <label
              htmlFor="instructions"
              className="block text-sm font-medium text-gray-700"
            >
              Instructions
            </label>
            <textarea
              id="instructions"
              name="instructions"
              value={prescriptionData.instructions}
              onChange={handleChange}
              rows={2}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="e.g., Take with food, Avoid alcohol"
              required
            />
          </div>

          <div>
            <label
              htmlFor="notes"
              className="block text-sm font-medium text-gray-700"
            >
              Additional Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              value={prescriptionData.notes}
              onChange={handleChange}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="Any additional information or follow-up instructions"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Attach Prescription PDF (Optional)
            </label>
            <div className="flex items-center">
              <button
                type="button"
                onClick={triggerFileInput}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Paperclip className="h-4 w-4 mr-2" />
                Attach File
              </button>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".pdf"
                onChange={handleFileChange}
              />
              {prescriptionData.attachedPdf && (
                <span className="ml-3 text-sm text-gray-500">
                  {prescriptionData.attachedPdf.name}
                </span>
              )}
            </div>
          </div>

          <div className="pt-4 flex flex-wrap gap-3 justify-end">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Printer className="h-4 w-4 mr-2" />
              Print
            </button>

            <button
              type="button"
              onClick={handleEmailPrescription}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Mail className="h-4 w-4 mr-2" />
              Email to Patient
            </button>

            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Save Prescription
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PrescribeMedicationModal;
