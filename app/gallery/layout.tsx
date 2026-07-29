import type { Metadata } from "next";

const title = "Gallery";
const description =
  "Photography by Kevin Chen — collections and portraits shot on film and digital.";

export const metadata: Metadata = {
  // `default` titles this listing page; `template` cascades the "· Kevin Chen"
  // suffix to the collection [slug] detail pages under this layout.
  title: {
    default: title,
    template: "%s · Kevin Chen",
  },
  description,
  alternates: { canonical: "/gallery" },
  openGraph: {
    title: `${title} · Kevin Chen`,
    description,
    url: "/gallery",
    images: ["/images/Gallery.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: `${title} · Kevin Chen`,
    description,
    images: ["/images/Gallery.jpg"],
  },
};

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
