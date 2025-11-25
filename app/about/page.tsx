import { activePalette } from "../color-palettes";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div
      className="min-h-screen px-6 sm:px-10 py-16"
      style={{
        backgroundColor: activePalette.background,
        color: activePalette.text,
      }}
    >
      <div className="max-w-4xl mx-auto">
        <Link
          href="/"
          className="inline-block mb-8 text-lg hover:underline"
          style={{ color: activePalette.primary }}
        >
          ← Back to Home
        </Link>
        <h1
          className="text-5xl sm:text-6xl font-bold mb-12"
          style={{ color: activePalette.text }}
        >
          About Me
        </h1>
        <div
          className="p-8 rounded-lg mb-8"
          style={{
            backgroundColor: activePalette.surface,
            border: `1px solid ${activePalette.border}`,
          }}
        >
          <p
            className="text-lg mb-6 leading-relaxed"
            style={{ color: activePalette.textSecondary }}
          >
            I'm a software engineer passionate about creating meaningful digital
            experiences. With a focus on clean code, elegant design, and
            user-centered thinking, I build applications that solve real problems.
          </p>
          <p
            className="text-lg mb-6 leading-relaxed"
            style={{ color: activePalette.textSecondary }}
          >
            My expertise spans full-stack development, with particular interest in
            modern web technologies, performance optimization, and creating
            intuitive user interfaces.
          </p>
          <p
            className="text-lg mb-6 leading-relaxed"
            style={{ color: activePalette.textSecondary }}
          >
            This is the expanded about page with more detailed information about my
            background, experience, and interests.
          </p>
        </div>
        <div
          className="p-8 rounded-lg"
          style={{
            backgroundColor: activePalette.surface,
            border: `1px solid ${activePalette.border}`,
          }}
        >
          <h3
            className="text-2xl font-semibold mb-6"
            style={{ color: activePalette.text }}
          >
            Skills & Technologies
          </h3>
          <div className="flex flex-wrap gap-3">
            {[
              "React",
              "TypeScript",
              "Next.js",
              "Node.js",
              "Python",
              "Design",
              "UI/UX",
              "GraphQL",
              "PostgreSQL",
              "AWS",
              "Docker",
              "Git",
            ].map((skill) => (
              <span
                key={skill}
                className="px-4 py-2 rounded-full text-sm"
                style={{
                  backgroundColor: activePalette.border,
                  color: activePalette.text,
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

