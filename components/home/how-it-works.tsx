import {
  RiCalendarScheduleLine,
  RiChatVoiceAiLine,
  RiScissorsCutLine,
} from "@remixicon/react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const steps = [
  {
    icon: RiChatVoiceAiLine,
    title: "Chat or call",
    description:
      "Tell Voia what you want: a fade, a beard trim, your usual barber. Type it or just say it.",
  },
  {
    icon: RiCalendarScheduleLine,
    title: "Pick a slot",
    description:
      "Voia checks the shop's live calendar and only offers times that actually work.",
  },
  {
    icon: RiScissorsCutLine,
    title: "Show up fresh",
    description:
      "You get an instant confirmation and a reminder before your appointment. That's it.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="scroll-mt-16 border-t bg-muted/40 py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium text-primary">How it works</p>
          <h2 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            From &ldquo;I need a haircut&rdquo; to booked in three steps
          </h2>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-3">
          {steps.map((step, i) => (
            <Card key={step.title}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <span className="flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <step.icon className="size-5" />
                  </span>
                  <span className="font-mono text-sm text-muted-foreground">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-1.5">
                <CardTitle>{step.title}</CardTitle>
                <CardDescription className="text-pretty">
                  {step.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
