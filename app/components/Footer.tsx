// Shared site footer used by the long-scroll pages (home, projects, journal,
// and their detail pages). Full-screen pages (gallery, contact) omit it.
export default function Footer() {
  return (
    <footer
      className="w-full py-12 flex justify-center items-center"
      style={{
        backgroundColor: "#FAF2E6",
        color: "#2C2C2C",
        fontFamily: "var(--font-serif)",
      }}
    >
      © Kevin Chen
    </footer>
  );
}
