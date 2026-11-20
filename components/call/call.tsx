"use client";

import { useEffect, useState } from "react";
import { RiMicOffLine, RiPhoneFill } from "@remixicon/react";

import { AssistantHeader } from "@/components/assistant-header";
import { CallControls } from "@/components/call/call-controls";
import { CallSummary } from "@/components/call/call-summary";
import { CallTranscript } from "@/components/call/call-transcript";
import { VoiceOrb } from "@/components/call/voice-orb";
import { Button } from "@/components/ui/button";
import { Waveform } from "@/components/waveform";
import {
  formatDuration,
  mockCallBooking,
  mockCallScript,
  type CallStatus,
  type TranscriptLine,
} from "@/lib/call";

const headerStatus: Record<CallStatus, string> = {
  idle: "Online · ready to talk",
  connecting: "Connecting…",
  active: "On a call",
  ended: "Call ended",
};

export function Call() {
  const [status, setStatus] = useState<CallStatus>("idle");
  const [transcript, setTranscript] = useState<TranscriptLine[]>([]);
  const [seconds, setSeconds] = useState(0);
  const [muted, setMuted] = useState(false);

  const speaker = transcript.at(-1)?.role;
  const booked = transcript.length === mockCallScript.length;

  useEffect(() => {
    if (status !== "connecting") return;
    const timeout = setTimeout(() => setStatus("active"), 1500);
    return () => clearTimeout(timeout);
  }, [status]);

  useEffect(() => {
    if (status !== "active") return;
    const interval = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, [status]);

  useEffect(() => {
    if (status !== "active") return;
    let elapsed = 0;
    const timeouts = mockCallScript.map(({ delay, ...line }) => {
      elapsed += delay;
      return setTimeout(
        () => setTranscript((current) => [...current, line]),
        elapsed,
      );
    });
    timeouts.push(setTimeout(() => setStatus("ended"), elapsed + 2500));
    return () => timeouts.forEach(clearTimeout);
  }, [status]);

  function startCall() {
    setTranscript([]);
    setSeconds(0);
    setMuted(false);
    setStatus("connecting");
  }

  return (
    <div className="relative isolate flex h-dvh flex-col">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-radial-[at_50%_40%] from-primary/10 via-transparent to-transparent" />

      <AssistantHeader
        mode="call"
        status={headerStatus[status]}
        online={status !== "ended"}
      />

      <main className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        <h1 className="sr-only">Voice call with Voia</h1>

        <div className="mx-auto flex w-full max-w-md flex-1 flex-col items-center px-4 py-8 text-center sm:px-6">
          {status === "ended" ? (
            <CallSummary
              booking={booked ? mockCallBooking : undefined}
              seconds={seconds}
              onRestart={startCall}
            />
          ) : (
            <>
              <div className="flex flex-1 flex-col items-center justify-center">
                <VoiceOrb
                  status={status}
                  isSpeaking={status === "active" && speaker === "assistant"}
                />

                {status === "idle" && (
                  <>
                    <h2 className="mt-4 font-heading text-3xl font-semibold tracking-tight">
                      Talk to Voia
                    </h2>
                    <p className="mt-2 max-w-xs text-pretty text-muted-foreground">
                      Book, move or cancel an appointment just by saying it.
                      Most calls take under a minute.
                    </p>
                  </>
                )}

                {status === "connecting" && (
                  <>
                    <h2 className="mt-4 font-heading text-3xl font-semibold tracking-tight">
                      Calling Voia…
                    </h2>
                    <p className="mt-2 text-muted-foreground">
                      Connecting you now
                    </p>
                  </>
                )}

                {status === "active" && (
                  <>
                    <p className="mt-4 font-heading text-4xl font-light tracking-tight tabular-nums">
                      {formatDuration(seconds)}
                    </p>
                    <div className="mt-2 flex h-5 items-center justify-center gap-2 text-sm text-muted-foreground">
                      <ActivityLabel muted={muted} speaker={speaker} />
                    </div>
                  </>
                )}
              </div>

              {status === "idle" ? (
                <div className="flex flex-col items-center gap-3 pt-8">
                  <Button
                    size="lg"
                    className="h-14 rounded-full px-8 text-base has-data-[icon=inline-start]:pl-7"
                    onClick={startCall}
                  >
                    <RiPhoneFill data-icon="inline-start" className="size-5" />
                    Start call
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Uses your microphone. Switch to chat anytime.
                  </p>
                </div>
              ) : (
                <>
                  <CallTranscript lines={transcript} />
                  <div className="pt-8">
                    <CallControls
                      muted={muted}
                      disabled={status !== "active"}
                      onToggleMute={() => setMuted((m) => !m)}
                      onEnd={() => setStatus("ended")}
                    />
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

function ActivityLabel({
  muted,
  speaker,
}: {
  muted: boolean;
  speaker?: TranscriptLine["role"];
}) {
  if (muted) {
    return (
      <>
        <RiMicOffLine className="size-4" />
        You&apos;re muted
      </>
    );
  }

  if (speaker === "user") {
    return (
      <>
        <Waveform className="h-4 text-primary" />
        Listening
      </>
    );
  }

  return speaker === "assistant" ? "Voia is speaking" : "Connected";
}
