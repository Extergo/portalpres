// src/lib/api.ts
import { Conversation } from "@/types/types";

const API_BASE_URL = "http://localhost:5000"; // Update this with your API URL

export async function fetchConversationById(
  id: string
): Promise<Conversation | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/log/${id}`);

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data as Conversation;
  } catch (error) {
    console.error("Error fetching conversation:", error);
    return null;
  }
}

export async function fetchAllConversations(): Promise<Conversation[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/log`);

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data as Conversation[];
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return [];
  }
}

export async function saveConversation(
  chat: Array<Record<string, string>>,
  user_info: { name: string; email: string; phone_number: string },
  report: any
): Promise<{ success: boolean; saved?: Conversation; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/log`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ chat, user_info, report }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error saving conversation:", error);
    return { success: false, error: "Failed to save conversation" };
  }
}
