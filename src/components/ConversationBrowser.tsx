// src/components/ConversationBrowser.tsx
import React, { useState, useEffect } from "react";
import { Search, RefreshCw, Link } from "lucide-react";
import { fetchAllConversations } from "@/lib/api";
import { Conversation, Patient } from "@/types/types";

interface ConversationBrowserProps {
  isOpen: boolean;
  onClose: () => void;
  patients: Patient[];
  onLinkConversation: (patientId: string, conversationId: string) => void;
}

const ConversationBrowser: React.FC<ConversationBrowserProps> = ({
  isOpen,
  onClose,
  patients,
  onLinkConversation,
}) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatientId, setSelectedPatientId] = useState<string>("");

  useEffect(() => {
    if (isOpen) {
      loadConversations();
    }
  }, [isOpen]);

  const loadConversations = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchAllConversations();
      setConversations(data);
    } catch (err) {
      setError("Failed to load conversations");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
  };

  const handleLinkConversation = () => {
    if (selectedConversation && selectedPatientId) {
      onLinkConversation(selectedPatientId, selectedConversation._id);
      // Show success message or visual feedback
    }
  };

  // Filter conversations based on search term
  const filteredConversations = conversations.filter((conv) => {
    const searchContent = [
      conv.user_info?.name || "",
      conv.user_info?.email || "",
      conv.user_info?.phone_number || "",
      // Search in the first few chat messages
      ...(conv.chat?.slice(0, 5).map((msg) => {
        const key = Object.keys(msg)[0];
        return msg[key] || "";
      }) || []),
    ]
      .join(" ")
      .toLowerCase();

    return searchContent.includes(searchTerm.toLowerCase());
  });

  // Format timestamp
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  // Find patients that aren't linked to conversations yet
  const availablePatients = patients.filter((p) => !p.conversationId);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#f0f0f0] bg-opacity-80">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl mx-4 max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Conversation Database
          </h2>
          <div className="flex items-center space-x-3">
            <button
              onClick={loadConversations}
              className="p-2 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-100"
              title="Refresh"
            >
              <RefreshCw className="h-5 w-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-100"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden flex">
          {/* Conversation list */}
          <div className="w-1/3 border-r overflow-y-auto">
            <div className="p-4 border-b">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm"
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {isLoading ? (
              <div className="p-8 text-center text-gray-500">
                Loading conversations...
              </div>
            ) : error ? (
              <div className="p-4 m-4 bg-red-50 text-red-600 rounded-md">
                {error}
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No conversations found
              </div>
            ) : (
              <div className="divide-y">
                {filteredConversations.map((conv) => (
                  <div
                    key={conv._id}
                    className={`p-4 cursor-pointer hover:bg-gray-50 ${
                      selectedConversation?._id === conv._id ? "bg-blue-50" : ""
                    }`}
                    onClick={() => handleSelectConversation(conv)}
                  >
                    <div className="font-medium">
                      {conv.user_info?.name || "Unnamed User"}
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatDate(conv.timestamp)}
                    </div>
                    <div className="text-xs text-gray-400 truncate mt-1">
                      {conv.user_info?.email || "No email"} •{" "}
                      {conv.user_info?.phone_number || "No phone"}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Conversation details & linking panel */}
          <div className="w-2/3 flex flex-col">
            {selectedConversation ? (
              <>
                <div className="p-4 border-b">
                  <h3 className="text-lg font-medium text-gray-900">
                    Conversation Details
                  </h3>
                  <div className="mt-2 text-sm text-gray-500">
                    <div>ID: {selectedConversation._id}</div>
                    <div>
                      Date: {formatDate(selectedConversation.timestamp)}
                    </div>
                    <div>
                      User: {selectedConversation.user_info?.name || "Unknown"}{" "}
                      ({selectedConversation.user_info?.email || "No email"})
                    </div>
                  </div>
                </div>

                {/* Link to patient section */}
                <div className="p-4 border-b bg-gray-50">
                  <h3 className="text-md font-medium text-gray-900 mb-2">
                    Link to Patient
                  </h3>

                  <div className="mb-4">
                    <label
                      htmlFor="patientSelect"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Select Patient
                    </label>
                    <select
                      id="patientSelect"
                      value={selectedPatientId}
                      onChange={(e) => setSelectedPatientId(e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    >
                      <option value="">Select a patient...</option>
                      {availablePatients.map((patient) => (
                        <option key={patient.id} value={patient.id}>
                          {patient.name} ({patient.id})
                        </option>
                      ))}
                      {availablePatients.length === 0 && (
                        <option disabled>
                          All patients already have linked conversations
                        </option>
                      )}
                    </select>
                  </div>

                  <button
                    onClick={handleLinkConversation}
                    disabled={!selectedPatientId}
                    className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                      selectedPatientId
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    <Link className="h-4 w-4 mr-2" />
                    Link Conversation to Patient
                  </button>
                </div>

                {/* Preview conversation */}
                <div className="flex-1 overflow-y-auto p-4">
                  <h3 className="text-md font-medium text-gray-900 mb-2">
                    Conversation Preview
                  </h3>

                  <div className="border rounded-md overflow-hidden">
                    <div className="bg-gray-50 p-3 border-b text-sm font-medium">
                      Chat Transcript
                    </div>
                    <div className="p-3 max-h-72 overflow-y-auto">
                      {selectedConversation.chat
                        ?.slice(0, 10)
                        .map((msg, idx) => {
                          const sender = Object.keys(msg)[0];
                          const content = msg[sender];
                          // Check if message is from AI/Assistant/Adam/Doctor
                          const isAI =
                            sender.toLowerCase() === "ai" ||
                            sender.toLowerCase() === "assistant" ||
                            sender.toLowerCase() === "adam" ||
                            sender.toLowerCase() === "doctor";

                          return (
                            <div
                              key={idx}
                              className={`mb-3 ${isAI ? "mr-8" : "ml-8"}`}
                            >
                              <div
                                className={`rounded-md p-2 ${
                                  isAI
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-green-100 text-green-800"
                                }`}
                              >
                                <div className="font-medium text-xs mb-1">
                                  {sender}
                                </div>
                                <div className="text-sm whitespace-pre-wrap">
                                  {typeof content === "string"
                                    ? content.length > 150
                                      ? content.substring(0, 150) + "..."
                                      : content
                                    : "Complex content (object)"}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      {(selectedConversation.chat?.length || 0) > 10 && (
                        <div className="text-center text-sm text-gray-500 mt-2">
                          ... {selectedConversation.chat!.length - 10} more
                          messages ...
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <div className="mb-4">
                    <Search className="h-12 w-12 mx-auto text-gray-300" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">
                    Select a conversation
                  </h3>
                  <p className="max-w-md mx-auto text-sm">
                    Select a conversation from the list to view details and link
                    it to a patient.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="border-t p-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConversationBrowser;
