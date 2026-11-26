import {
  convertToModelMessages,
  streamText,
  toUIMessageStream,
  createUIMessageStreamResponse,
  type UIMessage,
  isStepCount,
} from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { NextResponse } from "next/server";
import { tools } from "@/lib/ai/tools";
import { SHOP_TIME_ZONE, shopNow } from "@/lib/booking/clock";
import { MAX_MESSAGE_LENGTH } from "@/lib/chat";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY!,
});
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

    const today = shopNow().date;
    const weekday = new Date().toLocaleDateString("en-US", {
      weekday: "long",
      timeZone: SHOP_TIME_ZONE,
    });

    const result = streamText({
      model: google("gemini-3.5-flash-lite"),

      instructions: `
      You are Voia. You are a friendly and professional barber booking assistant working in Voia.

      Help customers:
      - Discover available barber services.
      - Understand prices and durations.
      - Find appointment availability.
      - Make and manage bookings.

      Be conversational, concise and helpful.

      Never claim that an appointment has been booked
      unless the booking system confirms it.

      Today is ${weekday}, ${today}. The shop's time zone is ${SHOP_TIME_ZONE}.
      Work out dates like "tomorrow" or "Monday" from today's date, and never book a date in the past.

      Write plain text only: no Markdown, no bold, no lists. Keep replies to one or two short sentences.
      The app shows available times as buttons, so don't list the times in your reply.
      The app shows a booking card after createBooking succeeds, so just confirm in one sentence without repeating the details.
      Once the customer has picked a time, don't call getAvailableSlots again, because createBooking checks it.
    `,

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
