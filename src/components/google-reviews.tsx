import { Star } from "lucide-react";
import {
  FEATURED_TESTIMONIALS,
  GOOGLE_REVIEW_PROFILE_URL,
  GOOGLE_REVIEW_SUMMARY,
} from "@/lib/testimonials";

export function GoogleReviews() {
  return (
    <section
      className="section"
      aria-labelledby="google-reviews-title"
      data-analytics-location="home_google_reviews"
    >
      <div className="container stack">
        <div className="testimonial-heading">
          <div className="stack">
            <div
              className="google-review-source"
              aria-label={`${GOOGLE_REVIEW_SUMMARY.rating} out of 5 from ${GOOGLE_REVIEW_SUMMARY.count} Google reviews`}
            >
              <span className="google-review-stars" aria-hidden="true">
                {Array.from({ length: 5 }, (_, index) => (
                  <Star key={index} size={17} strokeWidth={2.2} />
                ))}
              </span>
              <span className="google-review-source-copy">
                <strong>{GOOGLE_REVIEW_SUMMARY.rating} on Google</strong>
                <span>{GOOGLE_REVIEW_SUMMARY.count} verified reviews</span>
              </span>
            </div>
            <span className="eyebrow">Client experiences</span>
            <h2 id="google-reviews-title" className="section-title">
              Trusted by Calgary-area clients.
            </h2>
            <p className="lede">
              Real experiences from people Ryan has helped buy, sell, and make
              sense of the market.
            </p>
          </div>
          <a
            className="button button-secondary"
            href={GOOGLE_REVIEW_PROFILE_URL}
            target="_blank"
            rel="noreferrer"
            data-analytics-event="google_reviews_click"
          >
            Read all Google reviews
          </a>
        </div>
        <div className="testimonial-grid">
          {FEATURED_TESTIMONIALS.map((testimonial) => (
            <figure className="testimonial-card" key={testimonial.author}>
              <blockquote>
                <p>&ldquo;{testimonial.quote}&rdquo;</p>
              </blockquote>
              <figcaption>
                <strong>{testimonial.author}</strong>
                <span>Google review</span>
              </figcaption>
            </figure>
          ))}
        </div>
        <p className="review-summary">
          Rating and review count verified on Google{" "}
          {GOOGLE_REVIEW_SUMMARY.verifiedOn}.
        </p>
      </div>
    </section>
  );
}
