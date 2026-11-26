import type { bookAppointment } from "@/lib/ai/tools";

export const MAX_MESSAGE_LENGTH = 100;

export type Booking = {
  service: string;
  barber: string;
  date: string;
  time: string;
  price: string;
};

export function formatDate(date: string) {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function toBooking(result: ReturnType<typeof bookAppointment>): Booking {
  return {
    service: result.service,
    barber: result.barber,
    date: formatDate(result.date),
    time: result.time,
    price: `$${result.price}`,
  };
}

export type Message = {
  id: string;
  role: "user" | "assistant";
  text: string;
  slots?: string[];
  selectedSlot?: string;
  booking?: Booking;
};

const availableSlots = ["5:15 PM", "6:00 PM", "6:45 PM", "7:30 PM"];

export async function mockReply(text: string): Promise<Message> {
  await new Promise((resolve) => setTimeout(resolve, 1200));

  const pickedSlot = availableSlots.find((slot) => text.startsWith(slot));

  if (pickedSlot) {
    return {
      id: crypto.randomUUID(),
      role: "assistant",
      text: "Done! You're all set. I've sent the details to your phone.",
      booking: {
        service: "Skin fade + beard trim",
        barber: "Marco",
        date: "Tomorrow",
        time: pickedSlot,
        price: "$45",
      },
    };
  }

  return {
    id: crypto.randomUUID(),
    role: "assistant",
    text: "Nice. Marco has these times open tomorrow:",
    slots: availableSlots,
  };
}
