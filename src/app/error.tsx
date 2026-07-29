"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ErrorPage({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error("Application error", {
      digest: error.digest ?? null,
      name: error.name,
    });
  }, [error]);

  return (
    <main id="main-content" className="section" role="alert">
      <div className="narrow stack">
        <span className="eyebrow">Something went wrong</span>
        <h1 className="display">This page could not be loaded.</h1>
        <p className="lede">
          Your information has not been submitted. Try loading the page again,
          or return home and contact Ryan from there.
        </p>
        <div className="button-row">
          <button
            className="button button-primary"
            type="button"
            onClick={unstable_retry}
          >
            Try again
          </button>
          <Link className="button button-secondary" href="/">
            Go home
          </Link>
        </div>
      </div>
    </main>
  );
}
