import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function TimeSlots({
  slots,
  selected,
  onSelect,
}: {
  slots: string[];
  selected?: string;
  onSelect: (slot: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {slots.map((slot) => {
        const isSelected = slot === selected;
        return (
          <Button
            key={slot}
            variant={isSelected ? "default" : "outline"}
            disabled={Boolean(selected)}
            aria-pressed={isSelected}
            onClick={() => onSelect(slot)}
            className={cn(
              "h-9 px-4 tabular-nums",
              !selected && "hover:border-primary hover:text-primary",
              isSelected && "disabled:opacity-100",
            )}
          >
            {slot}
          </Button>
        );
      })}
    </div>
  );
}
