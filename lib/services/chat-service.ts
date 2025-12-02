import { chatRequestSchema } from "@/schemas/chat";
import type { ChatMessage, ChatResponse, ChatRequest, StreamChunk } from "@/types/chat";
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
    model: string,
    userId: string,
    onChunk?: (chunk: StreamChunk) => void
  ): Promise<string> {
    const requestData: ChatRequest = {
      messages,
      model,
      userId,
    };

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
      const error = await response.json();
      throw new Error(error.error || `HTTP error! status: ${response.status}`);
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let fullContent = "";

    if (!reader) {
      throw new Error("No response body reader available");
    }

    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split("\n");

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = line.slice(6);

          if (data === "[DONE]") {
            continue;
          }

          try {
            const parsed = JSON.parse(data);
            console.log("Parsed chunk:", parsed);
            
            if (parsed.type === "content" && parsed.content) {
              fullContent += parsed.content;
              if (onChunk) {
                onChunk({ type: "content", content: parsed.content });
              }
            }
            
            if (parsed.type === "highlight" && parsed.highlight) {
              if (onChunk) {
                onChunk({ type: "highlight", highlight: parsed.highlight });
              }
            }
          } catch (e) {
            
          }
        }
      }
    }

    return fullContent;
  }
}
