import {
  addAppointment,
  listAppointments,
  listBarbers,
  listServices,
} from "./store";
import { BookingError } from "./errors";
import { shopNow } from "./clock";

export const calculateSlots = (
  date: string,
  durationMinutes: number,
  booked: { start: number; end: number }[],
): number[] => {
  const slots: number[] = [];
  const openingTime = 600;
  const closingTime = new Date(date).getUTCDay() % 6 !== 0 ? 1080 : 960;

  for (let i = openingTime; i <= closingTime - durationMinutes; i += 30) {
    let isBooked = false;
    for (const booking of booked) {
      if (i < booking.end && i + durationMinutes > booking.start) {
        isBooked = true;
        break;
      }
    }
    if (!isBooked) {
      slots.push(i);
    }
  }

  return slots;
};

export const getAvailableSlots = (input: {
  barberId: string;
  date: string;
  durationMinutes: number;
}): number[] => {
  const now = shopNow();

  if (input.date < now.date) {
    throw new BookingError("That date has already passed");
  }

  const booked = listAppointments(input.barberId, input.date).map(
    (appointment) => ({
      start: appointment.start,
      end: appointment.end,
    }),
  );
  const slots = calculateSlots(input.date, input.durationMinutes, booked);

  if (input.date === now.date) {
    return slots.filter((start) => start > now.minutes);
  }

  return slots;
};

export const createBooking = (input: {
  barberId: string;
  serviceId: string;
  date: string;
  start: number;
  customerName: string;
  customerPhone: string;
}) => {
  const service = listServices().find(
    (service) => service.id === input.serviceId,
  );

  const barber = listBarbers().find((barber) => barber.id === input.barberId);

  if (!barber?.id) {
    throw new BookingError("That barber doesn't exist");
  }

  if (!service?.id) {
    throw new BookingError("That service doesn't exist");
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.date)) {
    throw new BookingError("Invalid Date");
  }

  const start = getAvailableSlots({
    barberId: input.barberId,
    date: input.date,
    durationMinutes: service.durationMinutes,
  }).find((start) => start === input.start);

  if (!start) {
    throw new BookingError("That time isn't available");
  }

  const end = start + service.durationMinutes;

  return addAppointment({ ...input, end });
};
