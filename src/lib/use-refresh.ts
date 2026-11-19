"use client";
import { useEffect, useRef } from "react";
export function useAutoRefresh(callback: () => void, enabled = true) {
  const ref = useRef(callback);
  ref.current = callback;
  useEffect(() => {
    if (!enabled) return;
    const refresh = () => {
      if (!document.hidden) ref.current();
    };
    const timer = setInterval(refresh, 15000);
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", refresh);
    let channel: BroadcastChannel | undefined;
    try {
      channel = new BroadcastChannel("exalmar-updates");
      channel.onmessage = refresh;
    } catch {}
    return () => {
      clearInterval(timer);
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", refresh);
      channel?.close();
    };
  }, [enabled]);
}
