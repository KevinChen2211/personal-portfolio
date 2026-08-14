"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "./utils/motion";
import Navbar from "./components/Navbar";

export default function Home() {
  const bgColor = "#FAF2E6";
  const textColor = "#2C2C2C";
  const [visibleImages, setVisibleImages] = useState<Set<number>>(new Set());
  const [heroVisible, setHeroVisible] = useState(false);
  const [heroImageVisible, setHeroImageVisible] = useState(false);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imageParallaxRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [mobileBannerVisible, setMobileBannerVisible] = useState(true);
  const [mobileBannerFading, setMobileBannerFading] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  // Check if this is the first visit after loading screen.
  // `hasVisitedLanding` is written by app/template.tsx, which owns the loading
  // screen — writing it here too used to mark the visit before the loading
  // screen had a chance to read the flag.
  useEffect(() => {
    // Both hero elements are hidden by `[data-first-visit]` in globals.css
    // until they get `.is-visible`. Drop the attribute once the entrance has
    // finished so a client-side navigation back here doesn't replay it.
    const finish = () => {
      setHeroImageVisible(true);
      document.documentElement.removeAttribute("data-first-visit");
    };

    const hasVisitedBefore = sessionStorage.getItem("hasVisitedLanding");

    if (hasVisitedBefore || prefersReducedMotion) {
      // Already painted — this just keeps state in sync.
      setHeroVisible(true);
      finish();
      return;
    }

    // First visit - wait for loading screen, then fade in
    let imageTimer: ReturnType<typeof setTimeout> | undefined;
    const textTimer = setTimeout(() => {
      setHeroVisible(true);
      imageTimer = setTimeout(finish, 450); // Stagger image after text
    }, 500); // Delay after loading screen completes

    return () => {
      clearTimeout(textTimer);
      clearTimeout(imageTimer);
    };
  }, [prefersReducedMotion]);

  // Image data with order, source, link, and label
  const images = [
    { src: "/images/Gallery.jpg", link: "/gallery", label: "Gallery" },
    { src: "/images/Projects.jpg", link: "/projects", label: "Projects" },
    { src: "/images/Gallery2.jpg", link: "/gallery", label: "Gallery" },
    { src: "/images/Journal.jpg", link: "/journal", label: "Journal" },
    { src: "/images/Gallery3.jpg", link: "/gallery", label: "Gallery" },
    { src: "/images/Contact.jpg", link: "/contact", label: "Contact" },
  ];

  // Gentle parallax on section images.
  useEffect(() => {
    let ticking = false;
    let frameId: number | null = null;

    // Mutate the parallax layers' transforms directly instead of routing
    // through React state — this runs on every scroll frame, so re-rendering
    // the whole page each time would be wasteful and janky.
    const updateParallax = () => {
      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      imageParallaxRefs.current.forEach((el) => {
        if (!el) return;
        if (reduce) {
          el.style.transform = "translateY(0px)";
          return;
        }
        const rect = el.getBoundingClientRect();
        const centerY = rect.top + rect.height / 2;
        const progress =
          (centerY - window.innerHeight / 2) / window.innerHeight;
        el.style.transform = `translateY(${progress * 20}px)`;
      });
    };

    const handleScroll = () => {
      if (!ticking) {
        frameId = window.requestAnimationFrame(() => {
          updateParallax();
          ticking = false;
          frameId = null;
        });
        ticking = true;
      }
    };

    updateParallax();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", updateParallax);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateParallax);
      if (frameId !== null) window.cancelAnimationFrame(frameId);
    };
  }, []);

  // Mobile banner: linger, then fade out slowly
  useEffect(() => {
    const fadeDelay = prefersReducedMotion ? 3000 : 6500;
    const hideDelay = prefersReducedMotion ? 3200 : 9500;

    const fadeTimer = setTimeout(() => setMobileBannerFading(true), fadeDelay);
    const hideTimer = setTimeout(() => setMobileBannerVisible(false), hideDelay);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, [prefersReducedMotion]);

  // Intersection Observer for fade-in animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(
              (entry.target as HTMLElement).dataset.index || "0",
              10,
            );
            setVisibleImages((prev) => new Set(prev).add(index));
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      },
    );

    // Use setTimeout to ensure DOM is ready
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
  }, []);

  return (
    <div
      className="min-h-screen w-full relative overflow-x-hidden pt-6 md:pt-8"
      style={{ backgroundColor: bgColor }}
    >
      {/* Mobile banner — quiet editorial note, slow fade */}
      {mobileBannerVisible && (
        <div
          className="md:hidden fixed top-[73px] left-0 right-0 z-40 px-6 py-2.5 text-center pointer-events-none"
          style={{
            backgroundColor: "transparent",
            color: textColor,
            opacity: mobileBannerFading ? 0 : 0.55,
            transition: prefersReducedMotion
              ? "opacity 0.2s ease-out"
              : "opacity 2.5s var(--ease-out)",
            fontFamily:
              "var(--font-serif)",
            fontStyle: "italic",
            fontSize: "11px",
            letterSpacing: "0.04em",
          }}
        >
          Best viewed on desktop
        </div>
      )}

      <Navbar />

      {/* Main Content Area */}
      <main className="relative px-4 sm:px-6 md:px-12 lg:px-20 xl:px-24 min-h-screen flex items-center pt-24 md:pt-30">
        <div className="site-container flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-12">
          {/* Hero Text - Large Serif Display */}
          <div className="w-full md:max-w-[60vw] lg:max-w-[50vw] relative">
            <h1
              className={`hero-reveal text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl leading-[1.5] md:leading-[1.4] ${
                heroVisible ? "is-visible" : ""
              }`}
              style={{
                fontFamily:
                  "var(--font-serif)",
                fontWeight: 500,
                color: textColor,
                fontStyle: "normal",
                letterSpacing: "-0.01em",
              }}
            >
              Kevin Chen <span className="italic">(/keh-vin chen/)</span> is a
              multidisciplinary{" "}
              <span className="italic underline decoration-1 underline-offset-4">
                engineer
              </span>{" "}
              ,{" "}
              <span className="italic underline decoration-1 underline-offset-4">
                computer scientist
              </span>{" "}
              &{" "}
              <span className="italic underline decoration-1 underline-offset-4">
                artistically driven creator
              </span>{" "}
              exploring innovative solutions, digital experiences, and creative
              projects.
            </h1>
          </div>

          {/* Kevin Chen Portrait Image */}
          <div
            className={`hero-reveal relative flex-shrink-0 w-full md:w-[55vw] md:max-w-[600px] md:ml-auto mb-6 md:mb-0 ${
              heroImageVisible ? "is-visible" : ""
            }`}
          >
            <div className="relative w-full h-[50vh] max-h-[400px] md:h-[80vh] md:max-h-[900px]">
              <Image
                src="/images/KevinChen.jpg"
                alt="Kevin Chen"
                fill
                className="object-contain"
                quality={80}
                priority
                sizes="(max-width: 768px) 100vw, 55vw"
              />
            </div>
          </div>
        </div>
      </main>

      {/* Scrollable Image Gallery Section */}
      <section className="relative w-full pt-0 pb-20 md:pb-28">
        {images.map((image, index) => {
          // 4-position cycle: 0, 1, 3, 2 (left, middle-left, right, middle-right)
          const positionMap = [0, 1, 3, 2];
          const position = positionMap[index % 4];
          const isVisible = visibleImages.has(index);
          const isLastImage = index === images.length - 1;

          // Determine alignment based on position
          let justifyClass = "";
          let textAlignClass = "";

          if (position === 0) {
            // Left side
            justifyClass = "justify-start";
            textAlignClass = "md:text-right";
          } else if (position === 1) {
            // Middle but slightly left
            justifyClass = "justify-start md:justify-center md:pr-[15%]";
            textAlignClass = "md:text-right";
          } else if (position === 2) {
            // Middle but slightly right
            justifyClass = "justify-end md:justify-center md:pl-[15%]";
            textAlignClass = "md:text-left";
          } else {
            // Right side (position 3)
            justifyClass = "justify-end";
            textAlignClass = "md:text-left";
          }

          return (
            <div
              key={index}
              data-index={index}
              ref={(el) => {
                imageRefs.current[index] = el;
              }}
              className={`w-full flex ${justifyClass} ${
                isLastImage ? "mb-0 md:pb-[0vh]" : "mb-[28vh]"
              } px-4 sm:px-6 md:px-12 lg:px-20 xl:px-28`}
              style={{
                opacity: isVisible ? 1 : 0,
                transform:
                  prefersReducedMotion || isVisible
                    ? "translateY(0)"
                    : "translateY(30px)",
                transition: prefersReducedMotion
                  ? "opacity 0.2s ease-out"
                  : "opacity 1.1s var(--ease-out), transform 1.1s var(--ease-out)",
              }}
            >
              <Link
                href={image.link}
                className="group flex flex-col items-start w-full md:w-auto max-w-[90vw] md:max-w-[50vw] lg:max-w-[45vw]"
              >
                <div
                  ref={(el) => {
                    imageParallaxRefs.current[index] = el;
                  }}
                  className="relative inline-block w-full mb-3"
                  style={{
                    transition: "transform 0.15s linear",
                    willChange: "transform",
                  }}
                >
                  <Image
                    src={image.src}
                    alt={image.label}
                    width={1600}
                    height={1067}
                    className="object-contain w-full h-auto max-h-[85vh]"
                    quality={70}
                    sizes="(max-width: 768px) 90vw, (max-width: 1024px) 50vw, 45vw"
                    priority={index === 0}
                    loading={index === 0 ? "eager" : "lazy"}
                  />
                </div>
                <span
                  className={`text-xs md:text-sm font-semibold opacity-90 group-hover:opacity-100 group-hover:underline transition-opacity duration-700 w-full ${textAlignClass}`}
                  style={{
                    color: textColor,
                    fontFamily:
                      "var(--font-serif)",
                  }}
                >
                  {image.label}
                </span>
              </Link>
            </div>
          );
        })}
      </section>

    </div>
  );
}
