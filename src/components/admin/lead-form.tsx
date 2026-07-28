"use client";

import { useActionState } from "react";
import {
  updateLead,
  type AdminFormState,
} from "@/app/actions/admin";
import type { Lead } from "@/lib/types";

const initialAdminState: AdminFormState = {
  status: "idle",
  message: "",
};

export function AdminLeadForm({ lead }: { lead: Lead }) {
  const [state, action, pending] = useActionState(
    updateLead,
    initialAdminState,
  );

  return (
    <form className="admin-form" action={action}>
      <input type="hidden" name="id" value={lead.id} />
      <div className="field">
        <label htmlFor="status">Lead status</label>
        <select id="status" name="status" defaultValue={lead.status}>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="qualified">Qualified</option>
          <option value="won">Won</option>
          <option value="lost">Lost</option>
          <option value="archived">Archived</option>
        </select>
      </div>
      <div className="field field-full">
        <label htmlFor="notes">Private notes</label>
        <textarea
          id="notes"
          name="notes"
          defaultValue={lead.notes ?? ""}
          placeholder="Add follow-up notes, timing, and next steps."
        />
      </div>
      <p className="form-status field-full" data-status={state.status}>
        {state.message}
      </p>
      <div className="admin-actions">
        <span />
        <button className="button button-primary" disabled={pending}>
          {pending ? "Saving…" : "Save lead"}
        </button>
      </div>
    </form>
  );
}
