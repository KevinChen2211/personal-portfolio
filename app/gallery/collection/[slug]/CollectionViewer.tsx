"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "../../../components/Navbar";

type CollectionViewerProps = {
  images: string[];
  title: string;
};

export default function CollectionViewer({
  images,
  title,
}: CollectionViewerProps) {
  const bgColor = "#FAF2E6";
  const textColor = "#2C2C2C";
  const [visibleImages, setVisibleImages] = useState<Set<number>>(new Set());
  const [pageVisible, setPageVisible] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(false);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Fade in page on mount
  useEffect(() => {
    // Check if navigating from gallery (has sessionStorage flag) - check immediately before template clears it
    const navigatingFromGallery =
      sessionStorage.getItem("navigatingToCollection") === "true";

    // Preload first image first (prioritize it)
    const preloadFirstImage = (): Promise<void> => {
      if (images.length === 0) return Promise.resolve();

      return new Promise<void>((resolve) => {
        const img = document.createElement("img");
        img.onload = () => resolve();
        img.onerror = () => resolve(); // Resolve even on error
        img.src = images[0]; // Load first image immediately
      });
    };

    // Preload remaining images
    const preloadRemainingImages = (): Promise<void[]> => {
      if (images.length <= 1) return Promise.resolve([]);

      const remainingImages = images.slice(1);
      const preloadPromises = remainingImages.map((src) => {
        return new Promise<void>((resolve) => {
          const img = document.createElement("img");
          img.onload = () => resolve();
          img.onerror = () => resolve(); // Resolve even on error
          img.src = src;
        });
      });

      return Promise.all(preloadPromises);
    };

    // Load first image first, then load the rest
    preloadFirstImage().then(() => {
      // Start loading remaining images in parallel, but don't wait for them
      preloadRemainingImages();

      // Wait for template transition if coming from gallery
      // Template waits 700ms, so we wait a bit longer to ensure smooth fade-in
      const delay = navigatingFromGallery ? 800 : 100;

      setTimeout(() => {
        // Fade in header first
        setHeaderVisible(true);
        // Then fade in page content
        setTimeout(() => {
          setPageVisible(true);
        }, 200);
      }, delay);
    });
  }, [images]);

  // Intersection Observer for fade-in animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(
              (entry.target as HTMLElement).dataset.index || "0",
              10
            );
            setVisibleImages((prev) => new Set(prev).add(index));
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    const timeoutId = setTimeout(() => {
      imageRefs.current.forEach((ref) => {
        if (ref) observer.observe(ref);
      });
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      imageRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, [images.length]);

  if (images.length === 0) {
    return (
      <div
        className="min-h-screen w-full relative overflow-y-auto pt-6 md:pt-8"
        style={{ backgroundColor: bgColor, color: textColor }}
      >
        <Navbar />
        <div className="min-h-screen flex items-center justify-center pt-24 md:pt-30">
          <div className="text-center px-6">
            <p
              className="text-sm md:text-base mb-4"
              style={{
                fontFamily:
                  "'Juana', var(--font-display), 'Playfair Display', 'Times New Roman', serif",
              }}
            >
              No images found for this collection.
            </p>
            <Link
              href="/gallery"
              className="inline-block text-lg transition-all duration-300 hover:underline hover:translate-x-[-4px]"
              style={{
                color: textColor,
                fontFamily:
                  "'Juana', var(--font-display), 'Playfair Display', 'Times New Roman', serif",
              }}
            >
              ← Back to Gallery
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen w-full relative overflow-y-auto pt-6 md:pt-8"
      style={{ backgroundColor: bgColor }}
    >
      <Navbar />

      {/* Header Section */}
      <header
        className="w-full px-4 sm:px-6 md:px-12 lg:px-20 xl:px-24 pt-24 md:pt-30 pb-8 md:pb-12"
        style={{
          opacity: headerVisible ? 1 : 0,
          transform: headerVisible ? "translateY(0)" : "translateY(-20px)",
          transition:
            "opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/gallery"
            className="text-sm md:text-base transition-all duration-300 hover:underline hover:translate-x-[-4px]"
            style={{
              color: textColor,
              fontFamily:
                "'Juana', var(--font-display), 'Playfair Display', 'Times New Roman', serif",
            }}
          >
            ← Back to Gallery
          </Link>
        </div>
        <h1
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-2"
          style={{
            color: textColor,
            fontFamily:
              "'Juana', var(--font-display), 'Playfair Display', 'Times New Roman', serif",
          }}
        >
          {title}
        </h1>
        <p
          className="text-sm md:text-base opacity-70"
          style={{
            color: textColor,
            fontFamily:
              "'Juana', var(--font-display), 'Playfair Display', 'Times New Roman', serif",
          }}
        >
          {images.length} {images.length === 1 ? "image" : "images"}
        </p>
      </header>

      {/* Images Grid */}
      <section
        className="relative w-full pb-12 md:pb-20"
        style={{
          opacity: pageVisible ? 1 : 0,
          transition: "opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        {images.map((imageSrc, index) => {
          const isVisible = visibleImages.has(index);
          const isLastImage = index === images.length - 1;

          // Alternate positioning similar to homepage
          const positionMap = [0, 1, 3, 2];
          const position = positionMap[index % 4];

          let justifyClass = "";
          if (position === 0) {
            justifyClass = "justify-start";
          } else if (position === 1) {
            justifyClass = "justify-start md:justify-center md:pr-[15%]";
          } else if (position === 2) {
            justifyClass = "justify-end md:justify-center md:pl-[15%]";
          } else {
            justifyClass = "justify-end";
          }

          return (
            <div
              key={index}
              data-index={index}
              ref={(el) => {
                imageRefs.current[index] = el;
              }}
              className={`w-full flex ${justifyClass} ${
                isLastImage ? "mb-0 md:pb-[0vh]" : "mb-[15vh] md:mb-[20vh]"
              } px-4 sm:px-6 md:px-12 lg:px-20 xl:px-24`}
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(30px)",
                transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
              }}
            >
              <div className="flex flex-col items-start w-full md:w-auto max-w-[90vw] md:max-w-[60vw] lg:max-w-[55vw]">
                <div className="relative inline-block w-full">
                  <Image
                    src={imageSrc}
                    alt={`${title} - Image ${index + 1}`}
                    width={3000}
                    height={2000}
                    className="object-contain w-full h-auto max-h-[85vh]"
                    quality={85}
                    sizes="(max-width: 768px) 90vw, (max-width: 1024px) 60vw, 55vw"
                    priority={index === 0}
                    loading={index === 0 ? undefined : "lazy"}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* Footer */}
      <footer
        className="w-full py-12 flex justify-center items-center"
        style={{
          backgroundColor: bgColor,
          color: textColor,
          fontFamily: "'Juana', var(--font-display), 'Playfair Display', serif",
        }}
      >
        © Kevin Chen
      </footer>
    </div>
  );
}
