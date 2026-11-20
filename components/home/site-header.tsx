import Link from "next/link";

import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Logo />

        <div className="flex items-center gap-6">
          <nav className="hidden text-sm text-muted-foreground sm:block">
            <Link
              href="#how-it-works"
              className="transition-colors hover:text-foreground"
            >
              How it works
            </Link>
          </nav>

          <Button size="sm" render={<Link href="/chat" />} nativeButton={false}>
            Book now
          </Button>
        </div>
      </div>
    </header>
  );
}
