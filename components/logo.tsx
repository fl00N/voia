import Link from "next/link";
import { RiScissorsCutFill } from "@remixicon/react";

import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        "flex items-center gap-2 font-heading text-lg font-semibold tracking-tight",
        className,
      )}
    >
      <span className="flex size-8 items-center justify-center rounded-xl bg-primary text-primary-foreground">
        <RiScissorsCutFill className="size-4" />
      </span>
      voia
    </Link>
  );
}
