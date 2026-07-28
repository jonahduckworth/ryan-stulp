export function internalAnalyticsPath(href: string): string | undefined {
  if (!href.startsWith("/") || href.startsWith("//")) return undefined;
  return href.split(/[?#]/, 1)[0] || "/";
}
