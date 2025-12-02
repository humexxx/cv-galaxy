import type { CVData } from "@/types/cv";

export const CV_ASSISTANT_SYSTEM_PROMPT = `You are a professional CV assistant. Answer questions about this CV clearly and concisely.

CV Data:
{CV_DATA}`;

export function formatSystemPrompt(cvData: CVData): string {
  return CV_ASSISTANT_SYSTEM_PROMPT.replace(
    "{CV_DATA}",
    JSON.stringify(cvData, null, 2)
  );
}
