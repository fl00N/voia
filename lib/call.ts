import type { Booking } from "@/lib/chat";

export type CallStatus = "idle" | "connecting" | "active" | "ended";

export type TranscriptLine = {
  id: string;
  role: "assistant" | "user";
  text: string;
};

export const mockCallScript: (TranscriptLine & { delay: number })[] = [
  {
    id: "1",
    role: "assistant",
    text: "Hi, this is Voia from the barbershop. How can I help?",
    delay: 800,
  },
  {
    id: "2",
    role: "user",
    text: "Hey, can I get a haircut with Marco tomorrow evening?",
    delay: 2600,
  },
  {
    id: "3",
    role: "assistant",
    text: "Sure. Marco is free at 5:15, 6:00 or 7:30. Which works best?",
    delay: 2600,
  },
  {
    id: "4",
    role: "user",
    text: "Six is perfect.",
    delay: 2800,
  },
  {
    id: "5",
    role: "assistant",
    text: "Done. Tomorrow at 6 PM with Marco. I'll text you a confirmation.",
    delay: 1800,
  },
];

export const mockCallBooking: Booking = {
  service: "Haircut",
  barber: "Marco",
  date: "Tomorrow",
  time: "6:00 PM",
  price: "$30",
};

export function formatDuration(totalSeconds: number) {
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}
