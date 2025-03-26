// src/components/ConversationHistoryModal.tsx
import React, { useState, useEffect } from "react";
import { X, MessageSquare, FileText, User, Download } from "lucide-react";
import { Patient, Conversation } from "@/types/types";
import { fetchConversationById } from "@/lib/api";

interface ConversationHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient;
  onUpdateConversationId: (patientId: string, conversationId: string) => void;
}

const ConversationHistoryModal: React.FC<ConversationHistoryModalProps> = ({
  isOpen,
  onClose,
  patient,
  onUpdateConversationId,
}) => {
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<"chat" | "report">("chat");
  const [conversationIdInput, setConversationIdInput] = useState(
    patient.conversationId || ""
  );

  useEffect(() => {
    if (isOpen && patient.conversationId) {
      loadConversation(patient.conversationId);
    }
  }, [isOpen, patient.conversationId]);

  const loadConversation = async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchConversationById(id);

      if (data) {
        setConversation(data);
      } else {
        setError("Conversation not found");
      }
    } catch (err) {
      setError("Failed to load conversation");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLinkConversation = () => {
    if (conversationIdInput.trim()) {
      // Update the conversation ID for this patient
      onUpdateConversationId(patient.id, conversationIdInput.trim());

      // Load the conversation
      loadConversation(conversationIdInput.trim());
    }
  };

  // Function to format chat messages
  const renderChatMessage = (
    message: Record<string, string>,
    index: number
  ) => {
    const sender = Object.keys(message)[0];
    const content = message[sender];

    const isAI =
      sender.toLowerCase() === "ai" || sender.toLowerCase() === "assistant";

    return (
      <div key={index} className={`mb-4 ${isAI ? "ml-12" : "mr-12"}`}>
        <div
          className={`flex items-start ${
            isAI ? "justify-start" : "justify-end"
          }`}
        >
          <div
            className={`px-4 py-3 rounded-lg ${
              isAI ? "bg-gray-100 text-gray-800" : "bg-blue-100 text-blue-800"
            }`}
          >
            <div className="font-medium mb-1">{sender}</div>
            <div className="whitespace-pre-wrap">{content}</div>
          </div>
        </div>
      </div>
    );
  };

  // Function to render the report
  const renderReport = (report: any) => {
    if (typeof report === "string") {
      return <div className="whitespace-pre-wrap">{report}</div>;
    }

    // If report is an object, render its fields
    return (
      <div className="space-y-4">
        {Object.entries(report).map(([key, value], index) => (
          <div key={index} className="border-b pb-3">
            <h3 className="font-medium text-gray-900 mb-2 capitalize">
              {key.replace(/_/g, " ")}
            </h3>
            <div className="whitespace-pre-wrap text-gray-700">
              {typeof value === "string"
                ? value
                : JSON.stringify(value, null, 2)}
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#f0f0f0] bg-opacity-80">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Conversation History: {patient.name}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Conversation ID input */}
        <div className="p-4 bg-gray-50 border-b">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={conversationIdInput}
              onChange={(e) => setConversationIdInput(e.target.value)}
              placeholder="Enter conversation ID"
              className="flex-1 p-2 border rounded-md"
            />
            <button
              onClick={handleLinkConversation}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Link Conversation
            </button>
          </div>
          {patient.conversationId && (
            <div className="mt-2 text-sm text-gray-500">
              Current conversation ID: {patient.conversationId}
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          <button
            className={`px-4 py-3 font-medium ${
              tab === "chat"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setTab("chat")}
          >
            <div className="flex items-center">
              <MessageSquare className="h-4 w-4 mr-2" />
              Chat Transcript
            </div>
          </button>
          <button
            className={`px-4 py-3 font-medium ${
              tab === "report"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setTab("report")}
          >
            <div className="flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              AI Report
            </div>
          </button>
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-gray-500">Loading conversation...</div>
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-600 p-4 rounded-md">{error}</div>
          ) : !conversation ? (
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No conversation data
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                This patient doesn't have any linked conversation history yet.
                Enter a conversation ID above to link it to this patient.
              </p>
            </div>
          ) : (
            <>
              {tab === "chat" && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 mb-6">
                    <User className="h-5 w-5 text-gray-500" />
                    <div>
                      <div className="font-medium">
                        {conversation.user_info?.name || "Unknown User"}
                      </div>
                      <div className="text-sm text-gray-500">
                        {conversation.user_info?.email},{" "}
                        {conversation.user_info?.phone_number}
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    {conversation.chat?.map(renderChatMessage)}
                  </div>
                </div>
              )}

              {tab === "report" && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      AI-Generated Report
                    </h3>
                    <button
                      className="flex items-center text-blue-600 hover:text-blue-800"
                      onClick={() => {
                        // Download report as JSON
                        const json = JSON.stringify(
                          conversation.report,
                          null,
                          2
                        );
                        const blob = new Blob([json], {
                          type: "application/json",
                        });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = `report-${patient.id}.json`;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                      }}
                    >
                      <Download className="h-4 w-4 mr-1" /> Download
                    </button>
                  </div>

                  {conversation.report && renderReport(conversation.report)}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConversationHistoryModal;
