import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const periods = [
  { label: "Morning", from: 0, to: 12 },
  { label: "Afternoon", from: 12, to: 17 },
  { label: "Evening", from: 17, to: 24 },
];

export function TimeSlots({
  slots,
  selected,
  onSelect,
}: {
  slots: string[];
  selected?: string;
  onSelect: (slot: string) => void;
}) {
  const groups = periods
    .map((period) => ({
      ...period,
      slots: slots.filter((slot) => {
        const hour = Number.parseInt(slot, 10);
        return hour >= period.from && hour < period.to;
      }),
    }))
    .filter((group) => group.slots.length > 0);

  return (
    <div className="flex flex-col gap-3">
      {groups.map((group) => (
        <div key={group.label} className="flex flex-col gap-1.5">
          <p className="text-xs text-muted-foreground">{group.label}</p>
          <div className="grid grid-cols-4 gap-1.5">
            {group.slots.map((slot) => {
              const isSelected = slot === selected;
              return (
                <Button
                  key={slot}
                  variant={isSelected ? "default" : "outline"}
                  disabled={Boolean(selected)}
                  aria-pressed={isSelected}
                  onClick={() => onSelect(slot)}
                  className={cn(
                    "w-full px-0 tabular-nums",
                    !selected && "hover:border-primary hover:text-primary",
                    isSelected && "disabled:opacity-100",
                  )}
                >
                  {slot}
                </Button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
