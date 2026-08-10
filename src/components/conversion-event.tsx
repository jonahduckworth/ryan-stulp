"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function ConversionEvent({
  name,
  parameters = {},
}: {
  name: string;
  parameters?: Record<string, string | number | boolean>;
}) {
  useEffect(() => {
    window.gtag?.("event", name, parameters);
  }, [name, parameters]);

  return null;
}
