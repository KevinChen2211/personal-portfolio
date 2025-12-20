"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const bgColor = "#F0EEE9";
  const textColor = "#2C2C2C";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div
      className="min-h-screen w-full relative overflow-hidden"
      style={{ backgroundColor: bgColor }}
    >
      {/* Header Navigation */}
      <header className="w-full px-6 md:px-12 py-6 md:py-8 flex items-center justify-between relative z-20">
        {/* Name - Left */}
        <Link
          href="/"
          className="text-sm md:text-base font-light tracking-wide hover:opacity-70 transition-opacity"
          style={{ color: textColor, fontFamily: "var(--font-geist-sans)" }}
        >
          Kevin Chen
        </Link>

        {/* Navigation Links - Center-Right (Desktop) */}
        <nav className="hidden md:flex items-center gap-8 absolute left-1/2 transform -translate-x-1/2">
          <Link
            href="/projects"
            className="text-sm font-light tracking-wide hover:opacity-70 transition-opacity"
            style={{ color: textColor, fontFamily: "var(--font-geist-sans)" }}
          >
            Projects
          </Link>
          <Link
            href="/gallery"
            className="text-sm font-light tracking-wide hover:opacity-70 transition-opacity"
            style={{ color: textColor, fontFamily: "var(--font-geist-sans)" }}
          >
            Gallery
          </Link>
          <Link
            href="/blog"
            className="text-sm font-light tracking-wide hover:opacity-70 transition-opacity"
            style={{ color: textColor, fontFamily: "var(--font-geist-sans)" }}
          >
            Journal
          </Link>
          <Link
            href="/contact"
            className="text-sm font-light tracking-wide hover:opacity-70 transition-opacity"
            style={{ color: textColor, fontFamily: "var(--font-geist-sans)" }}
          >
            Contact
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden w-6 h-6 flex flex-col justify-center gap-1.5"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
          style={{ color: textColor }}
        >
          <span
            className={`w-full h-px transition-all ${
              mobileMenuOpen ? "rotate-45 translate-y-2" : ""
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
              mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
            style={{ backgroundColor: textColor }}
          />
        </button>

        {/* Social Icons - Right */}
        <div className="hidden md:flex items-center gap-4">
          <a
            href="https://www.linkedin.com/in/kevinsoftwarewiz"
            target="_blank"
            rel="noreferrer"
            className="w-5 h-5 hover:opacity-70 transition-opacity"
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
            className="w-5 h-5 hover:opacity-70 transition-opacity"
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
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 z-30 pt-20 px-6"
          style={{ backgroundColor: bgColor }}
        >
          <nav className="flex flex-col gap-6">
            <Link
              href="/projects"
              className="text-base font-light tracking-wide"
              style={{ color: textColor, fontFamily: "var(--font-geist-sans)" }}
              onClick={() => setMobileMenuOpen(false)}
            >
              Projects
            </Link>
            <Link
              href="/gallery"
              className="text-base font-light tracking-wide"
              style={{ color: textColor, fontFamily: "var(--font-geist-sans)" }}
              onClick={() => setMobileMenuOpen(false)}
            >
              Gallery
            </Link>
            <Link
              href="/blog"
              className="text-base font-light tracking-wide"
              style={{ color: textColor, fontFamily: "var(--font-geist-sans)" }}
              onClick={() => setMobileMenuOpen(false)}
            >
              Journal
            </Link>
            <Link
              href="/contact"
              className="text-base font-light tracking-wide"
              style={{ color: textColor, fontFamily: "var(--font-geist-sans)" }}
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
            <div className="flex items-center gap-4 pt-4">
              <a
                href="https://www.linkedin.com/in/kevinsoftwarewiz"
                target="_blank"
                rel="noreferrer"
                className="w-5 h-5"
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
                className="w-5 h-5"
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
            </div>
          </nav>
        </div>
      )}

      {/* Main Content Area */}
      <main className="relative px-6 md:px-12 lg:px-16 pt-8 md:pt-12 pb-12 md:pb-16 min-h-[calc(100vh-120px)] flex items-start">
        <div className="max-w-4xl lg:max-w-5xl relative w-full">
          {/* Hero Text - Large Serif Display */}
          {/* 
            NOTE: To use IvyPresto Display Thin instead of Playfair Display:
            1. Add Adobe Fonts link in layout.tsx <head>:
               <link rel="stylesheet" href="https://use.typekit.net/[your-kit-id].css">
            2. Update fontFamily below to: "ivypresto-display, var(--font-display), serif"
            3. Or uncomment @font-face in globals.css if you have the font files
          */}
          <div
            className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-[1.5] md:leading-[1.4] pr-0 md:pr-32 lg:pr-48"
            style={{
              fontFamily:
                "var(--font-display), 'Playfair Display', 'Times New Roman', serif",
              fontWeight: 300,
              color: textColor,
              fontStyle: "normal",
              letterSpacing: "-0.01em",
            }}
          >
            Kevin Chen (/keh-vin chen/) is an{" "}
            <span className="italic underline decoration-1 underline-offset-4">
              Engineer
            </span>{" "}
            ,{" "}
            <span className="italic underline decoration-1 underline-offset-4">
              Computer Scientist
            </span>{" "}
            &{" "}
            <span className="italic underline decoration-1 underline-offset-4">
              artistically driven creator
            </span>{" "}
            creating innovative solutions, digital experiences, and thoughtful
            projects.
          </div>

          {/* Subtle Image Element - Bottom Right */}
          <div className="hidden md:block absolute -right-8 lg:-right-16 xl:-right-24 bottom-0 w-48 md:w-64 lg:w-80 xl:w-96 h-64 md:h-80 lg:h-96 xl:h-[28rem] opacity-50 pointer-events-none">
            <div className="relative w-full h-full">
              <Image
                src="/gallery-images/Hello_Gorgeous1.jpg"
                alt=""
                fill
                className="object-cover"
                style={{ objectPosition: "center" }}
                priority={false}
                sizes="(max-width: 768px) 0px, 384px"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
