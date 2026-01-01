"use client";

import { useEffect, useState } from "react";
import { blogPosts } from "../data/blogs";
import { projects } from "../data/projects";

// Extract images from blog content
function getFirstImage(content: string): string | null {
  const imageMatch = content.match(/!\[IMAGE:(.+?)\]/);
  return imageMatch ? imageMatch[1] : null;
}

// Get ALL images for preloading (used on landing page)
const getAllImages = (): string[] => {
  // Landing page images
  const landingImages = [
    "/images/KevinChen.jpg",
    "/images/Gallery.jpg",
    "/images/Projects.jpg",
    "/images/Gallery2.jpg",
    "/images/Journal.jpg",
    "/images/Gallery3.jpg",
    "/images/Contact.jpg",
  ];

  // Projects page images
  const projectImages = projects
    .map((project) => project.image)
    .filter((img): img is string => img !== undefined);

  // Gallery page images
  const galleryImages = [
    "/gallery-images/Hello_Gorgeous1.jpg",
    "/gallery-images/Sean_x_Amasi2.jpg",
    "/gallery-images/AnnMarie_X_Liam1.JPG",
  ];

  // Journal page images
  const journalImages = blogPosts
    .map((post) => getFirstImage(post.content))
    .filter((img): img is string => img !== null);

  // Combine all images and remove duplicates
  const allImages = [
    ...landingImages,
    ...projectImages,
    ...galleryImages,
    ...journalImages,
  ];
  return Array.from(new Set(allImages));
};

// Preload images
const preloadImages = (imageUrls: string[]): Promise<void> => {
  return Promise.all(
    imageUrls.map(
      (url) =>
        new Promise<void>((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve();
          img.onerror = () => resolve(); // Resolve even on error to not block
          img.src = url;
        })
    )
  ).then(() => {});
};

// Preload fonts
const preloadFonts = (): Promise<void> => {
  return new Promise((resolve) => {
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        // Preload custom fonts - try to load all font variations
        const fontPromises = [
          // Load Juana font variations
          document.fonts.load('400 1em "Juana"'),
          document.fonts.load('400 italic 1em "Juana"'),
          // Load Playfair Display (fallback)
          document.fonts.load('400 1em "Playfair Display"'),
          document.fonts.load('400 italic 1em "Playfair Display"'),
        ];
        Promise.all(fontPromises)
          .then(() => {
            // Wait a bit more to ensure fonts are rendered
            setTimeout(() => resolve(), 200);
          })
          .catch(() => resolve()); // Resolve even on error
      });
    } else {
      // Fallback if fonts API not available
      setTimeout(() => resolve(), 700);
    }
  });
};

type LoadingScreenProps = {
  onComplete: () => void;
  minDisplayTime?: number;
};

export default function LoadingScreen({
  onComplete,
  minDisplayTime = 800,
}: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const startTime = Date.now();
    // Preload ALL images from all pages (only shown on landing page)
    const images = getAllImages();

    const loadAssets = async () => {
      try {
        // Load fonts first
        await preloadFonts();
        setProgress(20);

        // Then load all images from all pages
        if (images.length > 0) {
          // Load images in batches to show progress
          const batchSize = Math.ceil(images.length / 4);
          for (let i = 0; i < images.length; i += batchSize) {
            const batch = images.slice(i, i + batchSize);
            await preloadImages(batch);
            // Update progress: 20% (fonts) + 60% (images) = 80%
            setProgress(20 + Math.floor((i + batch.length) / images.length * 60));
          }
        }
        setProgress(80);

        // Ensure minimum display time
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, minDisplayTime - elapsed);
        await new Promise((resolve) => setTimeout(resolve, remaining));

        setProgress(100);
        setTimeout(() => {
          setIsLoading(false);
          setTimeout(() => onComplete(), 300); // Fade out delay
        }, 100);
      } catch (error) {
        console.error("Error loading assets:", error);
        // Still complete loading even on error
        setIsLoading(false);
        setTimeout(() => onComplete(), 300);
      }
    };

    loadAssets();
  }, [minDisplayTime, onComplete]);

  if (!isLoading && progress === 100) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center transition-opacity duration-300"
      style={{
        backgroundColor: "#FAF2E6",
        opacity: isLoading ? 1 : 0,
        pointerEvents: isLoading ? "auto" : "none",
      }}
    >
      <div className="text-center">
        <div
          className="text-4xl md:text-5xl font-bold mb-8"
          style={{
            color: "#2C2C2C",
            fontFamily:
              "'Juana', var(--font-display), 'Playfair Display', 'Times New Roman', serif",
          }}
        >
          KEVIN CHEN
        </div>
        <div className="w-64 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#2C2C2C] transition-all duration-300 ease-out rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}

