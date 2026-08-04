import { GOOGLE_REVIEW_PROFILE_URL } from "@/lib/testimonials";

export function InlineTestimonial({
  quote,
  author,
}: {
  quote: string;
  author: string;
}) {
  return (
    <aside className="inline-testimonial" aria-label={`Google review from ${author}`}>
      <blockquote>
        <p>&ldquo;{quote}&rdquo;</p>
      </blockquote>
      <div>
        <strong>{author}</strong>
        <a
          href={GOOGLE_REVIEW_PROFILE_URL}
          target="_blank"
          rel="noreferrer"
          data-analytics-event="google_reviews_click"
        >
          Verified Google review
        </a>
      </div>
    </aside>
  );
}
