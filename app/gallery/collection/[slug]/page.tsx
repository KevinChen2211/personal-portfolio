import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { allImages, parseCollection } from "../../data";
import CollectionViewer from "./CollectionViewer";
import JsonLd from "../../../components/JsonLd";
import { imageGallerySchema, breadcrumbSchema } from "../../../lib/structured-data";

type Params = {
  params: Promise<{ slug: string }>;
};

// Allow visiting any slug even if it's not statically generated
export const dynamicParams = true;

export function generateStaticParams() {
  const uniqueSlugs = Array.from(
    new Set(allImages.map((src) => parseCollection(src).slug)),
  );
  return uniqueSlugs.map((slug) => ({ slug }));
}

function normalizeWords(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s]+/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

// Resolve the images + display title for a collection slug. Shared by the
// page and generateMetadata so the two never drift apart.
function resolveCollection(slug: string): { images: string[]; title: string } {
  const matchingCollectionImages = allImages.filter(
    (src) => parseCollection(src).slug === slug,
  );

  const titleWords =
    matchingCollectionImages.length > 0
      ? normalizeWords(parseCollection(matchingCollectionImages[0]).name)
      : normalizeWords(slug.replace(/-/g, " "));

  const relatedImages = allImages.filter((src) => {
    const { name, slug: parsedSlug } = parseCollection(src);
    if (parsedSlug === slug) return true;
    const candidateWords = normalizeWords(name);
    return titleWords.every((word) => candidateWords.includes(word));
  });

  const images = Array.from(new Set(relatedImages));
  const title =
    images.length > 0
      ? parseCollection(images[0]).name
      : slug.replace(/-/g, " ");

  return { images, title };
}

export async function generateMetadata({
  params,
}: Params): Promise<Metadata> {
  const { slug } = await params;
  const { images, title } = resolveCollection(slug);
  if (images.length === 0) return { title: "Collection Not Found" };

  const description = `Photography by Kevin Chen — the ${title} collection.`;
  return {
    title,
    description,
    alternates: { canonical: `/gallery/collection/${slug}` },
    openGraph: {
      title: `${title} · Kevin Chen`,
      description,
      url: `/gallery/collection/${slug}`,
      images: [images[0]],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} · Kevin Chen`,
      description,
      images: [images[0]],
    },
  };
}

export default async function CollectionPage({ params }: Params) {
  const { slug } = await params;
  const { images, title } = resolveCollection(slug);

  if (images.length === 0) {
    notFound();
  }

  return (
    <>
      <JsonLd
        data={[
          imageGallerySchema({ title, slug, images }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Gallery", path: "/gallery" },
            { name: title, path: `/gallery/collection/${slug}` },
          ]),
        ]}
      />
      <CollectionViewer images={images} title={title} />
    </>
  );
}
