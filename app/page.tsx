"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const bgColor = "#ffffed";
  const textColor = "#2C2C2C";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [navbarAtBottom, setNavbarAtBottom] = useState(false);
  const [visibleImages, setVisibleImages] = useState<Set<number>>(new Set());
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Image data with order, source, link, and label
  const images = [
    { src: "/images/Gallery.jpg", link: "/gallery", label: "Gallery" },
    { src: "/images/Projects.jpg", link: "/projects", label: "Projects" },
    { src: "/images/Gallery2.jpg", link: "/gallery", label: "Gallery" },
    { src: "/images/Journal.jpg", link: "/blog", label: "Journal" },
    { src: "/images/Gallery3.jpg", link: "/gallery", label: "Gallery" },
    { src: "/images/Contact.jpg", link: "/contact", label: "Contact" },
  ];

  // Scroll detection for navbar visibility
  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const windowHeight = window.innerHeight;
          const documentHeight = document.documentElement.scrollHeight;
          const isAtBottom =
            currentScrollY + windowHeight >= documentHeight - 10;
          const scrollDifference = currentScrollY - lastScrollY;

          // Show navbar at bottom when at the very bottom
          if (isAtBottom) {
            setNavbarAtBottom(true);
            setShowNavbar(true);
          } else {
            setNavbarAtBottom(false);

            // Hide navbar when scrolling down past threshold, show when scrolling up or at top
            if (currentScrollY > 100 && scrollDifference > 0) {
              setShowNavbar(false);
            } else if (currentScrollY <= 100 || scrollDifference < 0) {
              setShowNavbar(true);
            }
          }

          lastScrollY = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
        rootMargin: "0px 0px -100px 0px",
      }
    );

    const refs = imageRefs.current;
    refs.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      refs.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  return (
    <div
      className="min-h-screen w-full relative overflow-y-auto pt-6 md:pt-8"
      style={{ backgroundColor: bgColor }}
    >
      {/* Header Navigation */}
      <header
        className={`w-full px-6 md:px-12 lg:px-16 py-5 md:py-6 flex items-center justify-between fixed z-50 transition-all duration-300 ${
          showNavbar
            ? navbarAtBottom
              ? "bottom-0 top-auto"
              : "top-0"
            : "-translate-y-full"
        }`}
        style={{ backgroundColor: bgColor }}
      >
        {/* Name - Left */}
        <Link
          href="/"
          className="text-xs md:text-sm tracking-wide hover:opacity-70 transition-opacity"
          style={{
            color: textColor,
            fontFamily:
              '"Sweet Rosetia Sans", "Juana", var(--font-display), "Playfair Display", "Times New Roman", serif',
            fontWeight: "normal",
          }}
        >
          <span className="font-bold">KEVIN CHEN</span>
        </Link>

        {/* Navigation Links - Left Side (Desktop) */}
        <nav className="hidden md:flex items-center gap-8 ml-4">
          <Link
            href="/projects"
            className="text-sm font-light tracking-wide hover:opacity-70 transition-opacity"
            style={{
              color: textColor,
              fontFamily:
                "'Juana', var(--font-display), 'Playfair Display', 'Times New Roman', serif",
            }}
          >
            Projects
          </Link>
          <Link
            href="/gallery"
            className="text-sm font-light tracking-wide hover:opacity-70 transition-opacity"
            style={{
              color: textColor,
              fontFamily:
                "'Juana', var(--font-display), 'Playfair Display', 'Times New Roman', serif",
            }}
          >
            Gallery
          </Link>
          <Link
            href="/blog"
            className="text-sm font-light tracking-wide hover:opacity-70 transition-opacity"
            style={{
              color: textColor,
              fontFamily:
                "'Juana', var(--font-display), 'Playfair Display', 'Times New Roman', serif",
            }}
          >
            Journal
          </Link>
          <Link
            href="/contact"
            className="text-sm font-light tracking-wide hover:opacity-70 transition-opacity"
            style={{
              color: textColor,
              fontFamily:
                "'Juana', var(--font-display), 'Playfair Display', 'Times New Roman', serif",
            }}
          >
            Contact
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden w-5 h-5 flex flex-col justify-center gap-1"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
          style={{ color: textColor }}
        >
          <span
            className={`w-full h-px transition-all ${
              mobileMenuOpen ? "rotate-45 translate-y-1.5" : ""
            }`}
            style={{ backgroundColor: textColor }}
          />
          <span
            className={`w-full h-px transition-all ${
              mobileMenuOpen ? "opacity-0" : ""
            }`}
            style={{ backgroundColor: textColor }}
          />
          <span
            className={`w-full h-px transition-all ${
              mobileMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
            }`}
            style={{ backgroundColor: textColor }}
          />
        </button>

        {/* Social Icons - Right */}
        <div className="hidden md:flex items-center gap-2">
          <a
            href="https://www.linkedin.com/in/kevinsoftwarewiz"
            target="_blank"
            rel="noreferrer"
            className="hover:opacity-70 transition-opacity inline-block"
            aria-label="LinkedIn"
          >
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              style={{ color: textColor, width: "20px", height: "20px" }}
            >
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </a>
          <a
            href="https://github.com/KevinChen2211"
            target="_blank"
            rel="noreferrer"
            className="hover:opacity-70 transition-opacity inline-block"
            aria-label="GitHub"
          >
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              style={{ color: textColor, width: "20px", height: "20px" }}
            >
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
          </a>
          <a
            href="https://www.instagram.com/kewinchen_/"
            target="_blank"
            rel="noreferrer"
            className="hover:opacity-70 transition-opacity inline-block"
            aria-label="Instagram"
          >
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              style={{ color: textColor, width: "20px", height: "20px" }}
            >
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
          </a>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 z-30 pt-20 px-6"
          style={{ backgroundColor: bgColor }}
        >
          <nav className="flex flex-col gap-4">
            <Link
              href="/projects"
              className="text-sm font-light tracking-wide"
              style={{
                color: textColor,
                fontFamily:
                  "'Juana', var(--font-display), 'Playfair Display', 'Times New Roman', serif",
              }}
              onClick={() => setMobileMenuOpen(false)}
            >
              Projects
            </Link>
            <Link
              href="/gallery"
              className="text-sm font-light tracking-wide"
              style={{
                color: textColor,
                fontFamily:
                  "'Juana', var(--font-display), 'Playfair Display', 'Times New Roman', serif",
              }}
              onClick={() => setMobileMenuOpen(false)}
            >
              Gallery
            </Link>
            <Link
              href="/blog"
              className="text-sm font-light tracking-wide"
              style={{
                color: textColor,
                fontFamily:
                  "'Juana', var(--font-display), 'Playfair Display', 'Times New Roman', serif",
              }}
              onClick={() => setMobileMenuOpen(false)}
            >
              Journal
            </Link>
            <Link
              href="/contact"
              className="text-sm font-light tracking-wide"
              style={{
                color: textColor,
                fontFamily:
                  "'Juana', var(--font-display), 'Playfair Display', 'Times New Roman', serif",
              }}
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
            <div className="flex items-center gap-3 pt-3">
              <a
                href="https://www.linkedin.com/in/kevinsoftwarewiz"
                target="_blank"
                rel="noreferrer"
                className="w-4 h-4"
                aria-label="LinkedIn"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  style={{ color: textColor }}
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a
                href="https://github.com/KevinChen2211"
                target="_blank"
                rel="noreferrer"
                className="w-4 h-4"
                aria-label="GitHub"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  style={{ color: textColor }}
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/kewinchen_/"
                target="_blank"
                rel="noreferrer"
                className="w-4 h-4"
                aria-label="Instagram"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  style={{ color: textColor }}
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            </div>
          </nav>
        </div>
      )}

      {/* Main Content Area */}
      <main className="relative px-6 md:px-12 lg:px-20 xl:px-24 min-h-screen flex items-center">
        <div className="max-w-[70vw] lg:max-w-[55vw] relative w-full">
          {/* Hero Text - Large Serif Display */}
          {/* 
            NOTE: To use IvyPresto Display Thin instead of Playfair Display:
            1. Add Adobe Fonts link in layout.tsx <head>:
               <link rel="stylesheet" href="https://use.typekit.net/[your-kit-id].css">
            2. Update fontFamily below to: "ivypresto-display, var(--font-display), serif"
            3. Or uncomment @font-face in globals.css if you have the font files
          */}
          <div
            className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl leading-[1.5] md:leading-[1.4]"
            style={{
              fontFamily:
                "'Juana', var(--font-display), 'Playfair Display', 'Times New Roman', serif",
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
          </div>
        </div>
      </main>

      {/* Portrait Image - Right Side */}
      <div className="hidden md:block fixed right-0 top-1/2 -translate-y-1/2 z-10 pointer-events-none w-[40vw] max-w-[600px] h-[80vh] max-h-[800px]">
        <div className="relative w-full h-full">
          <Image
            src="/images/KevinChen.jpg"
            alt="Kevin Chen"
            fill
            className="object-contain"
            quality={100}
            priority
            sizes="40vw"
            style={{
              objectPosition: "right center",
            }}
          />
        </div>
      </div>

      {/* Scrollable Image Gallery Section */}
      <section className="relative w-full py-20 pb-32">
        {images.map((image, index) => {
          const isLeft = index % 2 === 0;
          const isVisible = visibleImages.has(index);

          return (
            <div
              key={index}
              data-index={index}
              ref={(el) => {
                imageRefs.current[index] = el;
              }}
              className={`w-full flex ${
                isLeft ? "justify-start" : "justify-end"
              } mb-[40vh] px-6 md:px-12 lg:px-20 xl:px-24`}
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(30px)",
                transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
              }}
            >
              <div
                className={`flex items-end gap-4 ${
                  isLeft ? "flex-row" : "flex-row-reverse"
                }`}
              >
                <div className="relative inline-block">
                  <Link href={image.link} className="block">
                    <Image
                      src={image.src}
                      alt={image.label}
                      width={3000}
                      height={2000}
                      className="object-contain"
                      quality={100}
                      sizes="(max-width: 1920px) 100vw, 1920px"
                      priority={index < 2}
                      style={{
                        width: "auto",
                        height: "auto",
                        maxWidth: "none",
                      }}
                    />
                  </Link>
                </div>
                <Link
                  href={image.link}
                  className="text-xs md:text-sm opacity-70 hover:opacity-100 hover:underline transition-opacity pb-2 whitespace-nowrap"
                  style={{
                    color: textColor,
                    fontFamily:
                      "'Juana', var(--font-display), 'Playfair Display', 'Times New Roman', serif",
                  }}
                >
                  {image.label}
                </Link>
              </div>
            </div>
          );
        })}
      </section>

      {/* Bottom padding for navbar when at bottom */}
      {navbarAtBottom && <div className="h-24" />}
    </div>
  );
}
