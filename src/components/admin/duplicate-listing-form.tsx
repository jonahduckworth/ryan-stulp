import { duplicateListing } from "@/app/actions/admin";

export function DuplicateListingForm({
  id,
  title,
}: {
  id: string;
  title: string;
}) {
  return (
    <form action={duplicateListing}>
      <input type="hidden" name="id" value={id} />
      <button
        className="button button-secondary"
        type="submit"
        aria-label={`Duplicate ${title} as a draft`}
      >
        Duplicate
      </button>
    </form>
  );
}
