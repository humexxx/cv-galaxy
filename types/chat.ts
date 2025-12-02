import { z } from "zod";

export const chatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1, "Message content is required"),
});

export const chatRequestSchema = z.object({
  messages: z.array(chatMessageSchema).min(1, "At least one message is required"),
  model: z.string().min(1, "Model is required"),
  userId: z.string().min(1, "User ID is required"),
});

export type ChatMessage = z.infer<typeof chatMessageSchema>;
export type ChatRequest = z.infer<typeof chatRequestSchema>;

export interface ChatResponse {
  message: string;
}

export type CVSection = 
  | "about"
  | "technologies"
  | "languages" 
  | "skills"
  | "workExperience"
  | "projects"
  | "personalValues";

export interface CVHighlight {
  text: string;
  section?: CVSection;
  color?: "yellow" | "blue" | "green" | "purple";
}

export interface StreamChunk {
  type: "content" | "highlight";
  content?: string;
  highlight?: CVHighlight;
}
