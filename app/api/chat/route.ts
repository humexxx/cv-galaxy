import { NextRequest, NextResponse } from "next/server";
import { chatRequestSchema } from "@/schemas/chat";
import { OpenAIService } from "@/lib/services/openai-service";
import { cvService } from "@/lib/services/cv-service";
import { PreferencesServerService } from "@/lib/services/preferences-server-service";
import { rateLimit } from "@/lib/utils/rate-limit";

export async function POST(request: NextRequest) {
  try {
    const limited = rateLimit(request, {
      scope: "chat",
      limit: 15,
      windowMs: 60_000,
    });
    if (limited) return limited;

    const body = await request.json();

    const validationResult = chatRequestSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid request", details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const { messages, model, userId } = validationResult.data;

    const preferences = await PreferencesServerService.getPreferencesFromDB(userId);
    const cvData = await cvService.getCVByUsername(userId, preferences.showContractors);

    if (!cvData) {
      return NextResponse.json(
        { error: "CV not found for the specified user" },
        { status: 404 }
      );
    }

    const openAIService = new OpenAIService();
    const stream = await openAIService.createChatStream(messages, cvData, model);
    const readableStream = OpenAIService.toReadableStream(stream);

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    
    if (error instanceof Error) {
      if (error.message.includes("OPENAI_API_KEY")) {
        return NextResponse.json(
          { error: "OpenAI API key is not configured" },
          { status: 500 }
        );
      }
    }

    // OpenAI reports quota and auth problems as 429/401. Collapsing those into a
    // generic 500 hid an exhausted credit balance behind "Internal server error".
    const upstreamStatus = (error as { status?: unknown })?.status;
    if (upstreamStatus === 429 || upstreamStatus === 401) {
      return NextResponse.json(
        { error: "The AI assistant is temporarily unavailable. Please try again later." },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
