"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export type GalleryImage = {
  id: string;
  url: string;
  alt: string;
  caption: string | null;
};

export function ListingGallery({
  images,
  listingTitle,
}: {
  images: GalleryImage[];
  listingTitle: string;
}) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const visibleImages = images.slice(0, 5);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (selectedIndex !== null && !dialog.open) {
      dialog.showModal();
    } else if (selectedIndex === null && dialog.open) {
      dialog.close();
    }
  }, [selectedIndex]);

  useEffect(() => {
    if (selectedIndex === null) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        setSelectedIndex((current) =>
          current === null ? null : (current - 1 + images.length) % images.length,
        );
      }
      if (event.key === "ArrowRight") {
        setSelectedIndex((current) =>
          current === null ? null : (current + 1) % images.length,
        );
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [images.length, selectedIndex]);

  if (!images.length) return null;

  const selectedImage =
    selectedIndex === null ? null : images[selectedIndex];

  return (
    <section
      className="container section-tight listing-gallery-shell"
      aria-label={`${listingTitle} photo gallery`}
    >
      <div
        className="listing-gallery-mosaic"
        data-visible-count={visibleImages.length}
      >
        {visibleImages.map((image, index) => (
          <button
            className={`listing-gallery-tile ${
              index === 0 ? "listing-gallery-primary" : ""
            }`}
            type="button"
            key={image.id}
            onClick={() => setSelectedIndex(index)}
            aria-label={`Open photo ${index + 1} of ${images.length}: ${image.alt}`}
          >
            <Image
              src={image.url}
              alt={image.alt}
              fill
              priority={index === 0}
              sizes={
                index === 0
                  ? "(max-width: 900px) 100vw, 66vw"
                  : "(max-width: 620px) 45vw, 22vw"
              }
            />
            {index === visibleImages.length - 1 && images.length > 5 ? (
              <span className="listing-gallery-count">
                View all {images.length} photos
              </span>
            ) : null}
          </button>
        ))}
      </div>

      {images.length > 1 ? (
        <div
          className="listing-gallery-mobile-strip"
          aria-label="Gallery thumbnails"
        >
          {images.map((image, index) => (
            <button
              type="button"
              key={image.id}
              onClick={() => setSelectedIndex(index)}
              aria-label={`Open photo ${index + 1} of ${images.length}`}
            >
              <Image src={image.url} alt="" fill sizes="112px" />
            </button>
          ))}
        </div>
      ) : null}

      <dialog
        className="listing-gallery-dialog"
        ref={dialogRef}
        aria-label={`${listingTitle} full-screen photo viewer`}
        onClose={() => setSelectedIndex(null)}
        onCancel={() => setSelectedIndex(null)}
        onClick={(event) => {
          if (event.target === event.currentTarget) setSelectedIndex(null);
        }}
      >
        {selectedImage && selectedIndex !== null ? (
          <div className="listing-gallery-viewer">
            <div className="listing-gallery-viewer-header">
              <span>
                Photo {selectedIndex + 1} of {images.length}
              </span>
              <button
                className="gallery-icon-button"
                type="button"
                onClick={() => setSelectedIndex(null)}
                aria-label="Close photo viewer"
              >
                Close
              </button>
            </div>
            <div className="listing-gallery-viewer-image">
              <Image
                src={selectedImage.url}
                alt={selectedImage.alt}
                fill
                priority
                sizes="100vw"
              />
            </div>
            <div
              className={`listing-gallery-viewer-footer ${
                images.length === 1 ? "is-single" : ""
              }`}
            >
              {images.length > 1 ? (
                <button
                  className="gallery-icon-button"
                  type="button"
                  onClick={() =>
                    setSelectedIndex(
                      (selectedIndex - 1 + images.length) % images.length,
                    )
                  }
                  aria-label="Show previous photo"
                >
                  Previous
                </button>
              ) : null}
              <p>{selectedImage.caption || selectedImage.alt}</p>
              {images.length > 1 ? (
                <button
                  className="gallery-icon-button"
                  type="button"
                  onClick={() =>
                    setSelectedIndex((selectedIndex + 1) % images.length)
                  }
                  aria-label="Show next photo"
                >
                  Next
                </button>
              ) : null}
            </div>
          </div>
        ) : null}
      </dialog>
    </section>
  );
}
