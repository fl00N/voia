import { TimeSlots } from "@/components/chat/time-slots";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function SlotPicker({
  barber,
  service,
  date,
  times,
  selected,
  onSelect,
  className,
}: {
  barber: string;
  service: string;
  date: string;
  times: string[];
  selected?: string;
  onSelect: (slot: string) => void;
  className?: string;
}) {
  return (
    <Card
      size="sm"
      className={cn(
        "w-full max-w-sm rounded-3xl shadow-none ring-foreground/10",
        className,
      )}
    >
      <CardHeader>
        <CardTitle>{barber}</CardTitle>
        <CardDescription className="first-letter:uppercase">
          {service} · {date}
        </CardDescription>
        <CardAction>
          <Badge variant="secondary">
            {selected ? `${selected} picked` : `${times.length} free`}
          </Badge>
        </CardAction>
      </CardHeader>

      <CardContent>
        <TimeSlots slots={times} selected={selected} onSelect={onSelect} />
      </CardContent>
    </Card>
  );
}
