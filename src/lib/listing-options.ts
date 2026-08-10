export const AREA_KEYS = [
  "inner-city",
  "northwest",
  "northeast",
  "southwest",
  "southeast",
  "surrounding-area",
] as const;

export type AreaKey = (typeof AREA_KEYS)[number];

export const AREA_OPTIONS: ReadonlyArray<{ value: AreaKey; label: string }> = [
  { value: "inner-city", label: "Inner city" },
  { value: "northwest", label: "Northwest Calgary" },
  { value: "northeast", label: "Northeast Calgary" },
  { value: "southwest", label: "Southwest Calgary" },
  { value: "southeast", label: "Southeast Calgary" },
  { value: "surrounding-area", label: "Rural and surrounding area" },
];

export const AREA_LABELS = Object.fromEntries(
  AREA_OPTIONS.map((area) => [area.value, area.label]),
) as Record<AreaKey, string>;

export const PUBLIC_LISTING_STATUSES = ["active", "pending", "sold"] as const;

export function isPublicListingStatus(status: string) {
  return PUBLIC_LISTING_STATUSES.includes(
    status as (typeof PUBLIC_LISTING_STATUSES)[number],
  );
}
