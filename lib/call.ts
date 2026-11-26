export type CallStatus = "idle" | "connecting" | "active" | "ended";

export type TranscriptLine = {
  id: string;
  role: "assistant" | "user";
  text: string;
};

export function formatDuration(totalSeconds: number) {
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}
