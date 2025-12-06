"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useTheme } from "../components/ThemeProvider";
import { getActivePalette } from "../color-palettes";
import ThemeToggle from "../components/ThemeToggle";

export default function GalleryPage() {
  const { theme } = useTheme();
  const palette = getActivePalette(theme);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [expandedImageIndex, setExpandedImageIndex] = useState<number | null>(
    null
  );
  const imageRefs = useRef<(HTMLImageElement | null)[]>([]);
  const [expandedImageStyle, setExpandedImageStyle] = useState<{
    top: number;
    left: number;
    width: number;
    height: number;
  } | null>(null);

  /* ---------------------------------------------------------
     Disable vertical page scrolling
  --------------------------------------------------------- */
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  /* ---------------------------------------------------------
     Handle escape key for expanded image
  --------------------------------------------------------- */
  useEffect(() => {
    if (expandedImageIndex === null) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setExpandedImageIndex(null);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [expandedImageIndex]);

  /* ---------------------------------------------------------
     Horizontal scroll-wheel logic with individual parallax
  --------------------------------------------------------- */
  useEffect(() => {
    const track = trackRef.current!;
    if (!track) return;

    let percentage = -50; // starting center
    let targetPercentage = percentage;
    let velocity = 60;
    let lastTime = performance.now();

    // Get images reference
    const images = track.getElementsByClassName("image");

    // Calculate maximum scroll position (when last image is centered in viewport)
    const calculateMaxScroll = () => {
      const trackRect = track.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const trackWidth = trackRect.width;
      // Get the last image to find its width
      const lastImage = images[images.length - 1] as HTMLElement;
      const imageWidth = lastImage.getBoundingClientRect().width;

      // Track starts at left: 50% with translate(-50%, -50%), so its left edge is at viewport left (0)
      // The last image's center is currently at: trackWidth - (imageWidth / 2) from viewport left
      // We want the last image's center to be at: viewportWidth / 2 (center of viewport)
      // Need to move left by: (trackWidth - imageWidth/2) - (viewportWidth / 2)
      // As percentage of track width: -50 - ((trackWidth - imageWidth/2 - viewportWidth/2) / trackWidth) * 100
      const distanceToMove = trackWidth - imageWidth / 2 - viewportWidth / 2;
      const maxScroll = -50 - (distanceToMove / trackWidth) * 100;
      return maxScroll;
    };

    let maxScroll = calculateMaxScroll();

    // Update max scroll on resize
    const handleResize = () => {
      maxScroll = calculateMaxScroll();
    };
    window.addEventListener("resize", handleResize);

    const clamp = (value: number) => Math.max(Math.min(value, 0), maxScroll);

    // Optimize for transform animations
    track.style.willChange = "transform";
    for (const img of images) {
      (img as HTMLElement).style.willChange = "object-position";
    }

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY * -0.02;
      targetPercentage = clamp(targetPercentage + delta);
      velocity = delta * 0.1;
    };

    window.addEventListener("wheel", handleWheel, { passive: false });

    const animate = (currentTime: number) => {
      const deltaTime = Math.min((currentTime - lastTime) / 16.67, 2);
      lastTime = currentTime;

      if (Math.abs(velocity) > 0.01) {
        targetPercentage = clamp(targetPercentage + velocity);
        velocity *= 0.82;
      }

      const distance = targetPercentage - percentage;
      const lerpFactor = Math.abs(distance) > 1 ? 0.015 : 0.01;
      percentage += distance * lerpFactor;

      if (Math.abs(distance) < 0.01 && Math.abs(velocity) < 0.01) {
        percentage = targetPercentage;
      }

      // Move the track
      track.style.transform = `translate(${percentage}%, -50%)`;

      // Apply individual parallax to each image
      const totalImages = images.length;
      for (let i = 0; i < totalImages; i++) {
        const img = images[i] as HTMLElement;
        // Calculate relative position (-0.5 to 0.5) from center
        const relIndex = i / (totalImages - 1) - 0.5;
        // Apply parallax factor (adjust multiplier for stronger/weaker effect)
        const parallaxOffset = relIndex * 30;
        img.style.objectPosition = `${
          100 + percentage + parallaxOffset
        }% center`;
      }

      requestAnimationFrame(animate);
    };

    animate(performance.now());

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("resize", handleResize);
      track.style.willChange = "auto";
      for (const img of images) {
        (img as HTMLElement).style.willChange = "auto";
      }
    };
  }, []);

  return (
    <div
      className="min-h-screen px-6 sm:px-10 py-16 relative overflow-hidden"
      style={{
        backgroundColor: palette.background,
        color: palette.text,
      }}
    >
      <ThemeToggle />

      <div className="max-w-6xl mx-auto">
        <Link
          href="/"
          className="inline-block mb-8 text-lg transition-all duration-300 hover:underline hover:translate-x-[-4px]"
          style={{ color: palette.primary }}
        >
          ← Back to Home
        </Link>

        <h1 className="text-5xl sm:text-6xl font-bold mb-4">Gallery</h1>

        <div
          className="w-24 h-1 mb-12 rounded-full"
          style={{ backgroundColor: palette.primary }}
        />
      </div>

      {/* IMAGE TRACK */}
      <div
        id="image-track"
        ref={trackRef}
        className="absolute top-3/5 left-1/2 flex gap-[4vmin] select-none"
        style={{
          transform: "translate(-50%, -50%)",
        }}
      >
        {Array.from({ length: 6 }).map((_, i) => {
          const isExpanded = expandedImageIndex === i;
          return (
            <img
              key={i}
              ref={(el) => {
                imageRefs.current[i] = el;
              }}
              src="/gallery-images/test.jpg"
              className="image cursor-pointer transition-all duration-500 ease-out hover:scale-105"
              draggable={false}
              onClick={(e) => {
                e.stopPropagation();
                if (isExpanded) {
                  setExpandedImageIndex(null);
                  // Clear style after a brief delay to allow transition
                  setTimeout(() => {
                    setExpandedImageStyle(null);
                  }, 500);
                } else {
                  const img = imageRefs.current[i];
                  if (img) {
                    const rect = img.getBoundingClientRect();
                    // Get current center position and size of image
                    const imageCenterX = rect.left + rect.width / 2;
                    const imageCenterY = rect.top + rect.height / 2;
                    const initialWidth = rect.width;
                    const initialHeight = rect.height;

                    // Set initial position and size
                    setExpandedImageStyle({
                      top: imageCenterY,
                      left: imageCenterX,
                      width: initialWidth,
                      height: initialHeight,
                    });
                    setExpandedImageIndex(i);

                    // After DOM update, animate to viewport center and fullscreen size
                    requestAnimationFrame(() => {
                      setExpandedImageStyle({
                        top: window.innerHeight / 2,
                        left: window.innerWidth / 2,
                        width: window.innerWidth * 0.9,
                        height: window.innerHeight * 0.9,
                      });
                    });
                  }
                }
              }}
              style={{
                width: "40vmin",
                height: "56vmin",
                aspectRatio: "40 / 56",
                objectFit: "cover",
                objectPosition: "100% center",
                flexShrink: 0,
                opacity: isExpanded ? 0 : 1,
                visibility: isExpanded ? "hidden" : "visible",
              }}
            />
          );
        })}
      </div>

      {/* EXPANDED IMAGE - Rendered outside track to avoid transform containment */}
      {expandedImageIndex !== null && (
        <>
          {/* BACKGROUND OVERLAY - Hides everything except the expanded image */}
          <div
            className="fixed inset-0 z-40 transition-opacity duration-500"
            style={{
              backgroundColor: palette.background,
            }}
          />
          <img
            src="/gallery-images/test.jpg"
            className="cursor-pointer transition-all duration-1000 ease-out"
            draggable={false}
            onClick={() => {
              setExpandedImageIndex(null);
              setTimeout(() => {
                setExpandedImageStyle(null);
              }, 1000);
            }}
            style={{
              width: expandedImageStyle
                ? `${expandedImageStyle.width}px`
                : "90vw",
              height: expandedImageStyle
                ? `${expandedImageStyle.height}px`
                : "90vh",
              aspectRatio: "40 / 56",
              objectFit: "cover",
              objectPosition: "100% center",
              position: "fixed",
              top: expandedImageStyle ? `${expandedImageStyle.top}px` : "50%",
              left: expandedImageStyle ? `${expandedImageStyle.left}px` : "50%",
              transform: "translate(-50%, -50%)",
              transformOrigin: "center center",
              zIndex: 50,
            }}
          />
        </>
      )}
    </div>
  );
}
