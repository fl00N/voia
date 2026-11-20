import Link from "next/link";
import {
  RiArrowLeftLine,
  RiChat3Line,
  RiPhoneLine,
} from "@remixicon/react";

import { AssistantAvatar } from "@/components/chat/message-bubble";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const switchTo = {
  chat: { href: "/call", label: "Call instead", icon: RiPhoneLine },
  call: { href: "/chat", label: "Chat instead", icon: RiChat3Line },
};

export function AssistantHeader({
  mode,
  status,
  online = true,
}: {
  mode: "chat" | "call";
  status: string;
  online?: boolean;
}) {
  const action = switchTo[mode];

  return (
    <header className="border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-2xl items-center gap-3 px-4 sm:px-6">
        <Button
          variant="ghost"
          size="icon"
          className="-ml-2"
          aria-label="Back to home"
          render={<Link href="/" />}
          nativeButton={false}
        >
          <RiArrowLeftLine />
        </Button>

        <AssistantAvatar />

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">Voia assistant</p>
          <p className="flex items-center gap-1.5 truncate text-xs text-muted-foreground">
            <span
              className={cn(
                "size-1.5 shrink-0 rounded-full",
                online ? "bg-emerald-500" : "bg-muted-foreground/50",
              )}
            />
            {status}
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="max-sm:size-8 max-sm:p-0"
          render={<Link href={action.href} />}
          nativeButton={false}
        >
          <action.icon data-icon="inline-start" />
          <span className="max-sm:sr-only">{action.label}</span>
        </Button>
      </div>
    </header>
  );
}
