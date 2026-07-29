import type { Metadata } from "next";

const title = "Contact";
const description =
  "Get in touch with Kevin Chen — always up for a good conversation.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/contact" },
  openGraph: {
    title: `${title} · Kevin Chen`,
    description,
    url: "/contact",
    images: ["/images/Contact.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: `${title} · Kevin Chen`,
    description,
    images: ["/images/Contact.jpg"],
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
