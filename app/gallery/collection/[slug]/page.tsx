import Link from "next/link";
import { galleryImages, parseCollection } from "../../data";

type Params = {
  params: { slug: string };
};

export default function CollectionPage({ params }: Params) {
  const { slug } = params;
  const collectionImages = galleryImages.filter(
    (src) => parseCollection(src).slug === slug
  );

  const title =
    collectionImages.length > 0
      ? parseCollection(collectionImages[0]).name
      : slug.replace(/-/g, " ");

  return (
    <div
      className="min-h-screen px-6 sm:px-10 py-16"
      style={{ backgroundColor: "#141414", color: "#f5f5f5" }}
    >
      <div className="max-w-6xl mx-auto">
        <Link
          href="/gallery"
          className="inline-block mb-8 text-lg transition-all duration-300 hover:underline hover:translate-x-[-4px]"
          style={{ color: "#f5f5f5" }}
        >
          ← Back to Gallery
        </Link>
        <h1 className="text-4xl sm:text-5xl font-bold mb-6">{title}</h1>
        {collectionImages.length === 0 ? (
          <p className="text-sm text-gray-300">
            No images found for this collection.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {collectionImages.map((src, idx) => (
              <div
                key={`${src}-${idx}`}
                className="overflow-hidden rounded-lg border border-[#2a2a2a] bg-[#1b1b1b]"
              >
                <img
                  src={src}
                  alt={title}
                  className="w-full h-full object-cover"
                  style={{ aspectRatio: "3 / 4" }}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
