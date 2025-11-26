"use client";

import React, { useEffect, useState, useMemo, useRef } from "react";
import IntroAnimation from "./components/IntroAnimation";
import SmoothScrollContainer from "./components/SmoothScrollContainer";
import ScrollIndicator from "./components/ScrollIndicator";
import ThemeToggle from "./components/ThemeToggle";
import { getActivePalette } from "./color-palettes";
import { useTheme } from "./components/ThemeProvider";
import Link from "next/link";
import { useScrollAnimation } from "./components/useScrollAnimation";

// Gradient Background Component
const GradientBackground = ({
  palette,
}: {
  palette: ReturnType<typeof getActivePalette>;
}) => {
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
          background: `radial-gradient(circle at 20% 50%, ${palette.primary}50 0%, transparent 50%),
                      radial-gradient(circle at 80% 80%, ${palette.secondary}50 0%, transparent 50%),
                      radial-gradient(circle at 40% 20%, ${palette.accent}40 0%, transparent 50%),
                      linear-gradient(135deg, ${palette.primary}20 0%, ${palette.secondary}20 50%, ${palette.accent}20 100%)`,
        }}
      />

      {/* Animated gradient orbs */}
      <div
        className="absolute w-96 h-96 rounded-full blur-3xl opacity-20"
        style={{
          background: `radial-gradient(circle, ${palette.primary} 0%, transparent 70%)`,
          top: "20%",
          left: "10%",
          animation: "float 20s ease-in-out infinite",
        }}
      />
      <div
        className="absolute w-96 h-96 rounded-full blur-3xl opacity-20"
        style={{
          background: `radial-gradient(circle, ${palette.secondary} 0%, transparent 70%)`,
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
            background: `radial-gradient(circle, ${palette.primary}${Math.floor(
              shape.opacity * 100
            )} 0%, transparent 70%)`,
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
              palette.secondary
            }${Math.floor(shape.opacity * 100)}, ${palette.accent}${Math.floor(
              shape.opacity * 50
            )})`,
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

// Section component with scroll animations
const Section = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const { isVisible } = useScrollAnimation(sectionRef, {
    threshold: 0.2,
  });

  return (
    <section
      ref={sectionRef}
      className={`h-screen snap-start flex items-center justify-center px-6 sm:px-10 relative z-10 overflow-hidden ${className}`}
      style={{
        opacity: isVisible ? 1 : 0.3,
        transform: `translateY(${isVisible ? 0 : 30}px) scale(${
          isVisible ? 1 : 0.95
        })`,
        transition: "opacity 0.8s ease-out, transform 0.8s ease-out",
      }}
    >
      {children}
    </section>
  );
};

// Animated Project Card Component with mouse tracking hover effect
const AnimatedProjectCard = ({
  project,
  palette,
}: {
  project: number;
  palette: ReturnType<typeof getActivePalette>;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const { isVisible: cardVisible } = useScrollAnimation(cardRef, {
    threshold: 0.1,
  });

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isNearby, setIsNearby] = useState(false);

  useEffect(() => {
    const card = cardRef.current;
    const container = document.getElementById("project-cards");
    if (!card || !container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const cardRect = card.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();

      // Mouse position relative to card
      const x = e.clientX - cardRect.left;
      const y = e.clientY - cardRect.top;

      // Mouse position relative to container
      const containerX = e.clientX - containerRect.left;
      const containerY = e.clientY - containerRect.top;

      // Card center relative to container
      const cardCenterX =
        cardRect.left - containerRect.left + cardRect.width / 2;
      const cardCenterY =
        cardRect.top - containerRect.top + cardRect.height / 2;

      // Calculate distance from mouse to card center
      const distance = Math.sqrt(
        Math.pow(containerX - cardCenterX, 2) +
          Math.pow(containerY - cardCenterY, 2)
      );

      // Proximity threshold (adjust based on card size and gap)
      const proximityThreshold = 250; // pixels

      // Check if mouse is inside card or nearby
      const isInside =
        x >= 0 && x <= cardRect.width && y >= 0 && y <= cardRect.height;

      const isClose = distance < proximityThreshold;

      setIsNearby(isInside || isClose);

      if (isInside || isClose) {
        setMousePosition({ x, y });
        card.style.setProperty("--mouse-x", `${x}px`);
        card.style.setProperty("--mouse-y", `${y}px`);
      }
    };

    container.addEventListener("mousemove", handleMouseMove);

    const handleMouseLeave = () => {
      setIsNearby(false);
    };

    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  // Use white/light color for the gradient effect (works on both themes)
  const gradientColor1 = "rgba(255, 255, 255, 0.06)";
  const gradientColor2 = "rgba(255, 255, 255, 0.4)";

  return (
    <div
      ref={cardRef}
      className="project-card relative rounded-lg cursor-pointer"
      style={
        {
          opacity: cardVisible ? 1 : 0,
          transform: `translateY(${cardVisible ? 0 : 50}px)`,
          transitionDelay: `${project * 100}ms`,
          transition: "opacity 0.5s ease-out, transform 0.5s ease-out",
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          borderRadius: "10px",
          position: "relative",
          minHeight: "300px",
          "--mouse-x": "0px",
          "--mouse-y": "0px",
        } as React.CSSProperties & { "--mouse-x": string; "--mouse-y": string }
      }
    >
      {/* Gradient overlay - outer glow */}
      <div
        className={`card-gradient-before absolute inset-0 rounded-lg pointer-events-none transition-opacity duration-500 ${
          isNearby ? "card-nearby" : ""
        }`}
        style={{
          background: `radial-gradient(800px circle at ${mousePosition.x}px ${mousePosition.y}px, ${gradientColor1}, transparent 40%)`,
          borderRadius: "inherit",
          opacity: 0,
          zIndex: 3,
        }}
      />

      {/* Gradient overlay - inner bright spot */}
      <div
        className={`card-gradient-after absolute inset-0 rounded-lg pointer-events-none transition-opacity duration-500 ${
          isNearby ? "card-nearby" : ""
        }`}
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, ${gradientColor2}, transparent 40%)`,
          borderRadius: "inherit",
          opacity: 0,
          zIndex: 1,
        }}
      />

      {/* Card content - inset to show border/gradient */}
      <div
        className="relative p-6 rounded-lg flex flex-col"
        style={{
          backgroundColor: palette.surface,
          borderRadius: "inherit",
          position: "absolute",
          inset: "1px",
          zIndex: 2,
          minHeight: "calc(100% - 2px)",
        }}
      >
        <div
          className="h-48 rounded-md mb-4 flex items-center justify-center"
          style={{
            backgroundColor: palette.border,
          }}
        >
          <span style={{ color: palette.textSecondary }}>
            Project {project}
          </span>
        </div>
        <h3
          className="text-xl font-semibold mb-2"
          style={{ color: palette.text }}
        >
          Project Title {project}
        </h3>
        <p style={{ color: palette.textSecondary }}>
          Brief description of the project and its key features. Placeholder
          content for project showcase.
        </p>
      </div>
    </div>
  );
};

// Animated Blog Post Component
const AnimatedBlogPost = ({
  post,
  palette,
}: {
  post: number;
  palette: ReturnType<typeof getActivePalette>;
}) => {
  const articleRef = useRef<HTMLElement>(null);
  const { isVisible: articleVisible } = useScrollAnimation(articleRef, {
    threshold: 0.1,
  });

  return (
    <article
      ref={articleRef}
      className="p-4 sm:p-6 rounded-lg transition-all duration-500 hover:scale-[1.02]"
      style={{
        backgroundColor: palette.surface,
        border: `1px solid ${palette.border}`,
        opacity: articleVisible ? 1 : 0,
        transform: `translateX(${articleVisible ? 0 : -30}px)`,
        transitionDelay: `${post * 150}ms`,
      }}
    >
      <div
        className="text-sm mb-2 font-medium"
        style={{ color: palette.primary }}
      >
        {new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </div>
      <h3
        className="text-lg sm:text-xl font-semibold mb-2"
        style={{ color: palette.text }}
      >
        Blog Post Title {post}
      </h3>
      <p
        className="text-sm sm:text-base line-clamp-2"
        style={{ color: palette.textSecondary }}
      >
        This is a placeholder for blog post content. Here you would write about
        your thoughts, experiences, and insights on software development,
        design, or other topics of interest.
      </p>
    </article>
  );
};

// Animated Skill Badge Component
const AnimatedSkillBadge = ({
  skill,
  index,
  palette,
}: {
  skill: string;
  index: number;
  palette: ReturnType<typeof getActivePalette>;
}) => {
  const skillRef = useRef<HTMLSpanElement>(null);
  const { isVisible: skillVisible } = useScrollAnimation(skillRef, {
    threshold: 0.1,
  });

  return (
    <span
      ref={skillRef}
      className="px-4 py-2 rounded-full text-sm transition-all duration-500 hover:scale-110"
      style={{
        backgroundColor: palette.border,
        color: palette.text,
        opacity: skillVisible ? 1 : 0,
        transform: `scale(${skillVisible ? 1 : 0})`,
        transitionDelay: `${index * 50}ms`,
      }}
    >
      {skill}
    </span>
  );
};

export default function Home() {
  const { theme } = useTheme();
  const palette = getActivePalette(theme);
  const [showIntro, setShowIntro] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    // Check if user has already seen the intro in this session
    const hasSeenIntro = sessionStorage.getItem("hasSeenIntro");

    // Check if user is navigating back from another page
    const isNavigatingBack =
      typeof window !== "undefined" &&
      document.referrer !== "" &&
      document.referrer.includes(window.location.origin) &&
      !document.referrer.endsWith(window.location.pathname);

    // Only show intro on first visit, not when navigating back
    if (!hasSeenIntro && !isNavigatingBack) {
      setShowIntro(true);
    }
  }, []);

  const handleIntroComplete = () => {
    setShowIntro(false);
    sessionStorage.setItem("hasSeenIntro", "true");
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
          backgroundColor: palette.background,
          color: palette.text,
        }}
      >
        <GradientBackground palette={palette} />
        <ThemeToggle />
        <ScrollIndicator />
        <SmoothScrollContainer>
          {/* Home Section */}
          <Section>
            <div className="max-w-4xl w-full text-center">
              <h1
                className={`text-6xl sm:text-8xl font-bold mb-6 transition-opacity duration-1000 ${
                  showIntro ? "opacity-0" : "opacity-100"
                }`}
                style={{
                  color: palette.text,
                  transitionDelay: showIntro ? "1.5s" : "0s",
                }}
              >
                Kevin Chen
              </h1>
              <p
                className="text-xl sm:text-2xl mb-8 transition-all duration-700"
                style={{ color: palette.textSecondary }}
              >
                Software Engineer & Creative Developer
              </p>
              <p
                className="text-lg sm:text-xl max-w-2xl mx-auto transition-all duration-700"
                style={{ color: palette.textSecondary }}
              >
                Building digital experiences that blend functionality with
                elegant design.
              </p>
            </div>
          </Section>

          {/* About Me Section */}
          <Section>
            <div className="max-w-4xl w-full">
              <h2
                className="text-5xl sm:text-6xl font-bold mb-12 text-center"
                style={{ color: palette.text }}
              >
                About Me
              </h2>
              <div
                className="p-8 rounded-lg"
                style={{
                  backgroundColor: palette.surface,
                  border: `1px solid ${palette.border}`,
                }}
              >
                <p
                  className="text-lg mb-6 leading-relaxed"
                  style={{ color: palette.textSecondary }}
                >
                  I'm a software engineer passionate about creating meaningful
                  digital experiences. With a focus on clean code, elegant
                  design, and user-centered thinking, I build applications that
                  solve real problems.
                </p>
                <p
                  className="text-lg mb-6 leading-relaxed"
                  style={{ color: palette.textSecondary }}
                >
                  My expertise spans full-stack development, with particular
                  interest in modern web technologies, performance optimization,
                  and creating intuitive user interfaces.
                </p>
                <div className="mt-8">
                  <h3
                    className="text-xl font-semibold mb-4"
                    style={{ color: palette.text }}
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
                    ].map((skill, index) => (
                      <AnimatedSkillBadge
                        key={skill}
                        skill={skill}
                        index={index}
                        palette={palette}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-8 text-center">
                <Link
                  href="/about"
                  className="inline-block px-8 py-4 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
                  style={{
                    backgroundColor: palette.primary,
                    color: palette.text,
                  }}
                >
                  Find out more
                </Link>
              </div>
            </div>
          </Section>

          {/* Projects Section */}
          <Section>
            <div className="max-w-6xl w-full">
              <h2
                className="text-5xl sm:text-6xl font-bold mb-12 text-center"
                style={{ color: palette.text }}
              >
                Projects
              </h2>
              <div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                id="project-cards"
              >
                {[1, 2, 3].map((project) => (
                  <AnimatedProjectCard
                    key={project}
                    project={project}
                    palette={palette}
                  />
                ))}
              </div>
              <div className="mt-12 text-center">
                <Link
                  href="/projects"
                  className="inline-block px-8 py-4 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
                  style={{
                    backgroundColor: palette.primary,
                    color: palette.text,
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
                style={{ color: palette.text }}
              >
                Blog
              </h2>
              <div className="space-y-4 flex-1 min-h-0 overflow-hidden">
                {[1, 2, 3].map((post) => (
                  <AnimatedBlogPost key={post} post={post} palette={palette} />
                ))}
              </div>
              <div className="mt-6 text-center flex-shrink-0">
                <Link
                  href="/blog"
                  className="inline-block px-8 py-4 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
                  style={{
                    backgroundColor: palette.primary,
                    color: palette.text,
                  }}
                >
                  Find out more
                </Link>
              </div>
            </div>
          </Section>

          {/* Gallery Section */}
          <Section>
            <div className="max-w-4xl w-full text-center">
              <h2
                className="text-5xl sm:text-6xl font-bold mb-12"
                style={{ color: palette.text }}
              >
                Gallery
              </h2>
              <p
                className="text-xl mb-12"
                style={{ color: palette.textSecondary }}
              >
                Explore my photography and visual work.
              </p>
              <Link
                href="/gallery"
                className="inline-block px-8 py-4 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
                style={{
                  backgroundColor: palette.primary,
                  color: palette.text,
                }}
              >
                Find out more
              </Link>
            </div>
          </Section>

          {/* Contact Section */}
          <Section>
            <div className="max-w-2xl w-full text-center">
              <h2
                className="text-5xl sm:text-6xl font-bold mb-12"
                style={{ color: palette.text }}
              >
                Get In Touch
              </h2>
              <p
                className="text-xl mb-12"
                style={{ color: palette.textSecondary }}
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
                    backgroundColor: palette.primary,
                    color: palette.text,
                  }}
                >
                  LinkedIn
                </Link>
                <Link
                  href="https://github.com/KevinChen2211"
                  target="_blank"
                  rel="noreferrer"
                  className="px-8 py-4 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
                  style={{
                    backgroundColor: palette.primary,
                    color: palette.text,
                  }}
                >
                  GitHub
                </Link>
              </div>
            </div>
          </Section>
        </SmoothScrollContainer>
      </div>
    </>
  );
}
