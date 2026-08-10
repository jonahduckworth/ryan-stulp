"use client";

import { deleteMarketUpdate } from "@/app/actions/admin";

export function DeleteMarketUpdateForm({
  id,
  title,
}: {
  id: string;
  title: string;
}) {
  return (
    <form
      action={deleteMarketUpdate}
      onSubmit={(event) => {
        if (!window.confirm(`Permanently delete “${title}”?`)) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button className="button button-danger" type="submit">
        Delete market update
      </button>
    </form>
  );
}
