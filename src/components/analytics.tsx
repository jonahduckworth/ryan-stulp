"use client";

import Script from "next/script";
import { useEffect } from "react";
import { internalAnalyticsPath } from "@/lib/analytics";

export function Analytics() {
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  useEffect(() => {
    if (!measurementId) return;
    const trackClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const link = target.closest("a");
      if (!link) return;
      const explicitEvent = link.dataset.analyticsEvent;
      const href = link.getAttribute("href") || "";
      const eventName =
        explicitEvent ||
        (href.startsWith("tel:")
          ? "phone_click"
          : href.startsWith("mailto:")
            ? "email_click"
            : null);
      if (!eventName) return;
      window.gtag?.("event", eventName, {
        link_path: internalAnalyticsPath(href),
      });
    };
    document.addEventListener("click", trackClick);
    return () => document.removeEventListener("click", trackClick);
  }, [measurementId]);

  if (!measurementId) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="ga4" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${measurementId}',{anonymize_ip:true});`}
      </Script>
    </>
  );
}
