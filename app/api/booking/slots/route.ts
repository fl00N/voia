import { createBookingRoute } from "@/lib/ai/booking-route";
import { findSlots, slotsInput } from "@/lib/ai/tools";

export const POST = createBookingRoute(slotsInput, findSlots);
