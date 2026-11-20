import type { TranscriptLine } from "@/lib/call";
import { cn } from "@/lib/utils";

export function CallTranscript({ lines }: { lines: TranscriptLine[] }) {
  return (
    <div
      role="log"
      aria-live="polite"
      aria-label="Live transcript"
      className="flex h-36 w-full flex-col justify-end gap-3 overflow-hidden mask-t-from-40%"
    >
      {lines.map((line, i) => (
        <p
          key={line.id}
          className={cn(
            "animate-in text-[15px] text-pretty duration-500 fade-in slide-in-from-bottom-2",
            line.role === "user" && "text-muted-foreground",
            i < lines.length - 1 && "opacity-60",
          )}
        >
          <span className="mr-1.5 text-xs font-medium tracking-wide text-primary uppercase">
            {line.role === "assistant" ? "Voia" : "You"}
          </span>
          {line.text}
        </p>
      ))}
    </div>
  );
}
