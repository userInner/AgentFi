"use client";

import { useEffect } from "react";
import { usePlatformStore } from "@/store/use-platform-store";

export function useTicker(intervalMs = 2000) {
  const tickBotData = usePlatformStore((s) => s.tickBotData);

  useEffect(() => {
    const id = setInterval(tickBotData, intervalMs);
    return () => clearInterval(id);
  }, [tickBotData, intervalMs]);
}
