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
    window.addEventListener("storage", refresh);
    window.addEventListener("exalmar-updates", refresh);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      clearInterval(timer);
      window.removeEventListener("focus", refresh);
      window.removeEventListener("storage", refresh);
      window.removeEventListener("exalmar-updates", refresh);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, [enabled]);
}
