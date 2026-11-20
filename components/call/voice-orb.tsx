import { RiSparkling2Fill } from "@remixicon/react";

import type { CallStatus } from "@/lib/call";
import { cn } from "@/lib/utils";

export function VoiceOrb({
  status,
  isSpeaking,
}: {
  status: CallStatus;
  isSpeaking: boolean;
}) {
  return (
    <div className="relative flex size-56 shrink-0 items-center justify-center">
      <div
        className={cn(
          "absolute inset-8 rounded-full bg-primary/25 blur-3xl transition-opacity duration-700",
          status === "active" ? "opacity-100" : "opacity-40",
        )}
      />

      {isSpeaking &&
        [0, 1, 2].map((i) => (
          <span
            key={i}
            className="absolute inset-0 m-auto size-32 animate-ripple rounded-full border border-primary/50 motion-reduce:hidden"
            style={{ animationDelay: `${i * 600}ms` }}
          />
        ))}

      <div
        className={cn(
          "relative flex size-32 items-center justify-center rounded-full bg-linear-to-br from-primary to-primary/70 text-primary-foreground shadow-2xl shadow-primary/30 ring-8 ring-primary/10 transition-transform duration-500 ease-out",
          status === "connecting" && "animate-pulse",
          isSpeaking && "scale-110",
        )}
      >
        <RiSparkling2Fill className="size-12" />
      </div>
    </div>
  );
}
