import OpenAI from "openai";
import type { Stream } from "openai/streaming";
import type { ChatMessage } from "@/types/chat";
import type { CVData } from "@/types/cv";
import { formatSystemPrompt } from "@/lib/constants/prompts";
import { ALLOWED_MODEL_IDS, DEFAULT_MODEL } from "@/app/api/models/route";
import { env } from "@/lib/env";

export class OpenAIService {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey: env.OPENAI_API_KEY,
    });
  }

  async createChatStream(
    messages: ChatMessage[],
    cvData: CVData,
    model: string = DEFAULT_MODEL,
    signal?: AbortSignal
  ): Promise<Stream<OpenAI.Chat.Completions.ChatCompletionChunk>> {
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

    const stream = await this.client.chat.completions.create(
      {
        model: validModel,
        messages: openAIMessages,
        stream: true,
        temperature: 0.7,
        max_tokens: 1500,
      },
      { signal }
    );

    return stream;
  }

  static toReadableStream(
    stream: Stream<OpenAI.Chat.Completions.ChatCompletionChunk>
  ): ReadableStream {
    const encoder = new TextEncoder();
    // Held so cancel() can shut down the very iterator start() is draining.
    const iterator = stream[Symbol.asyncIterator]();
    let cancelled = false;

    return new ReadableStream({
      async start(controller) {
        try {
          while (!cancelled) {
            const { done, value } = await iterator.next();
            if (done) break;
            if (cancelled) return;

            const delta = value.choices[0]?.delta;

            if (delta?.content) {
              const data = `data: ${JSON.stringify({ type: "content", content: delta.content })}\n\n`;
              controller.enqueue(encoder.encode(data));
            }
          }

          if (cancelled) return;

          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (error) {
          // A cancel() aborts the upstream request, which surfaces here as an
          // abort error. That is the expected teardown path, not a failure —
          // and the controller is already closed, so erroring it would throw.
          if (cancelled) return;
          controller.error(error);
        }
      },

      // Fired when the client disconnects or the consumer calls reader.cancel().
      // Without this the loop above keeps pulling tokens from OpenAI for the
      // full completion, billing for output nobody will ever read and
      // holding the socket open for the rest of the function's lifetime.
      async cancel() {
        cancelled = true;

        // Aborts the underlying fetch, which tears down the SSE connection.
        stream.controller.abort();

        // Also run the iterator's cleanup so the SDK releases the response body.
        try {
          await iterator.return?.(undefined);
        } catch {
          // Already torn down by the abort above; nothing left to release.
        }
      },
    });
  }
}
