export function listingStoragePaths(
  mediaPaths: Array<string | null | undefined>,
  coverImageUrl: string | null,
  supabaseUrl: string | undefined,
): string[] {
  const paths = new Set(mediaPaths.filter((path): path is string => Boolean(path)));
  if (!supabaseUrl || !coverImageUrl) return [...paths];

  const prefix = `${supabaseUrl}/storage/v1/object/public/listing-media/`;
  if (coverImageUrl.startsWith(prefix)) {
    paths.add(decodeURIComponent(coverImageUrl.slice(prefix.length)));
  }
  return [...paths];
}
