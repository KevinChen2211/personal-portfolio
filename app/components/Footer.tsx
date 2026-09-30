import { siteConfig } from "../lib/site";

// Puts the name, role and city that searches for Kevin match on into visible
// text. Only the scrolling pages use it: the full-screen gallery views have no
// room for it, and the contact page carries a short bio instead.
export default function Footer() {
  return (
    <footer
      className="px-6 pb-10 md:pb-14 text-center text-xs md:text-sm tracking-wide"
      style={{
        color: "#2C2C2C",
        fontFamily: "var(--font-serif)",
        opacity: 0.7,
      }}
    >
      {`${siteConfig.name} · ${siteConfig.jobTitle} at ${siteConfig.employer.name} · ${siteConfig.location.locality}`}
    </footer>
  );
}
