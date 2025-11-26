"use client";

import React, { useEffect, useState, useMemo } from "react";
import IntroAnimation from "./components/IntroAnimation";
import SmoothScrollContainer from "./components/SmoothScrollContainer";
import { activePalette } from "./color-palettes";
import Link from "next/link";

// Gradient Background Component
const GradientBackground = () => {
  const shapes = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      size: Math.random() * 100 + 50,
      left: Math.random() * 100,
      delay: Math.random() * 20,
      duration: Math.random() * 20 + 15,
      opacity: Math.random() * 0.3 + 0.1,
    }));
  }, []);

  const additionalShapes = useMemo(() => {
    return Array.from({ length: 15 }, (_, i) => ({
      id: `shape-${i}`,
      size: Math.random() * 80 + 30,
      left: Math.random() * 100,
      delay: Math.random() * 25,
      duration: Math.random() * 30 + 25, // Slower duration
      opacity: Math.random() * 0.2 + 0.05,
      shape: Math.random() > 0.5 ? "circle" : "square",
      rotation: Math.random() * 360,
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Gradient background */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background: `radial-gradient(circle at 20% 50%, ${activePalette.primary}50 0%, transparent 50%),
                      radial-gradient(circle at 80% 80%, ${activePalette.secondary}50 0%, transparent 50%),
                      radial-gradient(circle at 40% 20%, ${activePalette.accent}40 0%, transparent 50%),
                      linear-gradient(135deg, ${activePalette.primary}20 0%, ${activePalette.secondary}20 50%, ${activePalette.accent}20 100%)`,
        }}
      />

      {/* Animated gradient orbs */}
      <div
        className="absolute w-96 h-96 rounded-full blur-3xl opacity-20"
        style={{
          background: `radial-gradient(circle, ${activePalette.primary} 0%, transparent 70%)`,
          top: "20%",
          left: "10%",
          animation: "float 20s ease-in-out infinite",
        }}
      />
      <div
        className="absolute w-96 h-96 rounded-full blur-3xl opacity-20"
        style={{
          background: `radial-gradient(circle, ${activePalette.secondary} 0%, transparent 70%)`,
          top: "60%",
          right: "15%",
          animation: "float 25s ease-in-out infinite reverse",
        }}
      />

      {/* Floating shapes */}
      {shapes.map((shape) => (
        <div
          key={shape.id}
          className="absolute rounded-full"
          style={{
            width: `${shape.size}px`,
            height: `${shape.size}px`,
            left: `${shape.left}%`,
            background: `radial-gradient(circle, ${
              activePalette.primary
            }${Math.floor(shape.opacity * 100)} 0%, transparent 70%)`,
            opacity: shape.opacity,
            animation: `floatUpSlow ${shape.duration}s linear infinite`,
            animationDelay: `${shape.delay}s`,
            bottom: "-100px",
            willChange: "transform",
          }}
        />
      ))}

      {/* Additional geometric shapes */}
      {additionalShapes.map((shape) => (
        <div
          key={shape.id}
          className="absolute"
          style={{
            width: `${shape.size}px`,
            height: `${shape.size}px`,
            left: `${shape.left}%`,
            borderRadius: shape.shape === "circle" ? "50%" : "8px",
            background: `linear-gradient(135deg, ${
              activePalette.secondary
            }${Math.floor(shape.opacity * 100)}, ${
              activePalette.accent
            }${Math.floor(shape.opacity * 50)})`,
            opacity: shape.opacity,
            animation: `floatUpSlow ${shape.duration}s linear infinite`,
            animationDelay: `${shape.delay}s`,
            bottom: "-100px",
            transform: `rotate(${shape.rotation}deg)`,
            willChange: "transform",
          }}
        />
      ))}
    </div>
  );
};

// Section component
const Section = React.forwardRef<
  HTMLElement,
  {
    children: React.ReactNode;
    className?: string;
  }
>(({ children, className = "" }, ref) => {
  return (
    <section
      ref={ref}
      className={`h-screen snap-start flex items-center justify-center px-6 sm:px-10 relative z-10 overflow-hidden ${className}`}
    >
      {children}
    </section>
  );
});

Section.displayName = "Section";

export default function Home() {
  const [showIntro, setShowIntro] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setShowIntro(true);
  }, []);

  const handleIntroComplete = () => {
    setShowIntro(false);
  };

  if (!isClient) {
    return null;
  }

  return (
    <>
      {showIntro && <IntroAnimation onComplete={handleIntroComplete} />}
      <div
        className="relative"
        style={{
          backgroundColor: activePalette.background,
          color: activePalette.text,
        }}
      >
        <GradientBackground />
        <SmoothScrollContainer>
          {/* Home Section */}
          <Section>
            <div className="max-w-4xl w-full text-center">
              <h1
                className={`text-6xl sm:text-8xl font-bold mb-6 transition-opacity duration-1000 ${
                  showIntro ? "opacity-0" : "opacity-100"
                }`}
                style={{
                  color: activePalette.text,
                  transitionDelay: showIntro ? "1.5s" : "0s",
                }}
              >
                Kevin Chen
              </h1>
              <p
                className="text-xl sm:text-2xl mb-8 transition-all duration-700"
                style={{ color: activePalette.textSecondary }}
              >
                Software Engineer & Creative Developer
              </p>
              <p
                className="text-lg sm:text-xl max-w-2xl mx-auto transition-all duration-700"
                style={{ color: activePalette.textSecondary }}
              >
                Building digital experiences that blend functionality with
                elegant design.
              </p>
            </div>
          </Section>

          {/* Projects Section */}
          <Section>
            <div className="max-w-6xl w-full">
              <h2
                className="text-5xl sm:text-6xl font-bold mb-12 text-center"
                style={{ color: activePalette.text }}
              >
                Projects
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((project) => (
                  <div
                    key={project}
                    className="p-6 rounded-lg transition-all duration-300 hover:scale-105"
                    style={{
                      backgroundColor: activePalette.surface,
                      border: `1px solid ${activePalette.border}`,
                    }}
                  >
                    <div
                      className="h-48 rounded-md mb-4 flex items-center justify-center"
                      style={{
                        backgroundColor: activePalette.border,
                      }}
                    >
                      <span style={{ color: activePalette.textSecondary }}>
                        Project {project}
                      </span>
                    </div>
                    <h3
                      className="text-xl font-semibold mb-2"
                      style={{ color: activePalette.text }}
                    >
                      Project Title {project}
                    </h3>
                    <p style={{ color: activePalette.textSecondary }}>
                      Brief description of the project and its key features.
                      Placeholder content for project showcase.
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-12 text-center">
                <Link
                  href="/projects"
                  className="inline-block px-8 py-4 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
                  style={{
                    backgroundColor: activePalette.primary,
                    color: activePalette.text,
                  }}
                >
                  Find out more
                </Link>
              </div>
            </div>
          </Section>

          {/* Blog Section */}
          <Section>
            <div className="max-w-4xl w-full h-full flex flex-col justify-center py-8">
              <h2
                className="text-4xl sm:text-5xl font-bold mb-6 text-center flex-shrink-0"
                style={{ color: activePalette.text }}
              >
                Blog
              </h2>
              <div className="space-y-4 flex-1 min-h-0 overflow-hidden">
                {[1, 2, 3].map((post) => (
                  <article
                    key={post}
                    className="p-4 sm:p-6 rounded-lg transition-all duration-300 hover:scale-[1.02]"
                    style={{
                      backgroundColor: activePalette.surface,
                      border: `1px solid ${activePalette.border}`,
                    }}
                  >
                    <div
                      className="text-sm mb-2 font-medium"
                      style={{ color: activePalette.primary }}
                    >
                      {new Date().toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                    <h3
                      className="text-lg sm:text-xl font-semibold mb-2"
                      style={{ color: activePalette.text }}
                    >
                      Blog Post Title {post}
                    </h3>
                    <p
                      className="text-sm sm:text-base line-clamp-2"
                      style={{ color: activePalette.textSecondary }}
                    >
                      This is a placeholder for blog post content. Here you
                      would write about your thoughts, experiences, and insights
                      on software development, design, or other topics of
                      interest.
                    </p>
                  </article>
                ))}
              </div>
              <div className="mt-6 text-center flex-shrink-0">
                <Link
                  href="/blog"
                  className="inline-block px-8 py-4 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
                  style={{
                    backgroundColor: activePalette.primary,
                    color: activePalette.text,
                  }}
                >
                  Find out more
                </Link>
              </div>
            </div>
          </Section>

          {/* About Me Section */}
          <Section>
            <div className="max-w-4xl w-full">
              <h2
                className="text-5xl sm:text-6xl font-bold mb-12 text-center"
                style={{ color: activePalette.text }}
              >
                About Me
              </h2>
              <div
                className="p-8 rounded-lg"
                style={{
                  backgroundColor: activePalette.surface,
                  border: `1px solid ${activePalette.border}`,
                }}
              >
                <p
                  className="text-lg mb-6 leading-relaxed"
                  style={{ color: activePalette.textSecondary }}
                >
                  I'm a software engineer passionate about creating meaningful
                  digital experiences. With a focus on clean code, elegant
                  design, and user-centered thinking, I build applications that
                  solve real problems.
                </p>
                <p
                  className="text-lg mb-6 leading-relaxed"
                  style={{ color: activePalette.textSecondary }}
                >
                  My expertise spans full-stack development, with particular
                  interest in modern web technologies, performance optimization,
                  and creating intuitive user interfaces.
                </p>
                <div className="mt-8">
                  <h3
                    className="text-xl font-semibold mb-4"
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
              <div className="mt-8 text-center">
                <Link
                  href="/about"
                  className="inline-block px-8 py-4 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
                  style={{
                    backgroundColor: activePalette.primary,
                    color: activePalette.text,
                  }}
                >
                  Find out more
                </Link>
              </div>
            </div>
          </Section>

          {/* Contact Section */}
          <Section>
            <div className="max-w-2xl w-full text-center">
              <h2
                className="text-5xl sm:text-6xl font-bold mb-12"
                style={{ color: activePalette.text }}
              >
                Get In Touch
              </h2>
              <p
                className="text-xl mb-12"
                style={{ color: activePalette.textSecondary }}
              >
                I'm always open to discussing new projects, creative ideas, or
                opportunities to be part of your vision.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="https://www.linkedin.com/in/kevinsoftwarewiz"
                  target="_blank"
                  rel="noreferrer"
                  className="px-8 py-4 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
                  style={{
                    backgroundColor: activePalette.primary,
                    color: activePalette.text,
                  }}
                >
                  LinkedIn
                </Link>
                <a
                  href="mailto:contact@kevinchen.com"
                  className="px-8 py-4 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
                  style={{
                    backgroundColor: activePalette.surface,
                    color: activePalette.text,
                    border: `2px solid ${activePalette.primary}`,
                  }}
                >
                  Email Me
                </a>
              </div>
              <div className="mt-12">
                <Link
                  href="/contact"
                  className="inline-block px-8 py-4 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
                  style={{
                    backgroundColor: activePalette.primary,
                    color: activePalette.text,
                  }}
                >
                  Find out more
                </Link>
              </div>
            </div>
          </Section>

          {/* Duplicate section for infinite loop */}
          <Section className="duplicate">
            <div className="max-w-4xl w-full text-center">
              <h1
                className="text-6xl sm:text-8xl font-bold mb-6"
                style={{ color: activePalette.text }}
              >
                Kevin Chen
              </h1>
              <p
                className="text-xl sm:text-2xl mb-8"
                style={{ color: activePalette.textSecondary }}
              >
                Software Engineer & Creative Developer
              </p>
              <p
                className="text-lg sm:text-xl max-w-2xl mx-auto"
                style={{ color: activePalette.textSecondary }}
              >
                Building digital experiences that blend functionality with
                elegant design.
              </p>
            </div>
          </Section>
        </SmoothScrollContainer>
      </div>
    </>
  );
}
