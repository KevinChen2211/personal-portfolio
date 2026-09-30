"use client";

import Image from "next/image";
import Link from "next/link";
import Navbar from "../components/Navbar";

export default function ContactPage() {
  const bgColor = "#FAF2E6";
  const textColor = "#2C2C2C";

  return (
    <div
      className="min-h-dvh md:h-dvh w-full relative md:overflow-hidden pt-6 md:pt-8"
      style={{ backgroundColor: bgColor }}
    >
      <Navbar />

      {/* Main Content Area. One fixed screen from md up; on phones it grows
          and scrolls instead, because the text and photo stacked can be
          taller than a small screen. 97px is the 73px offset plus pt-6. */}
      <main className="relative px-4 sm:px-6 md:px-12 lg:px-20 xl:px-24 flex items-center mt-[73px] min-h-[calc(100dvh_-_97px)] pb-8 md:min-h-0 md:h-[calc(100dvh_-_73px)] md:pb-0">
        <div className="site-container flex flex-col md:flex-row items-center md:items-center gap-4 md:gap-10">
          {/* Contact Image - Left Side */}
          <div className="w-full md:w-[50vw] lg:w-[45vw] max-w-[800px] flex-shrink-0 order-2 md:order-1">
            <div className="relative w-full h-[50vh] md:h-[85vh] max-h-[900px]">
              <Image
                src="/images/contact_me.jpg"
                alt="Contact"
                fill
                className="object-contain"
                quality={75}
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>

          {/* Contact Content - Right Side */}
          <div className="w-full md:flex-1 order-1 md:order-2 flex flex-col justify-center">
            <h1
              className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl leading-[1.4] md:leading-[1.3] mb-3 md:mb-5"
              style={{
                fontFamily:
                  "var(--font-serif)",
                fontWeight: 500,
                color: textColor,
                fontStyle: "normal",
                letterSpacing: "-0.01em",
              }}
            >
              Let&apos;s{" "}
              <span className="italic underline decoration-1 underline-offset-4">
                connect
              </span>
              {", "}
              feel free to reach out.
            </h1>

            <p
              className="text-sm md:text-base leading-relaxed mb-3 md:mb-4"
              style={{ fontWeight: 400, color: textColor }}
            >
              I&apos;m a software engineer at AMD, based in Sydney. I studied at
              RMIT University, where I founded{" "}
              <Link
                href="/projects/rmit-battlebots"
                className="underline decoration-1 underline-offset-2 hover:opacity-70 transition-opacity"
              >
                RMIT BattleBots
              </Link>
              .
            </p>

            <div
              className="text-sm md:text-base leading-relaxed mb-4 md:mb-6 "
              style={{
                fontWeight: 400,
                color: textColor,
                fontStyle: "normal",
              }}
            >
              Always down for a good chat, about literally anything
            </div>

            <div className="space-y-3 md:space-y-4 mb-4 md:mb-6">
              <div>
                <h2
                  className="text-xs md:text-sm font-semibold mb-1"
                  style={{
                    color: textColor,
                  }}
                >
                  Instagram
                </h2>
                <a
                  href="https://www.instagram.com/kewinchen_/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs md:text-sm hover:opacity-70 transition-opacity hover:underline"
                  style={{
                    color: textColor,
                  }}
                >
                  @kewinchen_
                </a>
              </div>
              <div>
                <h2
                  className="text-xs md:text-sm font-semibold mb-1"
                  style={{
                    color: textColor,
                  }}
                >
                  LinkedIn
                </h2>
                <a
                  href="https://www.linkedin.com/in/kevinchenengineer/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs md:text-sm hover:opacity-70 transition-opacity hover:underline break-all"
                  style={{
                    color: textColor,
                  }}
                >
                  linkedin.com/in/kevinchenengineer/
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
