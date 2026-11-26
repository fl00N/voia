"use client";

import { useState } from "react";
import Link from "next/link";
import { RiArrowUpLine, RiMicLine } from "@remixicon/react";

import { Button } from "@/components/ui/button";
import { MAX_MESSAGE_LENGTH } from "@/lib/chat";
import { cn } from "@/lib/utils";

export function ChatComposer({
  onSend,
  disabled,
}: {
  onSend: (text: string) => void;
  disabled?: boolean;
}) {
  const [value, setValue] = useState("");
  const canSend = value.trim().length > 0 && !disabled;
  const isNearLimit = value.length >= MAX_MESSAGE_LENGTH - 20;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!canSend) return;
    onSend(value.trim());
    setValue("");
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (
      event.key === "Enter" &&
      !event.shiftKey &&
      !event.nativeEvent.isComposing
    ) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto w-full max-w-2xl px-4 pb-4 sm:px-6 sm:pb-6"
    >
      <div className="flex items-end gap-1.5 rounded-3xl border bg-background p-1.5 shadow-sm transition-shadow focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/30">
        <label htmlFor="chat-input" className="sr-only">
          Message Voia
        </label>
        <textarea
          id="chat-input"
          rows={1}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={handleKeyDown}
          maxLength={MAX_MESSAGE_LENGTH}
          aria-describedby={isNearLimit ? "chat-input-count" : undefined}
          placeholder="Message Voia…"
          className="max-h-40 min-h-9 flex-1 resize-none bg-transparent px-3 py-1.5 text-[15px] leading-6 outline-none field-sizing-content placeholder:text-muted-foreground"
        />
        {isNearLimit && (
          <span
            id="chat-input-count"
            className={cn(
              "flex h-9 items-center px-1 text-xs text-muted-foreground tabular-nums",
              value.length >= MAX_MESSAGE_LENGTH && "text-destructive",
            )}
          >
            {value.length}/{MAX_MESSAGE_LENGTH}
          </span>
        )}
        <Button
          variant="ghost"
          size="icon"
          aria-label="Talk to Voia instead"
          render={<Link href="/call" />}
          nativeButton={false}
          className="text-muted-foreground"
        >
          <RiMicLine />
        </Button>
        <Button
          type="submit"
          size="icon"
          aria-label="Send message"
          disabled={!canSend}
        >
          <RiArrowUpLine />
        </Button>
      </div>
      <p className="mt-2 text-center text-xs text-muted-foreground">
        Voia can make mistakes. Every booking is confirmed by SMS.
      </p>
    </form>
  );
}
