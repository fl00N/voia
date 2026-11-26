"use client";

import { useEffect, useRef, useState } from "react";
import { google } from "@ai-sdk/google";
import { experimental_useRealtime } from "@ai-sdk/react";
import { RiMicLine, RiMicOffLine, RiPhoneFill } from "@remixicon/react";

import { AssistantHeader } from "@/components/assistant-header";
import { CallControls } from "@/components/call/call-controls";
import { CallSummary } from "@/components/call/call-summary";
import { CallTranscript } from "@/components/call/call-transcript";
import { VoiceOrb } from "@/components/call/voice-orb";
import { Button } from "@/components/ui/button";
import { Waveform } from "@/components/waveform";
import { CALL_STARTED, VOICE_MODEL, voiceSessionConfig } from "@/lib/ai/voice";
import {
  formatDuration,
  type CallStatus,
  type TranscriptLine,
} from "@/lib/call";
import { toBooking, type Booking } from "@/lib/chat";

const model = google.experimental_realtime(VOICE_MODEL);

const toolRoutes: Record<string, string> = {
  getAvailableSlots: "/api/booking/slots",
  createBooking: "/api/booking/book",
};

const headerStatus: Record<CallStatus, string> = {
  idle: "Online · ready to talk",
  connecting: "Connecting…",
  active: "On a call",
  ended: "Call ended",
};

export function Call() {
  const [phase, setPhase] = useState<"idle" | "live" | "ended">("idle");
  const [hasConnected, setHasConnected] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [muted, setMuted] = useState(false);
  const [booking, setBooking] = useState<Booking>();
  const [error, setError] = useState<string>();
  const [transcriptFrom, setTranscriptFrom] = useState(0);
  const greetedRef = useRef(false);

  const realtime = experimental_useRealtime({
    model,
    api: { token: "/api/realtime/setup" },
    sessionConfig: voiceSessionConfig,
    onToolCall: async ({ toolCall }) => {
      const route = toolRoutes[toolCall.toolName];
      if (!route) return { error: `Unknown tool ${toolCall.toolName}` };

      try {
        const response = await fetch(route, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(toolCall.args),
        });
        const result = await response.json();

        if (response.ok && toolCall.toolName === "createBooking") {
          setBooking(toBooking(result));
        }

        return result;
      } catch {
        return { error: "The booking system is unavailable right now." };
      }
    },
    onEvent: (event) => {
      if (event.type === "session-created") setHasConnected(true);
    },
    onError: (error) => console.error("Call error:", error),
  });

  useEffect(() => {
    if (realtime.status !== "connected" || greetedRef.current) return;
    greetedRef.current = true;

    realtime.sendTextMessage(CALL_STARTED);
    realtime.resumeAudioCapture().catch(() => {
      setError(
        "Voia needs your microphone. Allow access in your browser and call again.",
      );
      realtime.disconnect();
      setPhase("ended");
    });
  }, [realtime]);

  const dropped =
    phase === "live" &&
    (realtime.status === "error" ||
      (hasConnected && realtime.status === "disconnected"));

  const status: CallStatus =
    phase === "idle"
      ? "idle"
      : phase === "ended" || dropped
        ? "ended"
        : realtime.status === "connected"
          ? "active"
          : "connecting";

  const isSpeaking = status === "active" && realtime.isPlaying;

  const transcript: TranscriptLine[] = realtime.messages
    .slice(transcriptFrom)
    .flatMap((message) => {
      if (message.role !== "user" && message.role !== "assistant") return [];

      const text = message.parts
        .filter((part) => part.type === "text")
        .map((part) => part.text)
        .join("")
        .trim();

      if (!text || text === CALL_STARTED) return [];

      return [{ id: message.id, role: message.role, text }];
    });

  useEffect(() => {
    if (status !== "active") return;
    const interval = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, [status]);

  function startCall() {
    greetedRef.current = false;
    setTranscriptFrom(realtime.messages.length);
    setHasConnected(false);
    setSeconds(0);
    setMuted(false);
    setBooking(undefined);
    setError(undefined);
    setPhase("live");
    void realtime.connect();
  }

  function endCall() {
    realtime.disconnect();
    setPhase("ended");
  }

  function toggleMute() {
    if (muted) {
      realtime.resumeAudioCapture().catch(() => setMuted(true));
    } else {
      realtime.stopAudioCapture();
    }
    setMuted(!muted);
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
              booking={booking}
              error={
                error ??
                (dropped ? "The call dropped. Please try again." : undefined)
              }
              seconds={seconds}
              onRestart={startCall}
            />
          ) : (
            <>
              <div className="flex flex-1 flex-col items-center justify-center">
                <VoiceOrb status={status} isSpeaking={isSpeaking} />

                {status === "idle" && (
                  <>
                    <h2 className="mt-4 font-heading text-3xl font-semibold tracking-tight">
                      Talk to Voia
                    </h2>
                    <p className="mt-2 max-w-xs text-pretty text-muted-foreground">
                      Book an appointment just by saying it. Most calls take
                      under a minute.
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
                      <ActivityLabel
                        muted={muted}
                        isSpeaking={isSpeaking}
                        isCapturing={realtime.isCapturing}
                      />
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
                      onToggleMute={toggleMute}
                      onEnd={endCall}
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
  isSpeaking,
  isCapturing,
}: {
  muted: boolean;
  isSpeaking: boolean;
  isCapturing: boolean;
}) {
  if (muted) {
    return (
      <>
        <RiMicOffLine className="size-4" />
        You&apos;re muted
      </>
    );
  }

  if (isSpeaking) return "Voia is speaking";

  if (!isCapturing) {
    return (
      <>
        <RiMicLine className="size-4" />
        Waiting for your microphone…
      </>
    );
  }

  return (
    <>
      <Waveform className="h-4 text-primary" />
      Listening
    </>
  );
}
