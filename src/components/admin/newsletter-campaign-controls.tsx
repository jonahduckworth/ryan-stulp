"use client";

import { useActionState, useEffect, useId, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  runNewsletterCampaignAction,
  type NewsletterCampaignActionState,
} from "@/app/actions/newsletter";

const initialState: NewsletterCampaignActionState = { status: "idle", message: "" };

export function NewsletterCampaignControls({
  campaignId,
  title,
  recipientCount,
  sender,
  replyTo,
  dialog = false,
}: {
  campaignId: string;
  title: string;
  recipientCount: number;
  sender: string;
  replyTo: string;
  dialog?: boolean;
}) {
  const [state, action, pending] = useActionState(
    runNewsletterCampaignAction,
    initialState,
  );
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (dialog && !dialogRef.current?.open) dialogRef.current?.showModal();
  }, [dialog]);

  function closeDialog() {
    dialogRef.current?.close();
  }

  const wasSent = state.status === "success" && state.action === "send";

  const content = (
    <div className="newsletter-send-content">
      <div>
        <p className="eyebrow">Market update published</p>
        <h2 id={titleId}>{dialog ? "Send this update now?" : "Send campaign"}</h2>
        <p>
          <strong>{title}</strong> is ready for {recipientCount.toLocaleString("en-CA")} subscribed contacts.
        </p>
      </div>
      <dl className="newsletter-send-details">
        <div><dt>From</dt><dd>{sender}</dd></div>
        <div><dt>Replies go to</dt><dd>{replyTo}</dd></div>
      </dl>
      <p className="form-note">
        {recipientCount === 0
          ? "No subscribers are synced with Resend yet. Add or sync contacts before sending."
          : "Unsubscribed and suppressed contacts are excluded automatically. Sending cannot be undone."}
      </p>
      {!wasSent ? (
        <form className="newsletter-send-actions" action={action}>
          <input type="hidden" name="campaignId" value={campaignId} />
          <button className="button button-secondary" disabled={pending} name="action" value="test" type="submit">
            {pending ? "Working…" : "Send test to myself"}
          </button>
          <button className="button button-primary" disabled={pending || recipientCount === 0} name="action" value="send" type="submit">
            {pending ? "Working…" : `Send to ${recipientCount.toLocaleString("en-CA")}`}
          </button>
          {dialog ? <button className="button button-quiet" onClick={closeDialog} type="button">Not now</button> : null}
        </form>
      ) : null}
      <p className="form-status" data-status={state.status} aria-live="polite">
        {state.message}
      </p>
      {dialog && state.status === "success" && state.action === "send" ? (
        <button className="button button-secondary" onClick={closeDialog} type="button">Done</button>
      ) : null}
    </div>
  );

  return dialog ? (
    <dialog aria-labelledby={titleId} className="newsletter-send-dialog" onClose={() => router.replace(pathname)} ref={dialogRef}>
      {content}
    </dialog>
  ) : (
    <div className="newsletter-send-panel">{content}</div>
  );
}
