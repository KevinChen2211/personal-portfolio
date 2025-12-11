"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type CollectionViewerProps = {
  images: string[];
  title: string;
};

export default function CollectionViewer({ images, title }: CollectionViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (images.length === 0) return;
      if (e.key === "ArrowLeft") {
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
      } else if (e.key === "ArrowRight") {
        setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [images.length]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  if (images.length === 0) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#141414", color: "#f5f5f5" }}
      >
        <div className="text-center">
          <p className="text-sm text-gray-300 mb-4">
            No images found for this collection.
          </p>
          <Link
            href="/gallery"
            className="inline-block text-lg transition-all duration-300 hover:underline hover:translate-x-[-4px]"
            style={{ color: "#f5f5f5" }}
          >
            ← Back to Gallery
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 overflow-hidden"
      style={{ backgroundColor: "#141414", color: "#f5f5f5" }}
    >
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-6 sm:px-10 py-6">
        <Link
          href="/gallery"
          className="text-lg transition-all duration-300 hover:underline hover:translate-x-[-4px] backdrop-blur-sm px-4 py-2 rounded-lg"
          style={{
            color: "#f5f5f5",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          ← Back to Gallery
        </Link>
        <div className="text-right">
          <h1 className="text-2xl sm:text-3xl font-bold mb-1">{title}</h1>
          <p className="text-sm text-gray-400">
            {currentIndex + 1} / {images.length}
          </p>
        </div>
      </div>

      {/* Main Image Container */}
      <div className="absolute inset-0 flex items-center justify-center pt-24 pb-20">
        <div className="relative w-full h-full flex items-center justify-center px-4">
          <img
            key={images[currentIndex]}
            src={images[currentIndex]}
            alt={`${title} - Image ${currentIndex + 1}`}
            className="max-w-full max-h-full object-contain transition-opacity duration-500"
            style={{ opacity: 1 }}
          />
        </div>
      </div>

      {/* Navigation Buttons */}
      {images.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-50 w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-110 active:scale-95"
            style={{
              backgroundColor: "rgba(0,0,0,0.6)",
              color: "#f5f5f5",
            }}
            aria-label="Previous image"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6 sm:w-8 sm:h-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-50 w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-110 active:scale-95"
            style={{
              backgroundColor: "rgba(0,0,0,0.6)",
              color: "#f5f5f5",
            }}
            aria-label="Next image"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6 sm:w-8 sm:h-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
              />
            </svg>
          </button>
        </>
      )}

      {/* Thumbnail Indicator */}
      {images.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 flex gap-2">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                idx === currentIndex
                  ? "bg-white"
                  : "bg-gray-500 hover:bg-gray-400"
              }`}
              aria-label={`Go to image ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

