import { tool } from "ai";
import { z } from "zod";

import { BookingError } from "@/lib/booking/errors";
import { createBooking, getAvailableSlots } from "@/lib/booking/slots";
import { listBarbers, listServices } from "@/lib/booking/store";
import { toMinutes, toTime } from "../utils";

const findServiceAndBarber = (serviceId: string, barberId: string) => {
  const service = listServices().find((service) => service.id === serviceId);
  const barber = listBarbers().find((barber) => barber.id === barberId);

  if (!service) {
    throw new BookingError("That service doesn't exist");
  }

  if (!barber) {
    throw new BookingError("That barber doesn't exist");
  }

  return { service, barber };
};

const serviceId = z.enum(listServices().map((service) => service.id)).describe(
  `Service id. ${listServices()
    .map(
      (service) =>
        `${service.id} = ${service.name} (${service.durationMinutes} min, ${service.price})`,
    )
    .join(", ")}`,
);

const barberId = z.enum(listBarbers().map((barber) => barber.id)).describe(
  `Barber id. ${listBarbers()
    .map((barber) => `${barber.id} = ${barber.name}`)
    .join(", ")}`,
);

const date = z.iso
  .date()
  .describe("Appointment date as YYYY-MM-DD in the shop's local time");

export const slotsInput = z.object({ serviceId, barberId, date });

export const bookingInput = z.object({
  serviceId,
  barberId,
  date,
  time: z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/)
    .describe(
      "Start time as 24-hour HH:MM, exactly as returned by getAvailableSlots",
    ),
  customerName: z.string().min(1).describe("Customer's full name"),
  customerPhone: z
    .string()
    .min(7)
    .describe("Customer's phone number, including country code"),
});

export const findSlots = ({
  serviceId,
  barberId,
  date,
}: z.infer<typeof slotsInput>) => {
  const { service, barber } = findServiceAndBarber(serviceId, barberId);

  const times = getAvailableSlots({
    barberId,
    date,
    durationMinutes: service.durationMinutes,
  }).map(toTime);

  return {
    service: service.name,
    barber: barber.name,
    date,
    times,
  };
};

export const bookAppointment = ({
  serviceId,
  barberId,
  date,
  time,
  customerName,
  customerPhone,
}: z.infer<typeof bookingInput>) => {
  const { service, barber } = findServiceAndBarber(serviceId, barberId);

  const appointment = createBooking({
    serviceId,
    barberId,
    date,
    start: toMinutes(time),
    customerName,
    customerPhone,
  });

  return {
    id: appointment.id,
    service: service.name,
    barber: barber.name,
    date: appointment.date,
    time: toTime(appointment.start),
    price: service.price,
  };
};

export const tools = {
  getAvailableSlots: tool({
    description:
      "Get the free start times for a service with one barber on one date. Call this before offering any time. If the customer has no preferred barber, call it once for each barber.",
    inputSchema: slotsInput,
    execute: async (input) => findSlots(input),
  }),
  createBooking: tool({
    description:
      "Book an appointment. Only call this after the customer picked a time returned by getAvailableSlots, gave their name and phone number, and confirmed the service, barber, date and time.",
    inputSchema: bookingInput,
    execute: async (input) => bookAppointment(input),
  }),
};
