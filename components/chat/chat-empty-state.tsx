import { RiSparkling2Fill, RiTimeLine, RiUserStarLine } from "@remixicon/react";

const suggestions = [
  { icon: RiUserStarLine, text: "Trim with Alex" },
  { icon: RiTimeLine, text: "What's the earliest slot today?" },
];

export function ChatEmptyState({
  onSelect,
}: {
  onSelect: (text: string) => void;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-12 text-center">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/25">
        <RiSparkling2Fill className="size-6" />
      </span>

      <h1 className="mt-6 font-heading text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
        What can I book for you?
      </h1>
      <p className="mt-2 max-w-sm text-pretty text-muted-foreground">
        Tell me the service, your barber and when suits you. I&apos;ll find a
        slot.
      </p>

      <div className="mt-8 grid w-full max-w-lg gap-2 sm:grid-cols-2">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion.text}
            type="button"
            onClick={() => onSelect(suggestion.text)}
            className="flex items-center gap-3 rounded-2xl border bg-card px-4 py-3 text-left text-sm transition-colors outline-none hover:bg-muted focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
          >
            <suggestion.icon className="size-4 shrink-0 text-primary" />
            {suggestion.text}
          </button>
        ))}
      </div>
    </div>
  );
}
