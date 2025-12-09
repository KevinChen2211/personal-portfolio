export const galleryImages = [
  "/gallery-images/Hello_Gorgeous.jpg",
  "/gallery-images/test.jpg",
  "/gallery-images/test.jpg",
  "/gallery-images/test.jpg",
];

export const parseCollection = (src: string) => {
  const filename = src.split("/").pop() ?? "";
  const base = filename.split(".")[0] ?? "";
  const withoutTrailingDigits = base.replace(/_\d+$/, "");
  const name = (withoutTrailingDigits || base || "Collection")
    .replace(/_/g, " ")
    .trim();
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return { name, slug };
};
