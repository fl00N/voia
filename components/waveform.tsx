import { cn } from "@/lib/utils";

const bars = [0.5, 0.85, 0.35, 1, 0.65, 0.5];

export function Waveform({
  className,
  barClassName,
}: {
  className?: string;
  barClassName?: string;
}) {
  return (
    <div className={cn("flex h-6 items-center gap-0.5", className)}>
      {bars.map((height, i) => (
        <span
          key={i}
          className={cn(
            "w-0.5 origin-center animate-wave rounded-full bg-current motion-reduce:animate-none",
            barClassName,
          )}
          style={{ height: `${height * 100}%`, animationDelay: `${i * 120}ms` }}
        />
      ))}
    </div>
  );
}
