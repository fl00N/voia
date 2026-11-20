import {
  RiCheckboxCircleFill,
  RiMicLine,
  RiPhoneFill,
  RiSendPlane2Fill,
  RiSparkling2Fill,
} from "@remixicon/react";

import { MessageBubble } from "@/components/chat/message-bubble";
import { Waveform } from "@/components/waveform";
import { cn } from "@/lib/utils";

const slots = ["5:15 PM", "6:00 PM", "6:45 PM"];
const pickedSlot = "6:00 PM";

export function ChatPreview() {
  return (
    <div aria-hidden className="relative mx-auto w-full max-w-md">
      <div className="absolute -inset-6 -z-10 rounded-[3rem] bg-primary/15 blur-3xl" />

      <div className="overflow-hidden rounded-4xl bg-card shadow-xl ring-1 ring-foreground/5 dark:ring-foreground/10">
        <div className="flex items-center gap-3 border-b px-5 py-4">
          <span className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <RiSparkling2Fill className="size-4" />
          </span>
          <div>
            <p className="text-sm font-medium">Voia assistant</p>
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              Online · replies instantly
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 p-5">
          <MessageBubble from="assistant" className="text-sm">
            Hey! What can I book for you today?
          </MessageBubble>
          <MessageBubble from="user" className="text-sm">
            Skin fade and a beard trim, tomorrow after 5?
          </MessageBubble>
          <MessageBubble from="assistant" className="text-sm">
            Marco is free tomorrow at:
            <div className="mt-2 flex flex-wrap gap-1.5">
              {slots.map((slot) => (
                <span
                  key={slot}
                  className={cn(
                    "rounded-full border bg-background px-2.5 py-1 text-xs font-medium",
                    slot === pickedSlot &&
                      "border-primary bg-primary text-primary-foreground",
                  )}
                >
                  {slot}
                </span>
              ))}
            </div>
          </MessageBubble>
          <MessageBubble from="user" className="text-sm">
            6:00 works
          </MessageBubble>
          <MessageBubble from="assistant" className="text-sm">
            <span className="flex items-center gap-1.5 font-medium">
              <RiCheckboxCircleFill className="size-4 text-emerald-500" />
              You&apos;re booked!
            </span>
            <span className="text-muted-foreground">
              Tomorrow, 6:00 PM with Marco
            </span>
          </MessageBubble>
        </div>

        <div className="flex items-center gap-2 border-t px-4 py-3">
          <div className="flex-1 rounded-full bg-muted px-4 py-2 text-sm text-muted-foreground">
            Type a message…
          </div>
          <span className="flex size-9 items-center justify-center rounded-full text-muted-foreground">
            <RiMicLine className="size-4" />
          </span>
          <span className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <RiSendPlane2Fill className="size-4" />
          </span>
        </div>
      </div>

      <CallPill />
    </div>
  );
}

function CallPill() {
  return (
    <div className="absolute -top-8 right-4 flex items-center gap-3 rounded-full bg-foreground py-2 pr-4 pl-2 text-background shadow-lg">
      <span className="flex size-8 items-center justify-center rounded-full bg-emerald-500 text-white">
        <RiPhoneFill className="size-4" />
      </span>
      <div className="leading-tight">
        <p className="text-xs font-medium">Voia is on a call</p>
        <p className="text-[11px] opacity-60">Booking a lineup · 0:42</p>
      </div>
      <Waveform />
    </div>
  );
}
