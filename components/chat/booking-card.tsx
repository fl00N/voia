import {
  RiCalendarCheckLine,
  RiCalendarLine,
  RiCheckboxCircleFill,
  RiPriceTag3Line,
  RiTimeLine,
  RiUserLine,
} from "@remixicon/react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Booking } from "@/lib/chat";

export function BookingCard({ booking }: { booking: Booking }) {
  const details = [
    { icon: RiUserLine, label: "Barber", value: booking.barber },
    { icon: RiCalendarLine, label: "Date", value: booking.date },
    { icon: RiTimeLine, label: "Time", value: booking.time },
    { icon: RiPriceTag3Line, label: "Price", value: booking.price },
  ];

  return (
    <Card
      size="sm"
      className="w-full max-w-sm rounded-3xl shadow-none ring-foreground/10"
    >
      <CardHeader>
        <p className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
          <RiCheckboxCircleFill className="size-4" />
          Booking confirmed
        </p>
        <CardTitle className="text-lg">{booking.service}</CardTitle>
      </CardHeader>

      <CardContent>
        <dl className="grid grid-cols-2 gap-x-4 gap-y-3 rounded-2xl bg-muted/60 p-3">
          {details.map((detail) => (
            <div key={detail.label}>
              <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <detail.icon className="size-3.5" />
                {detail.label}
              </dt>
              <dd className="mt-0.5 font-medium">{detail.value}</dd>
            </div>
          ))}
        </dl>
      </CardContent>

      <CardFooter className="gap-2">
        <Button variant="outline" size="sm" className="flex-1">
          <RiCalendarCheckLine data-icon="inline-start" />
          Add to calendar
        </Button>
        <Button variant="ghost" size="sm" className="flex-1">
          Reschedule
        </Button>
      </CardFooter>
    </Card>
  );
}
