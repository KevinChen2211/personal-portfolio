import type { Metadata } from "next";

const title = "Gallery";
const description =
  "Photography by Kevin Chen — collections and portraits shot on film and digital.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/gallery" },
  openGraph: {
    title: `${title} · Kevin Chen`,
    description,
    url: "/gallery",
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
