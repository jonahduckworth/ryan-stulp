"use client";

import Script from "next/script";
import { useEffect } from "react";
import {
  internalAnalyticsPath,
  linkAnalyticsEvent,
} from "@/lib/analytics";

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
      const eventName = linkAnalyticsEvent({
        href,
        explicitEvent,
        isCta: link.classList.contains("button"),
      });
      if (!eventName) return;
      const analyticsLocation =
        link.dataset.analyticsLocation ||
        link.closest<HTMLElement>("[data-analytics-location]")?.dataset
          .analyticsLocation;
      const linkText = (link.dataset.analyticsLabel || link.textContent || "")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 80);
      window.gtag?.("event", eventName, {
        link_path: internalAnalyticsPath(href),
        link_text: linkText || undefined,
        link_location: analyticsLocation,
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
