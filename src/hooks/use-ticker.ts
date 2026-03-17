"use client";

import { useEffect } from "react";
import { usePlatformStore } from "@/store/use-platform-store";

export function useTicker(intervalMs = 2000) {
  const tickBotData = usePlatformStore((s) => s.tickBotData);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null;

    const startTicker = () => {
      if (!timer) {
        timer = setInterval(tickBotData, intervalMs);
      }
    };

    const stopTicker = () => {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    };

    const handleVisibilityOrConnectivity = () => {
      if (document.visibilityState === "visible" && navigator.onLine) {
        startTicker();
      } else {
        stopTicker();
      }
    };

    handleVisibilityOrConnectivity();

    document.addEventListener("visibilitychange", handleVisibilityOrConnectivity);
    window.addEventListener("online", handleVisibilityOrConnectivity);
    window.addEventListener("offline", handleVisibilityOrConnectivity);

    return () => {
      stopTicker();
      document.removeEventListener("visibilitychange", handleVisibilityOrConnectivity);
      window.removeEventListener("online", handleVisibilityOrConnectivity);
      window.removeEventListener("offline", handleVisibilityOrConnectivity);
    };
  }, [tickBotData, intervalMs]);
}
