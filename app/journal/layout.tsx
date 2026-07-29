import type { Metadata } from "next";

const title = "Journal";
const description =
  "Writing by Kevin Chen on engineering, self-improvement, and building things.";

export const metadata: Metadata = {
  // `default` titles this listing page ("Journal · Kevin Chen" via the root
  // template); `template` cascades the suffix to the [slug] detail pages, which
  // otherwise lose it because this intermediate layout sets its own title.
  title: {
    default: title,
    template: "%s · Kevin Chen",
  },
  description,
  alternates: { canonical: "/journal" },
  openGraph: {
    title: `${title} · Kevin Chen`,
    description,
    url: "/journal",
    images: ["/images/Journal.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: `${title} · Kevin Chen`,
    description,
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
