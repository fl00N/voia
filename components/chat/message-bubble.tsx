import { RiSparkling2Fill } from "@remixicon/react";

import { cn } from "@/lib/utils";

export function MessageBubble({
  from,
  className,
  children,
}: {
  from: "assistant" | "user";
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex max-w-[85%] flex-col rounded-2xl px-3.5 py-2 text-[15px] text-pretty",
        from === "assistant"
          ? "self-start rounded-bl-md bg-muted"
          : "self-end rounded-br-md bg-primary text-primary-foreground",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function AssistantAvatar({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground",
        className,
      )}
    >
      <RiSparkling2Fill className="size-4" />
    </span>
  );
}

export function AssistantMessage({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <AssistantAvatar className="mt-0.5" />
      <div className="flex min-w-0 flex-1 flex-col items-start gap-3">
        {children}
      </div>
    </div>
  );
}

export function TypingIndicator() {
  return (
    <AssistantMessage>
      <div
        role="status"
        aria-label="Voia is typing"
        className="flex items-center gap-1 rounded-2xl rounded-bl-md bg-muted px-4 py-3.5"
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="size-1.5 animate-typing rounded-full bg-muted-foreground motion-reduce:animate-none"
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
      </div>
    </AssistantMessage>
  );
}
