"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import IntroAnimation from "./components/IntroAnimation";
import SmoothScrollContainer from "./components/SmoothScrollContainer";
import ScrollIndicator from "./components/ScrollIndicator";
import ThemeToggle from "./components/ThemeToggle";
import { getActivePalette } from "./color-palettes";
import { useTheme } from "./components/ThemeProvider";
import Link from "next/link";
import { useScrollAnimation } from "./components/useScrollAnimation";
import { projects, type Project } from "./data/projects";
import MagicText from "./components/MagicText";

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
        className="absolute inset-0 opacity-50"
        style={{
          background: `radial-gradient(circle at 20% 50%, ${palette.primary}60 0%, transparent 50%),
                      radial-gradient(circle at 80% 80%, ${palette.secondary}60 0%, transparent 50%),
                      radial-gradient(circle at 40% 20%, ${palette.accent}50 0%, transparent 50%),
                      linear-gradient(135deg, ${palette.primary}25 0%, ${palette.secondary}25 50%, ${palette.accent}25 100%)`,
        }}
      />

      {/* Animated gradient orbs */}
      <div
        className="absolute w-96 h-96 md:w-[500px] md:h-[500px] rounded-full blur-3xl opacity-30"
        style={{
          background: `radial-gradient(circle, ${palette.primary} 0%, transparent 70%)`,
          top: "20%",
          left: "10%",
          animation: "float 20s ease-in-out infinite",
          filter: `blur(60px)`,
        }}
      />
      <div
        className="absolute w-96 h-96 md:w-[500px] md:h-[500px] rounded-full blur-3xl opacity-30"
        style={{
          background: `radial-gradient(circle, ${palette.secondary} 0%, transparent 70%)`,
          top: "60%",
          right: "15%",
          animation: "float 25s ease-in-out infinite reverse",
          filter: `blur(60px)`,
        }}
      />
      <div
        className="absolute w-80 h-80 md:w-[400px] md:h-[400px] rounded-full blur-3xl opacity-25"
        style={{
          background: `radial-gradient(circle, ${palette.accent} 0%, transparent 70%)`,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          animation: "float 30s ease-in-out infinite",
          filter: `blur(50px)`,
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
      className={`h-screen snap-start flex items-center justify-center px-6 sm:px-10 md:px-16 relative z-10 overflow-hidden ${className}`}
      style={{
        opacity: isVisible ? 1 : 0.4,
        transform: `translateY(${isVisible ? 0 : 20}px) scale(${
          isVisible ? 1 : 0.98
        })`,
        transition:
          "opacity 1s cubic-bezier(0.4, 0, 0.2, 1), transform 1s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      {children}
    </section>
  );
};

// Animated Project Card Component with mouse tracking hover effect
const AnimatedProjectCard = ({
  project,
  index,
  palette,
}: {
  project: Project;
  index: number;
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
      className="project-card relative rounded-xl cursor-pointer overflow-hidden group"
      style={
        {
          opacity: cardVisible ? 1 : 0,
          transform: `translateY(${cardVisible ? 0 : 50}px) scale(${
            cardVisible ? 1 : 0.95
          })`,
          transitionDelay: `${index * 100}ms`,
          transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
          backgroundColor: `rgba(${palette.primary}15)`,
          borderRadius: "16px",
          position: "relative",
          minHeight: "350px",
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
        className="relative p-6 rounded-lg flex flex-col h-full transition-all duration-300"
        style={{
          backgroundColor: palette.surface,
          borderRadius: "inherit",
          position: "absolute",
          inset: "1px",
          zIndex: 2,
          minHeight: "calc(100% - 2px)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          boxShadow: isNearby
            ? `0 8px 32px ${palette.primary}20, 0 0 0 1px ${palette.primary}15`
            : "0 4px 16px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div className="flex items-center gap-3 mb-4">
          {project.icon && <span className="text-3xl">{project.icon}</span>}
          <h3
            className="text-xl font-semibold flex-1"
            style={{ color: palette.text }}
          >
            {project.title}
          </h3>
        </div>
        <p
          className="text-sm mb-4 leading-relaxed flex-shrink-0"
          style={{ color: palette.textSecondary }}
        >
          {project.description}
        </p>
        <div className="flex-shrink-0">
          <ul className="space-y-1.5">
            {project.highlights.slice(0, 2).map((highlight, idx) => (
              <li
                key={idx}
                className="flex items-start text-xs leading-relaxed"
                style={{ color: palette.textSecondary }}
              >
                <span
                  className="mr-2 mt-1 flex-shrink-0"
                  style={{ color: palette.primary }}
                >
                  •
                </span>
                <span className="line-clamp-2">{highlight}</span>
              </li>
            ))}
            {project.highlights.length > 2 && (
              <li
                className="text-xs italic mt-1"
                style={{ color: palette.textSecondary, opacity: 0.7 }}
              >
                +{project.highlights.length - 2} more achievements
              </li>
            )}
          </ul>
        </div>
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
      className="p-5 sm:p-7 rounded-xl transition-all duration-500 hover:scale-[1.02] hover:shadow-lg group"
      style={{
        backgroundColor: palette.surface,
        border: `1px solid ${palette.border}`,
        opacity: articleVisible ? 1 : 0,
        transform: `translateX(${articleVisible ? 0 : -30}px)`,
        transitionDelay: `${post * 150}ms`,
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
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
      className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:scale-110 hover:shadow-md"
      style={{
        backgroundColor: palette.border,
        color: palette.text,
        opacity: skillVisible ? 1 : 1,
        transform: `scale(${skillVisible ? 1 : 0.9})`,
        transitionDelay: `${index * 50}ms`,
        border: `1px solid ${palette.primary}20`,
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
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
  const [showContent, setShowContent] = useState(false);

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
      // Start showing content slightly before intro completes for seamless transition
      setTimeout(() => {
        setShowContent(true);
      }, 2200);
    } else {
      // If no intro, show content immediately
      setShowContent(true);
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
        className={`relative transition-opacity duration-1000 ease-in-out ${
          showContent ? "opacity-100" : "opacity-0"
        }`}
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
            <div className="max-w-5xl w-full text-center">
              <h1
                className={`text-6xl sm:text-8xl md:text-9xl font-bold mb-6 transition-all duration-1000 ease-out ${
                  showContent
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
                style={{
                  backgroundImage: `linear-gradient(135deg, ${palette.text}, ${palette.primary})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  letterSpacing: "-0.02em",
                  transitionDelay: showIntro ? "0.3s" : "0s",
                  textShadow: `0 0 40px ${palette.primary}20`,
                }}
              >
                Kevin Chen
              </h1>
              <p
                className={`text-xl sm:text-2xl md:text-3xl mb-6 font-medium transition-all duration-700 ease-out ${
                  showContent
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
                style={{
                  color: palette.primary,
                  transitionDelay: showIntro ? "0.5s" : "0s",
                  letterSpacing: "0.02em",
                }}
              >
                Engineer & <MagicText>Creative Developer</MagicText>
              </p>
              <p
                className={`text-lg sm:text-xl md:text-2xl mb-8 transition-all duration-700 ease-out ${
                  showContent
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
                style={{
                  color: palette.textSecondary,
                  transitionDelay: showIntro ? "0.7s" : "0s",
                }}
              >
                Welcome to my Website!
              </p>
              <p
                className={`text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed transition-all duration-700 ease-out ${
                  showContent
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
                style={{
                  color: palette.textSecondary,
                  transitionDelay: showIntro ? "0.9s" : "0s",
                  lineHeight: "1.8",
                }}
              >
                Find out more about what im up to and the projects i've worked
                on.
              </p>
            </div>
          </Section>

          {/* About Me Section */}
          <Section>
            <div className="max-w-5xl w-full h-full flex flex-col justify-center py-8">
              <div className="text-center mb-12 flex-shrink-0">
                <h2
                  className="text-4xl sm:text-6xl md:text-7xl font-bold mb-6 transition-all duration-300 hover:scale-105"
                  style={{
                    backgroundImage: `linear-gradient(135deg, ${palette.text}, ${palette.primary})`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    letterSpacing: "-0.02em",
                  }}
                >
                  About Me
                </h2>
                <div
                  className="w-32 h-1.5 mx-auto rounded-full relative overflow-hidden"
                  style={{
                    background: `linear-gradient(90deg, ${palette.primary}, ${palette.secondary}, ${palette.accent})`,
                    boxShadow: `0 0 20px ${palette.primary}40`,
                  }}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6 flex-1 min-h-0">
                {/* Left Column - Bio */}
                <div
                  className="p-6 sm:p-8 rounded-xl transition-all duration-500 hover:shadow-xl hover:scale-[1.02] flex flex-col group"
                  style={{
                    backgroundColor: palette.surface,
                    border: `1px solid ${palette.border}`,
                    backdropFilter: "blur(10px)",
                    WebkitBackdropFilter: "blur(10px)",
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <div className="flex-1">
                    <h3
                      className="text-xl sm:text-2xl font-bold mb-5 flex items-center gap-3"
                      style={{ color: palette.text }}
                    >
                      <span
                        className="text-3xl"
                        style={{ color: palette.primary }}
                      >
                        👨‍💻
                      </span>
                      Who I Am
                    </h3>
                    <p
                      className="text-base sm:text-lg leading-relaxed mb-4 transition-all duration-300 hover:text-opacity-80"
                      style={{
                        color: palette.textSecondary,
                        lineHeight: "1.8",
                      }}
                    >
                      I love to build things and push myself to see what i can
                      create.
                    </p>
                    <p
                      className="text-base sm:text-lg leading-relaxed  mb-4 transition-all duration-300 hover:text-opacity-80"
                      style={{
                        color: palette.textSecondary,
                        lineHeight: "1.8",
                      }}
                    >
                      Im a learner and always looking for opportunities to
                      refine my skills and expand my technical capabilities.
                    </p>
                    <p
                      className="text-base sm:text-lg leading-relaxed  mb-4 transition-all duration-300 hover:text-opacity-80"
                      style={{
                        color: palette.textSecondary,
                        lineHeight: "1.8",
                      }}
                    >
                      Im passionate about technology and its intergration in
                      everyday life. If youd like to know more about me feel
                      free to reach out and checkout my blog!
                    </p>
                  </div>
                </div>

                {/* Right Column - Skills & Interests */}
                <div className="flex flex-col gap-6">
                  {/* Skills */}
                  <div
                    className="p-6 sm:p-8 rounded-xl transition-all duration-500 hover:shadow-xl hover:scale-[1.02] flex-1 group"
                    style={{
                      backgroundColor: palette.surface,
                      border: `1px solid ${palette.border}`,
                      backdropFilter: "blur(10px)",
                      WebkitBackdropFilter: "blur(10px)",
                      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <h3
                      className="text-xl sm:text-2xl font-bold mb-5 flex items-center gap-3"
                      style={{ color: palette.text }}
                    >
                      <span
                        className="text-3xl"
                        style={{ color: palette.primary }}
                      >
                        🛠️
                      </span>
                      Skills & Technologies
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "Devops (Jenkins)",
                        "AWS Services/Cloud systems",
                        "CICD/Testing",
                        "Mobile dev android/IOS",
                        "Scrum/ Engineering Practices",
                        "Embedded/Robotics",
                        "Web Development",
                        "Design",
                        "Professional Googler ",
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

                  {/* Interests */}
                  <div
                    className="p-6 sm:p-8 rounded-xl transition-all duration-500 hover:shadow-xl hover:scale-[1.02] group"
                    style={{
                      backgroundColor: palette.surface,
                      border: `1px solid ${palette.border}`,
                      backdropFilter: "blur(10px)",
                      WebkitBackdropFilter: "blur(10px)",
                      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <h3
                      className="text-xl sm:text-2xl font-bold mb-5 flex items-center gap-3"
                      style={{ color: palette.text }}
                    >
                      <span
                        className="text-3xl"
                        style={{ color: palette.primary }}
                      >
                        🌟
                      </span>
                      Beyond Code
                    </h3>
                    <p
                      className="text-base leading-relaxed transition-all duration-300 hover:text-opacity-80"
                      style={{
                        color: palette.textSecondary,
                        lineHeight: "1.8",
                      }}
                    >
                      Outside of engineering, I love to cook, travel, and
                      explore new places. I also enjoy photography, feel free to
                      check out my gallery below!
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 text-center flex-shrink-0">
                <Link
                  href="/about"
                  className="inline-block px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-110 hover:shadow-xl relative overflow-hidden group"
                  style={{
                    background: `linear-gradient(135deg, ${palette.primary}, ${palette.secondary})`,
                    color: palette.text,
                    boxShadow: `0 4px 20px ${palette.primary}40`,
                  }}
                >
                  <span className="relative z-10">View Full Experience →</span>
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(255,255,255,0.3), transparent)",
                    }}
                  />
                </Link>
              </div>
            </div>
          </Section>

          {/* Projects Section */}
          <Section>
            <div className="max-w-6xl w-full">
              <h2
                className="text-5xl sm:text-6xl md:text-7xl font-bold mb-16 text-center"
                style={{
                  backgroundImage: `linear-gradient(135deg, ${palette.text}, ${palette.primary})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  letterSpacing: "-0.02em",
                }}
              >
                Projects
              </h2>
              <div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                id="project-cards"
              >
                {projects.slice(0, 3).map((project, index) => (
                  <AnimatedProjectCard
                    key={project.title}
                    project={project}
                    index={index}
                    palette={palette}
                  />
                ))}
              </div>
              <div className="mt-12 text-center">
                <Link
                  href="/projects"
                  className="inline-block px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-110 hover:shadow-xl relative overflow-hidden group"
                  style={{
                    background: `linear-gradient(135deg, ${palette.primary}, ${palette.secondary})`,
                    color: palette.text,
                    boxShadow: `0 4px 20px ${palette.primary}40`,
                  }}
                >
                  <span className="relative z-10">Find out more</span>
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(255,255,255,0.3), transparent)",
                    }}
                  />
                </Link>
              </div>
            </div>
          </Section>

          {/* Blog Section */}
          <Section>
            <div className="max-w-4xl w-full h-full flex flex-col justify-center py-8">
              <h2
                className="text-4xl sm:text-5xl md:text-6xl font-bold mb-8 text-center flex-shrink-0"
                style={{
                  backgroundImage: `linear-gradient(135deg, ${palette.text}, ${palette.primary})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  letterSpacing: "-0.02em",
                }}
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
                  className="inline-block px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-110 hover:shadow-xl relative overflow-hidden group"
                  style={{
                    background: `linear-gradient(135deg, ${palette.primary}, ${palette.secondary})`,
                    color: palette.text,
                    boxShadow: `0 4px 20px ${palette.primary}40`,
                  }}
                >
                  <span className="relative z-10">Find out more</span>
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(255,255,255,0.3), transparent)",
                    }}
                  />
                </Link>
              </div>
            </div>
          </Section>

          {/* Gallery Section */}
          <Section>
            <div className="max-w-4xl w-full text-center">
              <h2
                className="text-5xl sm:text-6xl md:text-7xl font-bold mb-12"
                style={{
                  backgroundImage: `linear-gradient(135deg, ${palette.text}, ${palette.primary})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  letterSpacing: "-0.02em",
                }}
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
                className="inline-block px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-110 hover:shadow-xl relative overflow-hidden group"
                style={{
                  background: `linear-gradient(135deg, ${palette.primary}, ${palette.secondary})`,
                  color: palette.text,
                  boxShadow: `0 4px 20px ${palette.primary}40`,
                }}
              >
                <span className="relative z-10">Find out more</span>
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(255,255,255,0.3), transparent)",
                  }}
                />
              </Link>
            </div>
          </Section>

          {/* Contact Section */}
          <Section>
            <div className="max-w-2xl w-full text-center">
              <h2
                className="text-5xl sm:text-6xl md:text-7xl font-bold mb-12"
                style={{
                  backgroundImage: `linear-gradient(135deg, ${palette.text}, ${palette.primary})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  letterSpacing: "-0.02em",
                }}
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
                  className="px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-110 hover:shadow-xl relative overflow-hidden group"
                  style={{
                    background: `linear-gradient(135deg, ${palette.primary}, ${palette.secondary})`,
                    color: palette.text,
                    boxShadow: `0 4px 20px ${palette.primary}40`,
                  }}
                >
                  <span className="relative z-10">LinkedIn</span>
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(255,255,255,0.3), transparent)",
                    }}
                  />
                </Link>
                <Link
                  href="https://github.com/KevinChen2211"
                  target="_blank"
                  rel="noreferrer"
                  className="px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-110 hover:shadow-xl relative overflow-hidden group"
                  style={{
                    background: `linear-gradient(135deg, ${palette.primary}, ${palette.secondary})`,
                    color: palette.text,
                    boxShadow: `0 4px 20px ${palette.primary}40`,
                  }}
                >
                  <span className="relative z-10">GitHub</span>
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(255,255,255,0.3), transparent)",
                    }}
                  />
                </Link>
              </div>
            </div>
          </Section>
        </SmoothScrollContainer>
      </div>
    </>
  );
}
