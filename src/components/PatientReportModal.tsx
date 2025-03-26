import React, { useState, useEffect } from "react";
import { X, Save, Plus } from "lucide-react";
import { Patient, PatientReport } from "@/types/types";
import { format } from "date-fns";

interface PatientReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient;
  onSaveReport: (patientId: string, reportContent: string) => void;
  existingReports?: PatientReport[];
}

const PatientReportModal: React.FC<PatientReportModalProps> = ({
  isOpen,
  onClose,
  patient,
  onSaveReport,
  existingReports = [],
}) => {
  const [reportContent, setReportContent] = useState("");
  const [activeReportId, setActiveReportId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Reset state when modal opens or patient changes
  useEffect(() => {
    if (isOpen) {
      setReportContent(patient.notes || "");
      setIsEditing(false);

      if (existingReports.length > 0) {
        setActiveReportId(existingReports[0].id);
      } else {
        setActiveReportId(null);
      }
    }
  }, [isOpen, patient, existingReports]);

  // When selecting a report from the list
  const handleSelectReport = (reportId: string) => {
    const selectedReport = existingReports.find(
      (report) => report.id === reportId
    );
    if (selectedReport) {
      setReportContent(selectedReport.content);
      setActiveReportId(reportId);
      setIsEditing(false);
    }
  };

  // Start adding a new report
  const handleNewReport = () => {
    setReportContent("");
    setActiveReportId(null);
    setIsEditing(true);
  };

  // Enable editing of current report
  const handleEditReport = () => {
    setIsEditing(true);
  };

  // Save the current report
  const handleSaveReport = () => {
    onSaveReport(patient.id, reportContent);
    setIsEditing(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#f0f0f0] bg-opacity-80">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Patient Report: {patient.name}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
          {/* Sidebar with existing reports */}
          <div className="w-full md:w-64 border-r bg-gray-50 overflow-y-auto">
            <div className="p-4">
              <button
                onClick={handleNewReport}
                className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" /> New Report
              </button>

              {existingReports.length > 0 ? (
                <div className="mt-4 space-y-2">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Previous Reports
                  </h3>
                  <div className="space-y-1">
                    {existingReports.map((report) => (
                      <button
                        key={report.id}
                        onClick={() => handleSelectReport(report.id)}
                        className={`w-full text-left px-3 py-2 text-sm rounded-md ${
                          activeReportId === report.id
                            ? "bg-blue-100 text-blue-700"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <div className="font-medium truncate">
                          {format(new Date(report.date), "MMM d, yyyy")}
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                          Dr. {report.createdBy}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="mt-4 text-center py-6 text-gray-500 text-sm">
                  No previous reports
                </div>
              )}
            </div>
          </div>

          {/* Main content area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">
                {activeReportId
                  ? `Report from ${format(
                      new Date(
                        existingReports.find((r) => r.id === activeReportId)
                          ?.date || new Date()
                      ),
                      "MMMM d, yyyy"
                    )}`
                  : "New Report"}
              </h3>
              <div>
                {!isEditing ? (
                  <button
                    onClick={handleEditReport}
                    className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm leading-5 font-medium rounded-md text-gray-700 bg-white hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:text-gray-800 active:bg-gray-50"
                  >
                    Edit
                  </button>
                ) : (
                  <button
                    onClick={handleSaveReport}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:border-blue-700 focus:shadow-outline-blue active:bg-blue-700"
                  >
                    <Save className="h-4 w-4 mr-1" /> Save
                  </button>
                )}
              </div>
            </div>
            <div className="p-6 flex-1 overflow-y-auto">
              {isEditing ? (
                <textarea
                  value={reportContent}
                  onChange={(e) => setReportContent(e.target.value)}
                  className="w-full h-full min-h-[200px] p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 resize-none"
                  placeholder="Enter patient report details here..."
                />
              ) : (
                <div className="prose max-w-none">
                  {reportContent ? (
                    <div className="whitespace-pre-wrap">{reportContent}</div>
                  ) : (
                    <p className="text-gray-500 italic">
                      No content available.
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientReportModal;
