import { Appointment } from "./types";

const services = [
  { name: "trim", durationMinutes: 30, id: "1", price: 100 },
  { name: "beard", durationMinutes: 60, id: "2", price: 150 },
];
const barbers = [
  { name: "Cian", id: "1" },
  { name: "Alex", id: "2" },
];

const appointments: Appointment[] = [];

export const listServices = () => {
  return services.map((service) => service);
};

export const listBarbers = () => {
  return barbers.map((barber) => barber);
};

export const listAppointments = (barberId: string, date: string) => {
  return appointments.filter(
    (appointment) =>
      appointment.barberId === barberId && appointment.date === date,
  );
};

export const addAppointment = (data: Omit<Appointment, "id">) => {
  const appointment = { id: crypto.randomUUID(), ...data };
  appointments.push(appointment);
  return appointment;
};
