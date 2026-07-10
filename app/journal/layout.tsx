import type { Metadata } from "next";

const title = "Journal";
const description =
  "Writing by Kevin Chen on engineering, self-improvement, and building things.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/journal" },
  openGraph: {
    title: `${title} · Kevin Chen`,
    description,
    url: "/journal",
    images: ["/images/Journal.jpg"],
  },
};

export default function JournalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
