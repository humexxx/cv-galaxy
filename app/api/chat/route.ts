import { NextRequest, NextResponse } from "next/server";
import { chatRequestSchema } from "@/schemas/chat";
import type { ChatResponse } from "@/schemas/chat";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body with Zod
    const validationResult = chatRequestSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid request", details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const { messages, model } = validationResult.data;

    // TODO: Implement actual AI chat functionality
    // For now, return a placeholder response
    const response: ChatResponse = {
      message: `Model ${model} is still not implemented. You sent: "${messages[messages.length - 1].content}"`,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
