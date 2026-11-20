"use client";

import { useEffect, useRef, useState } from "react";

import { AssistantHeader } from "@/components/assistant-header";
import { BookingCard } from "@/components/chat/booking-card";
import { ChatComposer } from "@/components/chat/chat-composer";
import { ChatEmptyState } from "@/components/chat/chat-empty-state";
import {
  AssistantMessage,
  MessageBubble,
  TypingIndicator,
} from "@/components/chat/message-bubble";
import { TimeSlots } from "@/components/chat/time-slots";
import { mockReply, type Message } from "@/lib/chat";

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isThinking]);

  async function send(text: string) {
    setMessages((current) => [
      ...current,
      { id: crypto.randomUUID(), role: "user", text },
    ]);
    setIsThinking(true);
    const reply = await mockReply(text);
    setMessages((current) => [...current, reply]);
    setIsThinking(false);
  }

  function selectSlot(messageId: string, slot: string) {
    setMessages((current) =>
      current.map((message) =>
        message.id === messageId ? { ...message, selectedSlot: slot } : message,
      ),
    );
    send(`${slot} works for me`);
  }

  return (
    <div className="flex h-dvh flex-col">
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
            {messages.map((message) =>
              message.role === "user" ? (
                <MessageBubble key={message.id} from="user">
                  {message.text}
                </MessageBubble>
              ) : (
                <AssistantMessage key={message.id}>
                  <MessageBubble from="assistant">{message.text}</MessageBubble>
                  {message.slots && (
                    <TimeSlots
                      slots={message.slots}
                      selected={message.selectedSlot}
                      onSelect={(slot) => selectSlot(message.id, slot)}
                    />
                  )}
                  {message.booking && <BookingCard booking={message.booking} />}
                </AssistantMessage>
              ),
            )}
            {isThinking && <TypingIndicator />}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      <ChatComposer onSend={send} disabled={isThinking} />
    </div>
  );
}
