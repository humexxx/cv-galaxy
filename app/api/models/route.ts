    import { NextResponse } from "next/server";
import type { AIModel, AIModelsResponse } from "@/types/ai";

// Common OpenAI models
const models: AIModel[] = [
  {
    id: "gpt-5.1",
    name: "GPT-5.1",
    description:
      "The best model for coding and agentic tasks, with configurable reasoning effort and strong performance on large, complex projects.",
    provider: "openai",
  },
  {
    id: "gpt-5",
    name: "GPT-5",
    description:
      "Previous flagship multimodal and reasoning model for coding and agentic workflows, with excellent code generation and tool use.",
    provider: "openai",
  },
  {
    id: "gpt-4.1",
    name: "GPT-4.1",
    description:
      "High-intelligence general-purpose model with strong coding, instruction-following, and up to 1M-token context.",
    provider: "openai",
  },
  {
    id: "gpt-4o",
    name: "GPT-4o",
    description:
      "Versatile omni model for text and image inputs with great latency and quality, ideal for interactive apps.",
    provider: "openai",
  },
  {
    id: "o4-mini",
    name: "o4-mini",
    description:
      "Reasoning-focused small model optimized for deeper logical thinking and problem solving at lower cost.",
    provider: "openai",
  },
];

export async function GET() {
  return NextResponse.json<AIModelsResponse>({ models });
}
