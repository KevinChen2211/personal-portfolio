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
  const imageRefs = useRef<(HTMLImageElement | null)[]>([]);
  const scrollToImageRef = useRef<((index: number) => void) | null>(null);
  const currentScrollPercentageRef = useRef<number>(-50);

  const [expandedImageIndex, setExpandedImageIndex] = useState<number | null>(
    null
  );
  const [expandedImageStyle, setExpandedImageStyle] = useState<{
    top: number;
    left: number;
    width: number;
    height: number;
  } | null>(null);
  const [expandedObjectPosition, setExpandedObjectPosition] =
    useState<string>("100% center");
  const [isClosing, setIsClosing] = useState(false);

  /* -------------------------------
     Disable vertical scrolling
  ------------------------------- */
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  /* -------------------------------
     Horizontal scroll + parallax
  ------------------------------- */
  useEffect(() => {
    const track = trackRef.current!;
    if (!track) return;

    let percentage = -50;
    let targetPercentage = percentage;
    let velocity = 60;
    let lastTime = performance.now();

    const images = track.getElementsByClassName("image");

    const calculateMaxScroll = () => {
      const trackRect = track.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const trackWidth = trackRect.width;
      const lastImage = images[images.length - 1] as HTMLElement;
      const imageWidth = lastImage.getBoundingClientRect().width;
      const distanceToMove = trackWidth - imageWidth / 2 - viewportWidth / 2;
      return -50 - (distanceToMove / trackWidth) * 100;
    };

    let maxScroll = calculateMaxScroll();
    window.addEventListener("resize", () => {
      maxScroll = calculateMaxScroll();
    });

    const clamp = (value: number) => Math.max(Math.min(value, 0), maxScroll);

    const scrollToImage = (imageIndex: number) => {
      if (imageIndex < 0 || imageIndex >= images.length) return;
      const targetImg = images[imageIndex] as HTMLElement;
      const rect = targetImg.getBoundingClientRect();
      const offsetX = window.innerWidth / 2 - (rect.left + rect.width / 2);
      const trackRect = track.getBoundingClientRect();
      const percentageAdjustment = (offsetX / trackRect.width) * 100;
      const newPercentage = clamp(targetPercentage + percentageAdjustment);
      percentage = newPercentage;
      targetPercentage = newPercentage;
      velocity = 0;
      track.style.transform = `translate(${percentage}%, -50%)`;
    };

    scrollToImageRef.current = scrollToImage;

    track.style.willChange = "transform";
    for (const img of images)
      (img as HTMLElement).style.willChange = "object-position";

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

      if (Math.abs(distance) < 0.01 && Math.abs(velocity) < 0.01)
        percentage = targetPercentage;

      // Update ref for external access
      currentScrollPercentageRef.current = percentage;

      track.style.transform = `translate(${percentage}%, -50%)`;

      // Parallax
      const totalImages = images.length;
      for (let i = 0; i < totalImages; i++) {
        const img = images[i] as HTMLElement;
        const relIndex = i / (totalImages - 1) - 0.5;
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
      track.style.willChange = "auto";
      for (const img of images) (img as HTMLElement).style.willChange = "auto";
    };
  }, []);

  /* -------------------------------
     SHRINK EXPANDED IMAGE SEAMLESSLY
  ------------------------------- */
  const shrinkImage = () => {
    if (expandedImageIndex === null) return;
    const imageIndexToScroll = expandedImageIndex;
    const img = imageRefs.current[expandedImageIndex];
    if (!img) return;

    // First, scroll to center the clicked image
    if (scrollToImageRef.current) {
      scrollToImageRef.current(imageIndexToScroll);
    }

    // Wait for scroll animation to complete and parallax to update
    // Use a longer delay to ensure the transform has been fully applied
    setTimeout(() => {
      // Get the image position - read it twice to ensure it's stable
      const updatedImg = imageRefs.current[imageIndexToScroll];
      if (!updatedImg) return;

      // Force a reflow to ensure layout is updated
      updatedImg.offsetHeight;

      const rect = updatedImg.getBoundingClientRect();
      const currentObjectPosition = getComputedStyle(updatedImg).objectPosition;

      // Get the exact center position of the image element
      const targetRect = {
        top: rect.top + rect.height / 2,
        left: rect.left + rect.width / 2,
        width: rect.width,
        height: rect.height,
      };

      setIsClosing(true);
      setExpandedObjectPosition(currentObjectPosition);
      setExpandedImageStyle(targetRect);

      // Remove expanded image after animation
      setTimeout(() => {
        setExpandedImageIndex(null);
        setExpandedImageStyle(null);
        setIsClosing(false);
      }, 1000);
    }, 300); // Longer delay to ensure scroll transform has been applied
  };

  /* -------------------------------
     Close on Escape
  ------------------------------- */
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && expandedImageIndex !== null) shrinkImage();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [expandedImageIndex]);

  return (
    <div
      className="min-h-screen px-6 sm:px-10 py-16 relative overflow-hidden"
      style={{ backgroundColor: palette.background, color: palette.text }}
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
        ref={trackRef}
        className="absolute top-3/5 left-1/2 flex gap-[4vmin] select-none"
        style={{ transform: "translate(-50%, -50%)" }}
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <img
            key={i}
            ref={(el) => (imageRefs.current[i] = el)}
            src="/gallery-images/test.jpg"
            className="image cursor-pointer transition-all duration-500 ease-out hover:scale-105"
            draggable={false}
            onClick={() => {
              const img = imageRefs.current[i];
              if (!img) return;
              const rect = img.getBoundingClientRect();
              setExpandedImageIndex(i);
              const currentObjectPosition =
                getComputedStyle(img).objectPosition;

              setExpandedImageStyle({
                top: rect.top + rect.height / 2,
                left: rect.left + rect.width / 2,
                width: rect.width,
                height: rect.height,
              });
              setExpandedObjectPosition(currentObjectPosition);
              requestAnimationFrame(() => {
                setExpandedImageStyle({
                  top: window.innerHeight / 2,
                  left: window.innerWidth / 2,
                  width: window.innerWidth,
                  height: window.innerHeight,
                });
              });
            }}
            style={{
              width: "40vmin",
              height: "56vmin",
              aspectRatio: "40 / 56",
              objectFit: "cover",
              objectPosition: "100% center",
              flexShrink: 0,
            }}
          />
        ))}
      </div>

      {/* EXPANDED IMAGE */}
      {expandedImageIndex !== null && expandedImageStyle && (
        <>
          <div
            className="fixed inset-0 z-40 transition-opacity duration-1000"
            style={{
              backgroundColor: palette.background,
              opacity: isClosing ? 0 : 1,
            }}
          />
          <button
            onClick={shrinkImage}
            className="fixed top-6 left-6 text-xl font-semibold transition-all duration-300 hover:underline hover:translate-x-[-4px] px-4 py-2 rounded-lg backdrop-blur-sm"
            style={{
              color: "white",
              zIndex: 60,
              backgroundColor: "rgba(0,0,0,0.5)",
              textShadow: "0 2px 4px rgba(0,0,0,0.5)",
            }}
          >
            ← Back
          </button>
          <img
            src="/gallery-images/test.jpg"
            draggable={false}
            className="transition-all duration-1000 ease-out"
            style={{
              width: `${expandedImageStyle.width}px`,
              height: `${expandedImageStyle.height}px`,
              aspectRatio: "40 / 56",
              objectFit: "cover",
              objectPosition: expandedObjectPosition,
              position: "fixed",
              top: `${expandedImageStyle.top}px`,
              left: `${expandedImageStyle.left}px`,
              transform: "translate(-50%, -50%)",
              zIndex: 50,
            }}
          />
        </>
      )}
    </div>
  );
}
