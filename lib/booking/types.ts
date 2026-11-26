export type Service = {
  id: string;
  name: string;
  durationMinutes: number;
  price: number;
};

export type Barber = { id: string; name: string };

export type Appointment = {
  id: string;
  barberId: string;
  serviceId: string;
  date: string;
  start: number;
  end: number;
  customerName: string;
  customerPhone: string;
};
