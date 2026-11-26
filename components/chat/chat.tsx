"use client";

import { useEffect, useRef, useState } from "react";
import { RiErrorWarningLine, RiLoader4Line } from "@remixicon/react";
import type { InferUITools, UIDataTypes, UIMessage } from "ai";

import { AssistantHeader } from "@/components/assistant-header";
import { BookingCard } from "@/components/chat/booking-card";
import { ChatComposer } from "@/components/chat/chat-composer";
import { ChatEmptyState } from "@/components/chat/chat-empty-state";
import {
  AssistantMessage,
  MessageBubble,
  TypingIndicator,
} from "@/components/chat/message-bubble";
import { SlotPicker } from "@/components/chat/slot-picker";
import { Button } from "@/components/ui/button";
import type { tools } from "@/lib/ai/tools";
import { formatDate, toBooking } from "@/lib/chat";
import { cn } from "@/lib/utils";
import { useChat } from "@ai-sdk/react";

type ChatMessage = UIMessage<unknown, UIDataTypes, InferUITools<typeof tools>>;
type ChatPart = ChatMessage["parts"][number];

const enter =
  "animate-in duration-300 fade-in slide-in-from-bottom-2 motion-reduce:animate-none";

function ToolStatus({ children }: { children: React.ReactNode }) {
  return (
    <p
      role="status"
      className={cn(
        "flex items-center gap-2 rounded-2xl rounded-bl-md bg-muted px-3.5 py-2 text-sm text-muted-foreground",
        enter,
      )}
    >
      <RiLoader4Line className="size-4 animate-spin motion-reduce:animate-none" />
      {children}
    </p>
  );
}

export function Chat() {
  const { messages, sendMessage, regenerate, status, error } =
    useChat<ChatMessage>();
  const [picked, setPicked] = useState<Record<string, string>>({});

  const bottomRef = useRef<HTMLDivElement>(null);

  const isThinking = status === "submitted" || status === "streaming";

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  function send(text: string) {
    if (!text.trim() || isThinking) return;

    sendMessage({ text });
  }

  function selectSlot(toolCallId: string, slot: string, barber: string) {
    if (isThinking) return;

    setPicked((current) => ({ ...current, [toolCallId]: slot }));
    send(`${slot} with ${barber} works for me`);
  }

  function renderAssistantPart(part: ChatPart, key: string) {
    switch (part.type) {
      case "text":
        return part.text.trim() ? (
          <MessageBubble key={key} from="assistant" className={enter}>
            {part.text}
          </MessageBubble>
        ) : null;

      case "tool-getAvailableSlots": {
        if (
          part.state === "input-streaming" ||
          part.state === "input-available"
        ) {
          return <ToolStatus key={key}>Checking availability…</ToolStatus>;
        }

        if (part.state !== "output-available") return null;

        const { barber, service, date, times } = part.output;
        const toolCallId = part.toolCallId;

        if (times.length === 0) return null;

        return (
          <SlotPicker
            key={key}
            className={enter}
            barber={barber}
            service={service}
            date={formatDate(date)}
            times={times}
            selected={picked[toolCallId]}
            onSelect={(slot) => selectSlot(toolCallId, slot, barber)}
          />
        );
      }

      case "tool-createBooking": {
        if (
          part.state === "input-streaming" ||
          part.state === "input-available"
        ) {
          return <ToolStatus key={key}>Booking your appointment…</ToolStatus>;
        }

        if (part.state !== "output-available") return null;

        return (
          <BookingCard
            key={key}
            className={enter}
            booking={toBooking(part.output)}
          />
        );
      }

      default:
        return null;
    }
  }

  return (
    <div className="relative isolate flex h-dvh flex-col">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-radial-[at_50%_0%] from-primary/10 via-transparent to-transparent" />

      <AssistantHeader mode="chat" status="Online · replies instantly" />

      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        {messages.length === 0 ? (
          <ChatEmptyState onSelect={send} />
        ) : (
          <div
            role="log"
            aria-live="polite"
            className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-8 sm:px-6"
          >
            {messages.map((message) => {
              if (message.role === "user") {
                const text = message.parts
                  .filter((part) => part.type === "text")
                  .map((part) => part.text)
                  .join("");

                return (
                  <MessageBubble key={message.id} from="user" className={enter}>
                    {text}
                  </MessageBubble>
                );
              }

              return (
                <AssistantMessage key={message.id}>
                  {message.parts.map((part, index) =>
                    renderAssistantPart(
                      part,
                      "toolCallId" in part
                        ? part.toolCallId
                        : `${message.id}-${index}`,
                    ),
                  )}
                </AssistantMessage>
              );
            })}

            {status === "submitted" && <TypingIndicator key="typing" />}

            {error && (
              <div
                role="alert"
                className={cn(
                  "flex items-center gap-2 self-center rounded-full bg-destructive/10 py-1 pr-1 pl-3 text-sm text-destructive",
                  enter,
                )}
              >
                <RiErrorWarningLine className="size-4 shrink-0" />
                Something went wrong.
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={() => regenerate()}
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                >
                  Try again
                </Button>
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        )}
      </div>

      <ChatComposer onSend={send} disabled={isThinking} />
    </div>
  );
}
