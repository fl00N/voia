import { z } from "zod";

import { BookingError } from "@/lib/booking/errors";

export const createBookingRoute =
  <Schema extends z.ZodType, Result>(
    schema: Schema,
    action: (input: z.infer<Schema>) => Result,
  ) =>
  async (request: Request) => {
    const body = await request.json().catch(() => null);
    const input = schema.safeParse(body);

    if (!input.success) {
      return Response.json(
        { error: z.prettifyError(input.error) },
        { status: 400 },
      );
    }

    try {
      return Response.json(action(input.data));
    } catch (error) {
      if (error instanceof BookingError) {
        return Response.json({ error: error.message }, { status: 409 });
      }

      console.error("Booking route error:", error);

      return Response.json(
        { error: "Something went wrong. Please try again." },
        { status: 500 },
      );
    }
  };
