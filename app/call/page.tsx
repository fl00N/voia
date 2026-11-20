import type { Metadata } from "next";

import { Call } from "@/components/call/call";

export const metadata: Metadata = {
  title: "Call Voia",
};

export default function CallPage() {
  return <Call />;
}
