import { createBookingRoute } from "@/lib/ai/booking-route";
import { bookAppointment, bookingInput } from "@/lib/ai/tools";

export const POST = createBookingRoute(bookingInput, bookAppointment);
