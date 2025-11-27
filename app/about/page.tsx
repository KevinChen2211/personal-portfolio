"use client";

import { getActivePalette } from "../color-palettes";
import { useTheme } from "../components/ThemeProvider";
import ThemeToggle from "../components/ThemeToggle";
import Link from "next/link";
import React, { useRef, useEffect, useState } from "react";

export default function AboutPage() {
  const { theme } = useTheme();
  const palette = getActivePalette(theme);

  const bioRef = useRef<HTMLDivElement>(null);
  const experienceRef = useRef<HTMLDivElement>(null);
  const skillsRef = useRef<HTMLDivElement>(null);

  // Use IntersectionObserver for regular page scrolling
  const [bioVisible, setBioVisible] = React.useState(false);
  const [experienceVisible, setExperienceVisible] = React.useState(false);
  const [skillsVisible, setSkillsVisible] = React.useState(false);

  React.useEffect(() => {
    const observers: IntersectionObserver[] = [];

    if (bioRef.current) {
      const observer = new IntersectionObserver(
        ([entry]) => setBioVisible(entry.isIntersecting),
        { threshold: 0.2 }
      );
      observer.observe(bioRef.current);
      observers.push(observer);
    }

    if (experienceRef.current) {
      const observer = new IntersectionObserver(
        ([entry]) => setExperienceVisible(entry.isIntersecting),
        { threshold: 0.1 }
      );
      observer.observe(experienceRef.current);
      observers.push(observer);
    }

    if (skillsRef.current) {
      const observer = new IntersectionObserver(
        ([entry]) => setSkillsVisible(entry.isIntersecting),
        { threshold: 0.1 }
      );
      observer.observe(skillsRef.current);
      observers.push(observer);
    }

    return () => {
      observers.forEach((obs) => obs.disconnect());
    };
  }, []);

  return (
    <div
      className="min-h-screen px-6 sm:px-10 py-16 relative"
      style={{
        backgroundColor: palette.background,
        color: palette.text,
      }}
    >
      <ThemeToggle />
      <div className="max-w-4xl mx-auto">
        <Link
          href="/"
          className="inline-block mb-8 text-lg transition-all duration-300 hover:underline hover:translate-x-[-4px]"
          style={{ color: palette.primary }}
        >
          ← Back to Home
        </Link>
        <h1
          className="text-5xl sm:text-6xl font-bold mb-12 transition-all duration-700 hover:scale-105"
          style={{
            color: palette.text,
            opacity: bioVisible ? 1 : 0,
            transform: `translateY(${bioVisible ? 0 : 30}px)`,
          }}
        >
          About Me
        </h1>
        <div
          ref={bioRef}
          className="p-8 rounded-lg mb-8 transition-all duration-500 hover:shadow-lg hover:scale-[1.02]"
          style={{
            backgroundColor: palette.surface,
            border: `1px solid ${palette.border}`,
            opacity: bioVisible ? 1 : 0,
            transform: `translateY(${bioVisible ? 0 : 30}px)`,
            transition: "all 0.5s ease-out",
          }}
        >
          <p
            className="text-lg mb-6 leading-relaxed transition-all duration-300 hover:text-opacity-80"
            style={{ color: palette.textSecondary }}
          >
            I currently hold a Bachelor of Engineering (Computer and Network
            Engineering) (Honours)/Bachelor of Computer Science from RMIT
            University. I am an engineer and developer driven by a passion for
            building meaningful, impactful projects. I'm constantly exploring
            new ideas and challenging myself to see what I can create.
          </p>
          <p
            className="text-lg mb-6 leading-relaxed transition-all duration-300 hover:text-opacity-80"
            style={{ color: palette.textSecondary }}
          >
            My expertise spans full-stack development, computer engineering,
            robotics, and design. I love to learn and always looking for
            opportunities to refine my skills and expand my technical
            capabilities.
          </p>
          <p
            className="text-lg mb-6 leading-relaxed transition-all duration-300 hover:text-opacity-80"
            style={{ color: palette.textSecondary }}
          >
            Outside of engineering, I love to cook, travel, and explore new
            places.
          </p>
        </div>

        {/* Job History Section */}
        <div
          ref={experienceRef}
          className="p-8 rounded-lg mb-8 transition-all duration-500 hover:shadow-lg hover:scale-[1.01]"
          style={{
            backgroundColor: palette.surface,
            border: `1px solid ${palette.border}`,
            opacity: experienceVisible ? 1 : 0,
            transform: `translateY(${experienceVisible ? 0 : 30}px)`,
            transition: "all 0.5s ease-out",
          }}
        >
          <h2
            className="text-3xl font-bold mb-8 transition-all duration-300 hover:scale-105"
            style={{ color: palette.text }}
          >
            Experience
          </h2>

          <div className="space-y-8">
            {/* RMIT BattleBots */}
            <div className="group transition-all duration-300 hover:translate-x-2">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
                <h3
                  className="text-xl font-semibold transition-all duration-300 group-hover:text-opacity-80"
                  style={{ color: palette.text }}
                >
                  RMIT BattleBots (President & Founder)
                </h3>
                <span
                  className="text-sm mt-1 sm:mt-0 px-3 py-1 rounded-full transition-all duration-300 group-hover:bg-opacity-20"
                  style={{
                    color: palette.textSecondary,
                    backgroundColor: `${palette.primary}15`,
                  }}
                >
                  01/2024 - Present
                </span>
              </div>
              <ul className="space-y-2 ml-4">
                <li
                  className="flex items-start transition-all duration-200 hover:translate-x-1 cursor-default"
                  style={{ color: palette.textSecondary }}
                >
                  <span
                    className="mr-2 transition-all duration-200 group-hover:scale-125"
                    style={{ color: palette.primary }}
                  >
                    •
                  </span>
                  <span
                    className="transition-all duration-200 hover:text-opacity-100"
                    style={{ opacity: 0.9 }}
                  >
                    Led 80+ students through 4 robot design cycles, engineering,
                    and competitions.
                  </span>
                </li>
                <li
                  className="flex items-start transition-all duration-200 hover:translate-x-1 cursor-default"
                  style={{ color: palette.textSecondary }}
                >
                  <span
                    className="mr-2 transition-all duration-200 group-hover:scale-125"
                    style={{ color: palette.primary }}
                  >
                    •
                  </span>
                  <span
                    className="transition-all duration-200 hover:text-opacity-100"
                    style={{ opacity: 0.9 }}
                  >
                    Participated and won state competitions and received
                    additional funding.
                  </span>
                </li>
                <li
                  className="flex items-start transition-all duration-200 hover:translate-x-1 cursor-default"
                  style={{ color: palette.textSecondary }}
                >
                  <span
                    className="mr-2 transition-all duration-200 group-hover:scale-125"
                    style={{ color: palette.primary }}
                  >
                    •
                  </span>
                  <span
                    className="transition-all duration-200 hover:text-opacity-100"
                    style={{ opacity: 0.9 }}
                  >
                    Organized weekly workshops across mechanical, electrical,
                    and software disciplines.
                  </span>
                </li>
                <li
                  className="flex items-start transition-all duration-200 hover:translate-x-1 cursor-default"
                  style={{ color: palette.textSecondary }}
                >
                  <span
                    className="mr-2 transition-all duration-200 group-hover:scale-125"
                    style={{ color: palette.primary }}
                  >
                    •
                  </span>
                  <span
                    className="transition-all duration-200 hover:text-opacity-100"
                    style={{ opacity: 0.9 }}
                  >
                    Collaborated with RMIT and I Belong to deliver STEM
                    workshops to high schools.
                  </span>
                </li>
                <li
                  className="flex items-start transition-all duration-200 hover:translate-x-1 cursor-default"
                  style={{ color: palette.textSecondary }}
                >
                  <span
                    className="mr-2 transition-all duration-200 group-hover:scale-125"
                    style={{ color: palette.primary }}
                  >
                    •
                  </span>
                  <span
                    className="transition-all duration-200 hover:text-opacity-100"
                    style={{ opacity: 0.9 }}
                  >
                    Initiated sponsorships and organized club events, growing
                    industry and student engagement.
                  </span>
                </li>
                <li
                  className="flex items-start transition-all duration-200 hover:translate-x-1 cursor-default"
                  style={{ color: palette.textSecondary }}
                >
                  <span
                    className="mr-2 transition-all duration-200 group-hover:scale-125"
                    style={{ color: palette.primary }}
                  >
                    •
                  </span>
                  <span
                    className="transition-all duration-200 hover:text-opacity-100"
                    style={{ opacity: 0.9 }}
                  >
                    Organized networking events with industry professionals.
                  </span>
                </li>
              </ul>
            </div>

            {/* Bosch */}
            <div
              className="group pt-6 border-t transition-all duration-300 hover:translate-x-2"
              style={{ borderColor: palette.border }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
                <h3
                  className="text-xl font-semibold transition-all duration-300 group-hover:text-opacity-80"
                  style={{ color: palette.text }}
                >
                  Bosch (DevOps Software Engineer)
                </h3>
                <span
                  className="text-sm mt-1 sm:mt-0 px-3 py-1 rounded-full transition-all duration-300 group-hover:bg-opacity-20"
                  style={{
                    color: palette.textSecondary,
                    backgroundColor: `${palette.primary}15`,
                  }}
                >
                  08/2022 – 08/2024
                </span>
              </div>
              <ul className="space-y-2 ml-4">
                <li
                  className="flex items-start transition-all duration-200 hover:translate-x-1 cursor-default"
                  style={{ color: palette.textSecondary }}
                >
                  <span
                    className="mr-2 transition-all duration-200 group-hover:scale-125"
                    style={{ color: palette.primary }}
                  >
                    •
                  </span>
                  <span
                    className="transition-all duration-200 hover:text-opacity-100"
                    style={{ opacity: 0.9 }}
                  >
                    Boosted software release efficiency by 40% by optimizing
                    CI/CD pipelines and Agile workflows
                  </span>
                </li>
                <li
                  className="flex items-start transition-all duration-200 hover:translate-x-1 cursor-default"
                  style={{ color: palette.textSecondary }}
                >
                  <span
                    className="mr-2 transition-all duration-200 group-hover:scale-125"
                    style={{ color: palette.primary }}
                  >
                    •
                  </span>
                  <span
                    className="transition-all duration-200 hover:text-opacity-100"
                    style={{ opacity: 0.9 }}
                  >
                    Applied MISRA-C coding guidelines and ISO26262 standards for
                    reliability and compliance
                  </span>
                </li>
                <li
                  className="flex items-start transition-all duration-200 hover:translate-x-1 cursor-default"
                  style={{ color: palette.textSecondary }}
                >
                  <span
                    className="mr-2 transition-all duration-200 group-hover:scale-125"
                    style={{ color: palette.primary }}
                  >
                    •
                  </span>
                  <span
                    className="transition-all duration-200 hover:text-opacity-100"
                    style={{ opacity: 0.9 }}
                  >
                    Designed unit testing frameworks and scalable architecture
                    for embedded software.
                  </span>
                </li>
                <li
                  className="flex items-start transition-all duration-200 hover:translate-x-1 cursor-default"
                  style={{ color: palette.textSecondary }}
                >
                  <span
                    className="mr-2 transition-all duration-200 group-hover:scale-125"
                    style={{ color: palette.primary }}
                  >
                    •
                  </span>
                  <span
                    className="transition-all duration-200 hover:text-opacity-100"
                    style={{ opacity: 0.9 }}
                  >
                    Worked in automotive systems using tools such as DOORs and
                    Jira.
                  </span>
                </li>
              </ul>
            </div>

            {/* HIVE Avionics */}
            <div
              className="group pt-6 border-t transition-all duration-300 hover:translate-x-2"
              style={{ borderColor: palette.border }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
                <h3
                  className="text-xl font-semibold transition-all duration-300 group-hover:text-opacity-80"
                  style={{ color: palette.text }}
                >
                  HIVE (Avionics Bay Software Engineer)
                </h3>
                <span
                  className="text-sm mt-1 sm:mt-0 px-3 py-1 rounded-full transition-all duration-300 group-hover:bg-opacity-20"
                  style={{
                    color: palette.textSecondary,
                    backgroundColor: `${palette.primary}15`,
                  }}
                >
                  01/2021 – 01/2022
                </span>
              </div>
              <ul className="space-y-2 ml-4">
                <li
                  className="flex items-start transition-all duration-200 hover:translate-x-1 cursor-default"
                  style={{ color: palette.textSecondary }}
                >
                  <span
                    className="mr-2 transition-all duration-200 group-hover:scale-125"
                    style={{ color: palette.primary }}
                  >
                    •
                  </span>
                  <span
                    className="transition-all duration-200 hover:text-opacity-100"
                    style={{ opacity: 0.9 }}
                  >
                    Developed C++ firmware for real-time avionics-to-ground
                    communication
                  </span>
                </li>
                <li
                  className="flex items-start transition-all duration-200 hover:translate-x-1 cursor-default"
                  style={{ color: palette.textSecondary }}
                >
                  <span
                    className="mr-2 transition-all duration-200 group-hover:scale-125"
                    style={{ color: palette.primary }}
                  >
                    •
                  </span>
                  <span
                    className="transition-all duration-200 hover:text-opacity-100"
                    style={{ opacity: 0.9 }}
                  >
                    Integrated sensors and telemetry to ensure accurate
                    in-flight diagnostics
                  </span>
                </li>
              </ul>
            </div>

            {/* HIVE Head of Recovery */}
            <div
              className="group pt-6 border-t transition-all duration-300 hover:translate-x-2"
              style={{ borderColor: palette.border }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
                <h3
                  className="text-xl font-semibold transition-all duration-300 group-hover:text-opacity-80"
                  style={{ color: palette.text }}
                >
                  HIVE (Head of Recovery)
                </h3>
                <span
                  className="text-sm mt-1 sm:mt-0 px-3 py-1 rounded-full transition-all duration-300 group-hover:bg-opacity-20"
                  style={{
                    color: palette.textSecondary,
                    backgroundColor: `${palette.primary}15`,
                  }}
                >
                  09/2020 – 01/2021
                </span>
              </div>
              <ul className="space-y-2 ml-4">
                <li
                  className="flex items-start transition-all duration-200 hover:translate-x-1 cursor-default"
                  style={{ color: palette.textSecondary }}
                >
                  <span
                    className="mr-2 transition-all duration-200 group-hover:scale-125"
                    style={{ color: palette.primary }}
                  >
                    •
                  </span>
                  <span
                    className="transition-all duration-200 hover:text-opacity-100"
                    style={{ opacity: 0.9 }}
                  >
                    Designed and tested black powder charge systems and
                    parachute deployment for recovery
                  </span>
                </li>
                <li
                  className="flex items-start transition-all duration-200 hover:translate-x-1 cursor-default"
                  style={{ color: palette.textSecondary }}
                >
                  <span
                    className="mr-2 transition-all duration-200 group-hover:scale-125"
                    style={{ color: palette.primary }}
                  >
                    •
                  </span>
                  <span
                    className="transition-all duration-200 hover:text-opacity-100"
                    style={{ opacity: 0.9 }}
                  >
                    Achieved 100% retrieval success across 5 launches
                  </span>
                </li>
              </ul>
            </div>

            {/* UNIQLO */}
            <div
              className="group pt-6 border-t transition-all duration-300 hover:translate-x-2"
              style={{ borderColor: palette.border }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
                <h3
                  className="text-xl font-semibold transition-all duration-300 group-hover:text-opacity-80"
                  style={{ color: palette.text }}
                >
                  UNIQLO (Retail)
                </h3>
                <span
                  className="text-sm mt-1 sm:mt-0 px-3 py-1 rounded-full transition-all duration-300 group-hover:bg-opacity-20"
                  style={{
                    color: palette.textSecondary,
                    backgroundColor: `${palette.primary}15`,
                  }}
                >
                  03/2020 – 09/2023
                </span>
              </div>
              <ul className="space-y-2 ml-4">
                <li
                  className="flex items-start transition-all duration-200 hover:translate-x-1 cursor-default"
                  style={{ color: palette.textSecondary }}
                >
                  <span
                    className="mr-2 transition-all duration-200 group-hover:scale-125"
                    style={{ color: palette.primary }}
                  >
                    •
                  </span>
                  <span
                    className="transition-all duration-200 hover:text-opacity-100"
                    style={{ opacity: 0.9 }}
                  >
                    Provided high-quality customer service and maintained
                    merchandising standards
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div
          ref={skillsRef}
          className="p-8 rounded-lg transition-all duration-500 hover:shadow-lg hover:scale-[1.01]"
          style={{
            backgroundColor: palette.surface,
            border: `1px solid ${palette.border}`,
            opacity: skillsVisible ? 1 : 0,
            transform: `translateY(${skillsVisible ? 0 : 30}px)`,
            transition: "all 0.5s ease-out",
          }}
        >
          <h3
            className="text-2xl font-semibold mb-6 transition-all duration-300 hover:scale-105"
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
              "UI/UX",
              "GraphQL",
              "PostgreSQL",
              "AWS",
              "Docker",
              "Git",
            ].map((skill, index) => (
              <span
                key={skill}
                className="px-4 py-2 rounded-full text-sm transition-all duration-300 hover:scale-110 hover:shadow-md cursor-default"
                style={{
                  backgroundColor: palette.border,
                  color: palette.text,
                  transitionDelay: `${index * 30}ms`,
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
