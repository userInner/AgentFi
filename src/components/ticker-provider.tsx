"use client";

import { useTicker } from "@/hooks/use-ticker";

export function TickerProvider({ children }: { children: React.ReactNode }) {
  useTicker(2000);
  return <>{children}</>;
}
