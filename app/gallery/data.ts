// Images that appear in the main gallery page
export const galleryImages = [
  "/gallery-images/Hello_Gorgeous1.jpg",
  "/gallery-images/test.jpg",
];

// Images that only appear in collection pages (not in main gallery)
export const collectionImages = [
  "/gallery-images/Hello_Gorgeous2.jpg",
  "/gallery-images/Hello_Gorgeous3.jpg",
  "/gallery-images/Hello_Gorgeous4.JPG",
  "/gallery-images/Hello_Gorgeous5.jpg",
  "/gallery-images/Hello_Gorgeous6.jpg",
  "/gallery-images/Hello_Gorgeous7.jpg",
  "/gallery-images/Hello_Gorgeous8.jpg",
];

// All images combined (for collection pages to search through)
export const allImages = [...galleryImages, ...collectionImages];

export const parseCollection = (src: string) => {
  const filename = src.split("/").pop() ?? "";
  const base = filename.split(".")[0] ?? "";
  // Remove trailing digits (optionally preceded by underscore or hyphen) to treat numbered images as the same collection.
  const withoutTrailingDigits = base.replace(/[_-]?\d+$/, "");
  const name = (withoutTrailingDigits || base || "Collection")
    .replace(/_/g, " ")
    .trim();
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return { name, slug };
};
