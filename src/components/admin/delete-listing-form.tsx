"use client";

import { deleteListing } from "@/app/actions/admin";

export function DeleteListingForm({
  id,
  address,
}: {
  id: string;
  address: string;
}) {
  return (
    <form
      action={deleteListing}
      onSubmit={(event) => {
        const confirmed = window.confirm(
          `Permanently delete ${address}? This cannot be undone.`,
        );
        if (!confirmed) event.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button className="button button-danger" type="submit">
        Permanently delete {address}
      </button>
    </form>
  );
}
