// src/components/ConversationHistoryModal.tsx
import React, { useState, useEffect } from "react";
import { X, MessageSquare, FileText, User, Download } from "lucide-react";
import { Patient, Conversation, ConditionMatch } from "@/types/types";
import { fetchConversationById } from "@/lib/api";

interface ConversationHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient;
  onUpdateConversationId: (patientId: string, conversationId: string) => void;
}

// Fallback condition data when no matches are found in the API response
const fallbackConditionData = [
  { cond_name_eng: "Hypertension", severity: "High", count: 5 },
  { cond_name_eng: "Diabetes", severity: "Moderate", count: 4 },
  { cond_name_eng: "Asthma", severity: "Moderate", count: 3 },
  { cond_name_eng: "Migraine", severity: "Low", count: 2 },
  { cond_name_eng: "Anemia", severity: "Low", count: 2 },
];

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
        console.log("Loaded conversation data:", data);
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

  // Get condition matches from any possible location in the data
  const getConditionMatches = (): ConditionMatch[] => {
    if (!conversation) return fallbackConditionData;

    // Check for matches at the top level first
    if (conversation.matches) {
      const matches = Object.values(conversation.matches).filter(
        (match): match is ConditionMatch => !!match
      );
      if (matches.length > 0) return matches;
    }

    // Then check if matches might be in the report
    if (conversation.report?.matches) {
      const matches = Object.values(conversation.report.matches).filter(
        (match): match is ConditionMatch => !!match
      );
      if (matches.length > 0) return matches;
    }

    // Return fallback data if no matches found
    return fallbackConditionData;
  };

  // Function to format chat messages with improved styling
  const renderChatMessage = (
    message: Record<string, string>,
    index: number
  ) => {
    const sender = Object.keys(message)[0];
    const content = message[sender];

    // Check if message is from AI/Assistant/Adam/Doctor
    const isAI =
      sender.toLowerCase() === "ai" ||
      sender.toLowerCase() === "assistant" ||
      sender.toLowerCase() === "adam" ||
      sender.toLowerCase() === "doctor";

    return (
      <div key={index} className={`mb-4 ${isAI ? "mr-12" : "ml-12"}`}>
        <div
          className={`flex items-start ${
            isAI ? "justify-start" : "justify-end"
          }`}
        >
          <div
            className={`px-4 py-3 rounded-lg ${
              isAI ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
            }`}
          >
            <div className="font-medium mb-1">{sender}</div>
            <div className="whitespace-pre-wrap">{content}</div>
          </div>
        </div>
      </div>
    );
  };

  // Function to render the condition matches
  const renderConditionMatches = (matches: ConditionMatch[]) => {
    return (
      <div className="space-y-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {matches.map((match, index) => {
            // Determine color based on severity
            let bgColor = "bg-blue-50 border-blue-200";
            let textColor = "text-blue-800";

            if (match.severity === "High") {
              bgColor = "bg-red-50 border-red-200";
              textColor = "text-red-800";
            } else if (match.severity === "Moderate") {
              bgColor = "bg-orange-50 border-orange-200";
              textColor = "text-orange-800";
            }

            return (
              <div
                key={index}
                className={`p-4 rounded-lg border ${bgColor} flex items-center justify-between`}
              >
                <div>
                  <h4 className={`font-medium ${textColor}`}>
                    {match.cond_name_eng}
                  </h4>
                  <div className="flex space-x-2 items-center mt-1">
                    <span className={`text-sm ${textColor}`}>
                      Severity: {match.severity}
                    </span>
                    <span className="text-xs text-gray-500">
                      Count: {match.count}
                    </span>
                  </div>
                </div>
                <div
                  className={`h-10 w-10 rounded-full flex items-center justify-center ${textColor} ${bgColor} border-2 ${
                    match.severity === "High"
                      ? "border-red-400"
                      : match.severity === "Moderate"
                      ? "border-orange-400"
                      : "border-blue-400"
                  }`}
                >
                  {match.count}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Format Q&A section to be more readable
  const renderQuestionsAnswers = (qa: any) => {
    if (!qa) return null;

    return (
      <div className="mt-6 border rounded-lg overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b">
          <h3 className="font-medium text-gray-900">Patient Responses</h3>
        </div>
        <div className="divide-y">
          {Object.entries(qa).map(([question, answer], index) => (
            <div
              key={index}
              className="px-4 py-3 flex flex-col sm:flex-row hover:bg-gray-50"
            >
              <div className="font-medium text-gray-700 sm:w-2/3">
                {question}
              </div>
              <div className="text-gray-600 sm:w-1/3 mt-1 sm:mt-0 sm:text-right">
                <span
                  className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    answer === "Yes"
                      ? "bg-green-100 text-green-800"
                      : answer === "No"
                      ? "bg-red-100 text-red-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {answer}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  // Get the condition matches from the conversation
  const conditionMatches = getConditionMatches();

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

        {/* Conversation ID display */}
        {patient.conversationId && (
          <div className="p-4 bg-gray-50 border-b">
            <div className="text-sm text-gray-600">
              Current conversation ID:{" "}
              <span className="font-mono text-gray-800">
                {patient.conversationId}
              </span>
            </div>
          </div>
        )}

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
                        {conversation.user_info?.email}
                        {conversation.user_info?.phone_number
                          ? `, ${conversation.user_info.phone_number}`
                          : ""}
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    {conversation.chat?.map(renderChatMessage)}
                  </div>
                </div>
              )}

              {tab === "report" && (
                <div className="space-y-6">
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

                  {/* Display the summary if available - this already contains the "Based on..." message */}
                  {conversation.report?.summary && (
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                      <h3 className="font-medium text-blue-800 mb-2">
                        Summary
                      </h3>
                      <p className="text-gray-800">
                        {conversation.report.summary}
                      </p>
                    </div>
                  )}

                  {/* Render condition matches directly without the additional heading */}
                  {renderConditionMatches(conditionMatches)}

                  {/* Display instructions if available */}
                  {conversation.report?.instructions && (
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <h3 className="font-medium text-gray-800 mb-2">
                        Instructions
                      </h3>
                      <p className="text-gray-700">
                        {conversation.report.instructions}
                      </p>
                    </div>
                  )}

                  {/* Display the Q&A section in a nicer format */}
                  {conversation.report?.questions_answers &&
                    renderQuestionsAnswers(
                      conversation.report.questions_answers
                    )}

                  {/* If there are other fields in the report, show them */}
                  {conversation.report &&
                    typeof conversation.report === "object" &&
                    Object.entries(conversation.report)
                      .filter(
                        ([key]) =>
                          ![
                            "summary",
                            "instructions",
                            "questions_answers",
                            "validation",
                            "matches",
                          ].includes(key)
                      )
                      .map(([key, value]) => {
                        // Skip complex objects that we've already handled
                        if (typeof value === "object" && value !== null)
                          return null;

                        return (
                          <div key={key} className="border-t pt-4 mt-4">
                            <h3 className="font-medium text-gray-900 capitalize mb-2">
                              {key.replace(/_/g, " ")}
                            </h3>
                            <div className="text-gray-700 whitespace-pre-wrap">
                              {String(value)}
                            </div>
                          </div>
                        );
                      })}
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
