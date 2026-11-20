import Link from "next/link";
import {
  RiChatAiLine,
  RiCheckLine,
  RiPhoneLine,
  RiSparkling2Line,
} from "@remixicon/react";

import { ChatPreview } from "@/components/home/chat-preview";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const perks = ["No app to download", "Open 24/7", "Confirmed by SMS"];

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-radial-[at_50%_0%] from-primary/15 via-transparent to-transparent" />

      <div className="mx-auto grid max-w-6xl items-center gap-16 px-4 pt-16 pb-24 sm:px-6 lg:grid-cols-2 lg:pt-24">
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <Badge variant="outline" className="h-7 bg-background px-3">
            <RiSparkling2Line
              data-icon="inline-start"
              className="text-primary"
            />
            AI receptionist for your barbershop
          </Badge>

          <h1 className="mt-6 font-heading text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
            Book your next cut{" "}
            <span className="text-primary">just by asking.</span>
          </h1>

          <p className="mt-6 max-w-lg text-lg text-pretty text-muted-foreground">
            Chat or call Voia, our AI assistant. It finds a time with your
            favourite barber and books it in under a minute, day or night.
          </p>

          <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Button
              size="lg"
              className="h-11 px-5"
              render={<Link href="/chat" />}
              nativeButton={false}
            >
              <RiChatAiLine data-icon="inline-start" />
              Chat with AI
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-11 px-5"
              render={<Link href="/call" />}
              nativeButton={false}
            >
              <RiPhoneLine data-icon="inline-start" />
              Call AI
            </Button>
          </div>

          <ul className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground lg:justify-start">
            {perks.map((perk) => (
              <li key={perk} className="flex items-center gap-1.5">
                <RiCheckLine className="size-4 text-primary" />
                {perk}
              </li>
            ))}
          </ul>
        </div>

        <ChatPreview />
      </div>
    </section>
  );
}
