import type { Metadata } from "next";

const title = "Projects";
const description =
  "Engineering and creative projects by Kevin Chen — robotics, embedded systems, custom CPU design, cloud applications, and more.";

export const metadata: Metadata = {
  // `default` titles this listing page; `template` cascades the "· Kevin Chen"
  // suffix to the project [slug] detail pages under this layout.
  title: {
    default: title,
    template: "%s · Kevin Chen",
  },
  description,
  alternates: { canonical: "/projects" },
  openGraph: {
    title: `${title} · Kevin Chen`,
    description,
    url: "/projects",
    images: ["/images/Projects.jpg"],
  },
};

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
