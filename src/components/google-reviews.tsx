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
            <span className="eyebrow">Client experiences</span>
            <h2 id="google-reviews-title" className="section-title">
              Trusted when the decision matters.
            </h2>
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
          {GOOGLE_REVIEW_SUMMARY.rating} out of 5 from{" "}
          {GOOGLE_REVIEW_SUMMARY.count} Google reviews, verified{" "}
          {GOOGLE_REVIEW_SUMMARY.verifiedOn}.
        </p>
      </div>
    </section>
  );
}
