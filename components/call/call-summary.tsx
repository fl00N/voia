import Link from "next/link";
import {
  RiCheckboxCircleFill,
  RiPhoneFill,
  RiRestartLine,
} from "@remixicon/react";

import { BookingCard } from "@/components/chat/booking-card";
import { Button } from "@/components/ui/button";
import { formatDuration } from "@/lib/call";
import type { Booking } from "@/lib/chat";
import { cn } from "@/lib/utils";

export function CallSummary({
  booking,
  error,
  seconds,
  onRestart,
}: {
  booking?: Booking;
  error?: string;
  seconds: number;
  onRestart: () => void;
}) {
  return (
    <div className="flex flex-1 animate-in flex-col items-center justify-center duration-500 fade-in zoom-in-95">
      <span
        className={cn(
          "flex size-14 items-center justify-center rounded-full",
          booking
            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
            : "bg-muted text-muted-foreground",
        )}
      >
        {booking ? (
          <RiCheckboxCircleFill className="size-7" />
        ) : (
          <RiPhoneFill className="size-6 rotate-135" />
        )}
      </span>

      <h2 className="mt-5 font-heading text-2xl font-semibold tracking-tight">
        {booking ? "You're booked!" : "Call ended"}
      </h2>
      <p className="mt-1 text-sm text-muted-foreground tabular-nums">
        {booking
          ? `Call ended · ${formatDuration(seconds)}`
          : (error ?? "No booking was made. You can call again anytime.")}
      </p>

      {booking && (
        <div className="mt-8 flex w-full justify-center text-left">
          <BookingCard booking={booking} />
        </div>
      )}

      <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
        <Button
          variant="outline"
          size="lg"
          className="h-11 px-5"
          onClick={onRestart}
        >
          <RiRestartLine data-icon="inline-start" />
          Call again
        </Button>
        <Button
          size="lg"
          className="h-11 px-5"
          render={<Link href="/" />}
          nativeButton={false}
        >
          Back to home
        </Button>
      </div>
    </div>
  );
}
