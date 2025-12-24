"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { galleryImages, parseCollection } from "./data";
import Navbar from "../components/Navbar";

export default function GalleryPage() {
  const bgColor = "#141414";
  const textColor = "#FAF2E6";

  const trackRef = useRef<HTMLDivElement | null>(null);
  const imageRefs = useRef<(HTMLImageElement | null)[]>([]);
  const scrollToImageRef = useRef<((index: number) => void) | null>(null);
  const currentScrollPercentageRef = useRef<number>(-50);
  const expandedIndexRef = useRef<number | null>(null);

  const [expandedImageIndex, setExpandedImageIndex] = useState<number | null>(
    null
  );
  const [expandedImageSrc, setExpandedImageSrc] = useState<string | null>(null);
  const [expandedCollection, setExpandedCollection] = useState<{
    name: string;
    slug: string;
  } | null>(null);
  const [showCollectionTitle, setShowCollectionTitle] = useState(true);
  const [expandedImageStyle, setExpandedImageStyle] = useState<{
    top: number;
    left: number;
    width: number;
    height: number;
  } | null>(null);
  const [expandedObjectPosition, setExpandedObjectPosition] =
    useState<string>("100% center");
  const [isClosing, setIsClosing] = useState(false);
  const hasCollectionLink = !!expandedCollection?.slug;

  useEffect(() => {
    expandedIndexRef.current = expandedImageIndex;
  }, [expandedImageIndex]);

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
      if (expandedIndexRef.current !== null) return;
      e.preventDefault();
      const delta = e.deltaY * -0.02;
      targetPercentage = clamp(targetPercentage + delta);
      velocity = delta * 0.1;
    };
    window.addEventListener("wheel", handleWheel, { passive: false });

    const animate = (currentTime: number) => {
      const deltaTime = Math.min((currentTime - lastTime) / 16.67, 2);
      lastTime = currentTime;

      const isExpanded = expandedIndexRef.current !== null;

      if (isExpanded) {
        targetPercentage = percentage; // freeze track movement
        velocity = 0;
      } else if (Math.abs(velocity) > 0.01) {
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
      if (!isExpanded) {
        const totalImages = images.length;
        for (let i = 0; i < totalImages; i++) {
          const img = images[i] as HTMLElement;
          const relIndex = i / (totalImages - 1) - 0.5;
          const parallaxOffset = relIndex * 30;
          img.style.objectPosition = `${
            100 + percentage + parallaxOffset
          }% center`;
        }
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
    if (expandedImageIndex === null || isClosing) return;
    setShowCollectionTitle(false);
    const imageIndexToScroll = expandedImageIndex;
    const img = imageRefs.current[expandedImageIndex];
    if (!img) return;

    // Only translate the clicked image back to its current spot.
    // Delay briefly so the title can fade before shrink begins, then double-RAF to read layout.
    setTimeout(() => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const updatedImg = imageRefs.current[imageIndexToScroll];
          if (!updatedImg) return;

          // Force a reflow to ensure layout is updated
          updatedImg.offsetHeight;

          const rect = updatedImg.getBoundingClientRect();
          const currentObjectPosition =
            getComputedStyle(updatedImg).objectPosition;

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
            setExpandedImageSrc(null);
            setExpandedCollection(null);
            setShowCollectionTitle(true);
            setIsClosing(false);
          }, 1000);
        });
      });
    }, 120);
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

  /* -------------------------------
     Shrink on wheel while expanded
  ------------------------------- */
  useEffect(() => {
    const handleExpandedWheel = (e: WheelEvent) => {
      if (expandedIndexRef.current === null || isClosing) return;
      e.preventDefault();
      shrinkImage();
    };
    window.addEventListener("wheel", handleExpandedWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleExpandedWheel);
  }, [expandedImageIndex, isClosing]);

  return (
    <div
      className="min-h-screen w-full relative overflow-hidden"
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      <Navbar />
      <div className="px-6 sm:px-10 md:px-12 lg:px-20 xl:px-24 pt-24 pb-16">
        <div className="max-w-6xl mx-auto">
          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-semibold mb-4"
            style={{
              fontFamily:
                "'Juana', var(--font-display), 'Playfair Display', 'Times New Roman', serif",
            }}
          >
            Gallery
          </h1>
        </div>
      </div>

      {/* IMAGE TRACK */}
      <div
        ref={trackRef}
        className="absolute top-3/5 left-1/2 flex gap-[4vmin] select-none"
        style={{ transform: "translate(-50%, -50%)" }}
      >
        {galleryImages.map((src, i) => (
          <img
            key={i}
            ref={(el) => {
              imageRefs.current[i] = el;
            }}
            src={src}
            className="image cursor-pointer transition-all duration-500 ease-out hover:scale-105"
            draggable={false}
            onClick={() => {
              const img = imageRefs.current[i];
              if (!img) return;
              const rect = img.getBoundingClientRect();
              setExpandedImageIndex(i);
              setExpandedImageSrc(src);
              setExpandedCollection(parseCollection(src));
              setShowCollectionTitle(true);
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
      {expandedImageIndex !== null &&
        expandedImageStyle &&
        expandedImageSrc &&
        expandedCollection && (
          <>
            <div
              className="fixed inset-0 z-40 transition-opacity duration-1000"
              style={{
                backgroundColor: "#141414",
                opacity: isClosing ? 0 : 1,
              }}
            />
            {hasCollectionLink ? (
              <Link
                href={`/gallery/collection/${expandedCollection.slug}`}
                className="fixed top-1/2 left-1/2 z-60 -translate-x-1/2 -translate-y-1/2 text-center text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight transition-opacity duration-500 hover:opacity-80"
                style={{
                  color: textColor,
                  opacity: showCollectionTitle ? 1 : 0,
                  pointerEvents: showCollectionTitle ? "auto" : "none",
                  fontFamily:
                    "'Juana', var(--font-display), 'Playfair Display', 'Times New Roman', serif",
                }}
              >
                {expandedCollection.name}
              </Link>
            ) : (
              <div
                className="fixed top-1/2 left-1/2 z-60 -translate-x-1/2 -translate-y-1/2 text-center text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight transition-opacity duration-500 pointer-events-none"
                style={{
                  color: textColor,
                  opacity: showCollectionTitle ? 1 : 0,
                  fontFamily:
                    "'Juana', var(--font-display), 'Playfair Display', 'Times New Roman', serif",
                }}
              >
                {expandedCollection.name}
              </div>
            )}
            <img
              src={expandedImageSrc}
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
