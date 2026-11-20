import { RiMicLine, RiMicOffLine, RiPhoneFill } from "@remixicon/react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function CallControls({
  muted,
  disabled,
  onToggleMute,
  onEnd,
}: {
  muted: boolean;
  disabled?: boolean;
  onToggleMute: () => void;
  onEnd: () => void;
}) {
  return (
    <div className="flex items-start justify-center gap-12">
      <ControlButton
        label={muted ? "Unmute" : "Mute"}
        aria-pressed={muted}
        disabled={disabled}
        onClick={onToggleMute}
        variant="secondary"
        className={cn(
          muted && "bg-foreground text-background hover:bg-foreground/90",
        )}
      >
        {muted ? (
          <RiMicOffLine className="size-6" />
        ) : (
          <RiMicLine className="size-6" />
        )}
      </ControlButton>

      <ControlButton
        label="End call"
        onClick={onEnd}
        className="bg-destructive text-white hover:bg-destructive/90"
      >
        <RiPhoneFill className="size-6 rotate-135" />
      </ControlButton>
    </div>
  );
}

function ControlButton({
  label,
  className,
  children,
  ...props
}: React.ComponentProps<typeof Button> & { label: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <Button
        size="icon"
        aria-label={label}
        className={cn("size-16 rounded-full", className)}
        {...props}
      >
        {children}
      </Button>
      <span aria-hidden className="text-xs text-muted-foreground">
        {label}
      </span>
    </div>
  );
}
