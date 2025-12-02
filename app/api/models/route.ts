import { NextResponse } from "next/server";
import type { AIModel, AIModelsResponse } from "@/types/ai";

export const DEFAULT_MODEL = "gpt-4o-mini";

const models: AIModel[] = [
  {
    id: "gpt-4o-mini",
    name: "GPT-4o Mini ⭐",
    description:
      "Best balance: fast, affordable, excellent for CV analysis (Recommended)",
    provider: "openai",
  },
  {
    id: "gpt-5-nano",
    name: "GPT-5 Nano",
    description:
      "Fastest and most economical option from GPT-5 family",
    provider: "openai",
  },
  {
    id: "gpt-4.1-mini",
    name: "GPT-4.1 Mini",
    description:
      "Smart non-reasoning model, great balance for focused tasks",
    provider: "openai",
  },
  {
    id: "gpt-5-mini",
    name: "GPT-5 Mini",
    description:
      "Cost-efficient GPT-5 for well-defined tasks",
    provider: "openai",
  },
  {
    id: "gpt-4o",
    name: "GPT-4o",
    description:
      "Most capable option for complex analysis (higher cost)",
    provider: "openai",
  },
];

export const ALLOWED_MODEL_IDS = models.map(m => m.id);

export async function GET() {
  return NextResponse.json<AIModelsResponse>({ models });
}
