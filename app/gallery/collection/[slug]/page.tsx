import { allImages, parseCollection } from "../../data";
import CollectionViewer from "./CollectionViewer";

type Params = {
  params: Promise<{ slug: string }>;
};

// Allow visiting any slug even if it's not statically generated
export const dynamicParams = true;

export function generateStaticParams() {
  const uniqueSlugs = Array.from(
    new Set(allImages.map((src) => parseCollection(src).slug))
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

export default async function CollectionPage({ params }: Params) {
  const { slug } = await params;

  const matchingCollectionImages = allImages.filter(
    (src) => parseCollection(src).slug === slug
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

  const uniqueImages = Array.from(new Set(relatedImages));

  const title =
    uniqueImages.length > 0
      ? parseCollection(uniqueImages[0]).name
      : slug.replace(/-/g, " ");

  return <CollectionViewer images={uniqueImages} title={title} />;
}
