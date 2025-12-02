import OpenAI from "openai";
import type { ChatMessage } from "@/types/chat";
import type { CVData } from "@/types/cv";
import { formatSystemPrompt } from "@/lib/constants/prompts";
import { ALLOWED_MODEL_IDS, DEFAULT_MODEL } from "@/app/api/models/route";

export class OpenAIService {
  private client: OpenAI;

  constructor() {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY environment variable is not set");
    }

    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async createChatStream(
    messages: ChatMessage[],
    cvData: CVData,
    model: string = DEFAULT_MODEL
  ) {
    const validModel = ALLOWED_MODEL_IDS.includes(model) ? model : DEFAULT_MODEL;
    const systemPrompt = formatSystemPrompt(cvData);
    const openAIMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      {
        role: "system",
        content: systemPrompt,
      },
      ...messages.map((msg) => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      })),
    ];

    const stream = await this.client.chat.completions.create({
      model: validModel,
      messages: openAIMessages,
      stream: true,
      temperature: 0.7,
      max_tokens: 1000,
    });

    return stream;
  }

  static toReadableStream(stream: AsyncIterable<OpenAI.Chat.Completions.ChatCompletionChunk>): ReadableStream {
    const encoder = new TextEncoder();

    return new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content;
            
            if (content) {
              const data = `data: ${JSON.stringify({ content })}\n\n`;
              controller.enqueue(encoder.encode(data));
            }
          }

          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });
  }
}
