import type { Metadata } from "next";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Passport from "./Passport";
import { countries } from "../data/travel";
import { openGraphDefaults } from "../lib/site";

const title = "Passport";
const description =
  "Places Kevin Chen has been, stamped into a passport, with a world map printed in UV ink.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/passport" },
  openGraph: {
    ...openGraphDefaults,
    type: "website",
    title: `${title} · Kevin Chen`,
    description,
    url: "/passport",
  },
};

export default function PassportPage() {
  return (
    <div className="min-h-screen w-full relative" style={{ backgroundColor: "#FAF2E6" }}>
      <Navbar />
      <main className="px-4 sm:px-6 md:px-12 lg:px-20 xl:px-24 pt-28 pb-16">
        <div className="site-container">
          <h1
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-[1.3] mb-4 text-center"
            style={{
              fontFamily: "var(--font-serif)",
              fontWeight: 500,
              color: "#2C2C2C",
              letterSpacing: "-0.01em",
            }}
          >
            Places I&apos;ve{" "}
            <span className="italic underline decoration-1 underline-offset-4">been</span>
          </h1>
          <p
            className="text-center text-sm md:text-base mb-8 md:mb-10"
            style={{ fontFamily: "var(--font-serif)", color: "#2C2C2C", opacity: 0.7 }}
          >
            You found the passport. Every stamp is somewhere I&apos;ve been.
          </p>
          <Passport countries={countries} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
