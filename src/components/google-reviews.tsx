"use client";

import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Star,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  FEATURED_TESTIMONIALS,
  GOOGLE_REVIEW_PROFILE_URL,
  GOOGLE_REVIEW_SUMMARY,
} from "@/lib/testimonials";

const REVIEW_INTERVAL_MS = 6500;

export function GoogleReviews() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<"forward" | "backward">(
    "forward",
  );
  const [isPaused, setIsPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotionPreference = () =>
      setPrefersReducedMotion(mediaQuery.matches);

    updateMotionPreference();
    mediaQuery.addEventListener("change", updateMotionPreference);

    return () =>
      mediaQuery.removeEventListener("change", updateMotionPreference);
  }, []);

  const isAutoPlaying =
    !prefersReducedMotion && !isPaused && !isHovered;

  useEffect(() => {
    if (!isAutoPlaying) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setDirection("forward");
      setCurrentIndex(
        (previousIndex) =>
          (previousIndex + 1) % FEATURED_TESTIMONIALS.length,
      );
    }, REVIEW_INTERVAL_MS);

    return () => window.clearTimeout(timeout);
  }, [currentIndex, isAutoPlaying]);

  const selectReview = (
    index: number,
    nextDirection: "forward" | "backward",
  ) => {
    setDirection(nextDirection);
    setCurrentIndex(index);
    setIsPaused(true);
  };

  const showPreviousReview = () => {
    const previousIndex =
      currentIndex === 0
        ? FEATURED_TESTIMONIALS.length - 1
        : currentIndex - 1;
    selectReview(previousIndex, "backward");
  };

  const showNextReview = () => {
    selectReview(
      (currentIndex + 1) % FEATURED_TESTIMONIALS.length,
      "forward",
    );
  };

  const testimonial = FEATURED_TESTIMONIALS[currentIndex];

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
                <span>{GOOGLE_REVIEW_SUMMARY.count} Google reviews</span>
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

        <div
          className="testimonial-carousel"
          role="region"
          aria-roledescription="carousel"
          aria-label="Google client reviews"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onFocusCapture={() => setIsPaused(true)}
        >
          <div
            className="testimonial-carousel-viewport"
            aria-live={isAutoPlaying ? "off" : "polite"}
            aria-atomic="true"
          >
            <figure
              className={`testimonial-slide testimonial-slide-${direction}`}
              key={testimonial.author}
              role="group"
              aria-roledescription="slide"
              aria-label={`Review ${currentIndex + 1} of ${FEATURED_TESTIMONIALS.length}`}
            >
              <blockquote>
                <p>&ldquo;{testimonial.quote}&rdquo;</p>
              </blockquote>
              <figcaption>
                <span className="testimonial-slide-count" aria-hidden="true">
                  {String(currentIndex + 1).padStart(2, "0")} /{" "}
                  {String(FEATURED_TESTIMONIALS.length).padStart(2, "0")}
                </span>
                <strong>{testimonial.author}</strong>
                <span>Google review</span>
              </figcaption>
            </figure>
          </div>

          <div className="testimonial-carousel-controls">
            <button
              className="testimonial-carousel-arrow"
              type="button"
              onClick={showPreviousReview}
              aria-label="Show previous review"
            >
              <ChevronLeft aria-hidden="true" />
            </button>

            <div className="testimonial-carousel-pagination">
              {FEATURED_TESTIMONIALS.map((review, index) => (
                <button
                  className={`testimonial-carousel-dot${
                    currentIndex === index ? " is-active" : ""
                  }`}
                  type="button"
                  key={review.author}
                  onClick={() =>
                    selectReview(
                      index,
                      index < currentIndex ? "backward" : "forward",
                    )
                  }
                  aria-label={`Show review ${index + 1} of ${FEATURED_TESTIMONIALS.length}`}
                  aria-current={currentIndex === index ? "true" : undefined}
                >
                  <span aria-hidden="true" />
                </button>
              ))}

              {!prefersReducedMotion && (
                <button
                  className="testimonial-carousel-pause"
                  type="button"
                  onClick={() => setIsPaused((paused) => !paused)}
                  aria-label={
                    isPaused
                      ? "Resume automatic review rotation"
                      : "Pause automatic review rotation"
                  }
                >
                  {isPaused ? (
                    <Play aria-hidden="true" />
                  ) : (
                    <Pause aria-hidden="true" />
                  )}
                </button>
              )}
            </div>

            <button
              className="testimonial-carousel-arrow"
              type="button"
              onClick={showNextReview}
              aria-label="Show next review"
            >
              <ChevronRight aria-hidden="true" />
            </button>
          </div>
        </div>

        <p className="review-summary">
          Rating and review count verified on Google{" "}
          {GOOGLE_REVIEW_SUMMARY.verifiedOn}.
        </p>
      </div>
    </section>
  );
}
