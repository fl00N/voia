import {
  convertToModelMessages,
  streamText,
  toUIMessageStream,
  createUIMessageStreamResponse,
  type UIMessage,
  isStepCount,
} from "ai";
import { NextResponse } from "next/server";
import { google } from "@/lib/ai/google";
import { buildInstructions } from "@/lib/ai/instructions";
import { tools } from "@/lib/ai/tools";
import { MAX_MESSAGE_LENGTH } from "@/lib/chat";

export async function POST(request: Request) {
  try {
    const { messages }: { messages: UIMessage[] } = await request.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return Response.json({ error: "Invalid messages" }, { status: 400 });
    }

    const lastMessage = messages[messages.length - 1];

    if (lastMessage.role !== "user") {
      return Response.json({ error: "Invalid message role" }, { status: 400 });
    }

    const userText = lastMessage.parts
      .filter((part) => part.type === "text")
      .map((part) => part.text)
      .join("");

    if (!userText.trim() || userText.length > MAX_MESSAGE_LENGTH) {
      return Response.json({ error: "Invalid message" }, { status: 400 });
    }

    const result = streamText({
      model: google("gemini-3.5-flash-lite"),
      instructions: buildInstructions("chat"),

      messages: await convertToModelMessages(messages),
      stopWhen: isStepCount(5),
      tools: tools,
    });

    const stream = toUIMessageStream({
      stream: result.stream,
    });

    return createUIMessageStreamResponse({
      stream,
    });
  } catch (error) {
    console.error("Gemini API error:", error);

    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 },
    );
  }
}
