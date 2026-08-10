export function internalAnalyticsPath(href: string): string | undefined {
  if (!href.startsWith("/") || href.startsWith("//")) return undefined;
  return href.split(/[?#]/, 1)[0] || "/";
}

export function linkAnalyticsEvent({
  href,
  explicitEvent,
  isCta,
}: {
  href: string;
  explicitEvent?: string;
  isCta: boolean;
}): string | null {
  if (explicitEvent) return explicitEvent;
  if (href.startsWith("tel:")) return "phone_click";
  if (href.startsWith("mailto:")) return "email_click";
  return isCta ? "cta_click" : null;
}
