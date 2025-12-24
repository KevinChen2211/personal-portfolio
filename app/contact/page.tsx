"use client";

import Link from "next/link";
import Image from "next/image";
import Navbar from "../components/Navbar";

export default function ContactPage() {
  const bgColor = "#FAF2E6";
  const textColor = "#2C2C2C";

  return (
    <div
      className="h-screen w-full relative overflow-hidden pt-6 md:pt-8"
      style={{ backgroundColor: bgColor }}
    >
      <Navbar />

      {/* Main Content Area */}
      <main
        className="relative px-4 sm:px-6 md:px-12 lg:px-20 xl:px-24 flex items-center"
        style={{ height: "calc(100vh - 73px)", marginTop: "73px" }}
      >
        <div className="w-full flex flex-col md:flex-row items-center md:items-center gap-4 md:gap-10">
          {/* Contact Image - Left Side */}
          <div className="w-full md:w-[50vw] lg:w-[45vw] max-w-[800px] flex-shrink-0 order-2 md:order-1">
            <div className="relative w-full h-[50vh] md:h-[85vh] max-h-[900px]">
              <Image
                src="/images/contact_me.jpg"
                alt="Contact"
                fill
                className="object-contain"
                quality={100}
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>

          {/* Contact Content - Right Side */}
          <div className="w-full md:flex-1 order-1 md:order-2 flex flex-col justify-center">
            <div
              className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl leading-[1.4] md:leading-[1.3] mb-3 md:mb-5"
              style={{
                fontFamily:
                  "'Juana', var(--font-display), 'Playfair Display', 'Times New Roman', serif",
                fontWeight: 500,
                color: textColor,
                fontStyle: "normal",
                letterSpacing: "-0.01em",
              }}
            >
              Let's{" "}
              <span className="italic underline decoration-1 underline-offset-4">
                connect
              </span>
              {", "}
              feel free to reach out.
            </div>

            <div
              className="text-sm md:text-base leading-relaxed mb-4 md:mb-6"
              style={{
                fontFamily:
                  "'Juana', var(--font-display), 'Playfair Display', 'Times New Roman', serif",
                fontWeight: 400,
                color: textColor,
                fontStyle: "normal",
              }}
            >
              Always down for a good chat, about literally anything
            </div>

            <div className="space-y-3 md:space-y-4 mb-4 md:mb-6">
              <div>
                <h3
                  className="text-xs md:text-sm font-semibold mb-1"
                  style={{
                    color: textColor,
                    fontFamily:
                      "'Juana', var(--font-display), 'Playfair Display', 'Times New Roman', serif",
                  }}
                >
                  Instagram
                </h3>
                <a
                  href="https://www.instagram.com/kewinchen_/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs md:text-sm hover:opacity-70 transition-opacity hover:underline"
                  style={{
                    color: textColor,
                    fontFamily:
                      "'Juana', var(--font-display), 'Playfair Display', 'Times New Roman', serif",
                  }}
                >
                  @kewinchen_
                </a>
              </div>
              <div>
                <h3
                  className="text-xs md:text-sm font-semibold mb-1"
                  style={{
                    color: textColor,
                    fontFamily:
                      "'Juana', var(--font-display), 'Playfair Display', 'Times New Roman', serif",
                  }}
                >
                  LinkedIn
                </h3>
                <a
                  href="https://www.linkedin.com/in/kevinchenengineer/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs md:text-sm hover:opacity-70 transition-opacity hover:underline break-all"
                  style={{
                    color: textColor,
                    fontFamily:
                      "'Juana', var(--font-display), 'Playfair Display', 'Times New Roman', serif",
                  }}
                >
                  linkedin.com/in/kevinchenengineer/
                </a>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
              <a
                href="https://www.instagram.com/kewinchen_/"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 md:px-5 md:py-2.5 text-xs md:text-sm font-semibold text-center hover:opacity-70 transition-opacity border border-current"
                style={{
                  color: textColor,
                  fontFamily:
                    "'Juana', var(--font-display), 'Playfair Display', 'Times New Roman', serif",
                }}
              >
                Follow on Instagram
              </a>
              <a
                href="https://www.linkedin.com/in/kevinchenengineer/"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 md:px-5 md:py-2.5 text-xs md:text-sm font-semibold text-center hover:opacity-70 transition-opacity border border-current"
                style={{
                  color: textColor,
                  fontFamily:
                    "'Juana', var(--font-display), 'Playfair Display', 'Times New Roman', serif",
                }}
              >
                Connect on LinkedIn
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
