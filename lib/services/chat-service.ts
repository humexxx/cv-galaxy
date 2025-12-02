import { chatRequestSchema } from "@/schemas/chat";
import type { ChatMessage, ChatResponse, ChatRequest } from "@/schemas/chat";
import type { AIModelsResponse } from "@/types/ai";

export class ChatService {
  private static readonly API_URL = "/api/chat";
  private static readonly MODELS_URL = "/api/models";

  static async getModels(): Promise<AIModelsResponse> {
    const response = await fetch(this.MODELS_URL);

    if (!response.ok) {
      throw new Error("Failed to fetch models");
    }

    return response.json();
  }

  static async sendMessage(
    messages: ChatMessage[],
    model: string
  ): Promise<ChatResponse> {
    const requestData: ChatRequest = {
      messages,
      model,
    };

    // Validate request data with Zod before sending
    const validationResult = chatRequestSchema.safeParse(requestData);

    if (!validationResult.success) {
      throw new Error(
        `Validation error: ${validationResult.error.issues.map((i) => i.message).join(", ")}`
      );
    }

    const response = await fetch(this.API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validationResult.data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ChatResponse = await response.json();
    return data;
  }
}
