"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { galleryImages, parseCollection, allImages } from "./data";
import Navbar from "../components/Navbar";

export default function GalleryPage() {
  const bgColor = "#FAF2E6";
  const textColor = "#FAF2E6";

  const trackRef = useRef<HTMLDivElement | null>(null);
  const imageRefs = useRef<(HTMLImageElement | null)[]>([]);
  const scrollToImageRef = useRef<((index: number) => void) | null>(null);
  const currentScrollPercentageRef = useRef<number>(-50);
  const expandedIndexRef = useRef<number | null>(null);

  const [expandedImageIndex, setExpandedImageIndex] = useState<number | null>(
    null
  );
  const [expandedImageSrc, setExpandedImageSrc] = useState<string | null>(null);
  const [expandedCollection, setExpandedCollection] = useState<{
    name: string;
    slug: string;
  } | null>(null);
  const [showCollectionTitle, setShowCollectionTitle] = useState(true);
  const [expandedImageStyle, setExpandedImageStyle] = useState<{
    top: number;
    left: number;
    width: number;
    height: number;
  } | null>(null);
  const [expandedObjectPosition, setExpandedObjectPosition] =
    useState<string>("100% center");
  const [isClosing, setIsClosing] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [hoveredTitle, setHoveredTitle] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionDirection, setTransitionDirection] = useState<
    "left" | "right" | null
  >(null);
  const [nextImageData, setNextImageData] = useState<{
    src: string;
    index: number;
    collection: { name: string; slug: string };
    objectPosition: string;
  } | null>(null);
  const [nextImageSlideIn, setNextImageSlideIn] = useState(false);
  const [disableCommitAnimation, setDisableCommitAnimation] = useState(false);
  const hasCollectionLink = !!expandedCollection?.slug;

  // Calculate collection info
  const getCollectionInfo = () => {
    if (!expandedImageSrc || !expandedCollection) return null;

    const collectionImages = allImages.filter(
      (src) => parseCollection(src).slug === expandedCollection.slug
    );

    const currentIndex = collectionImages.findIndex(
      (src) => src === expandedImageSrc
    );

    return {
      currentIndex: currentIndex >= 0 ? currentIndex + 1 : 1,
      total: collectionImages.length,
      images: collectionImages,
    };
  };

  const collectionInfo = getCollectionInfo();

  // Calculate gallery position info
  const getGalleryPositionInfo = () => {
    if (expandedImageIndex === null) return null;

    return {
      currentIndex: expandedImageIndex + 1,
      total: galleryImages.length,
    };
  };

  const galleryPositionInfo = getGalleryPositionInfo();

  // Get all collections (including current) that have images in galleryImages
  const getAllCollections = () => {
    if (!expandedCollection) return [];

    const collectionsMap = new Map<
      string,
      {
        name: string;
        galleryImageIndex: number;
        previewImage: string;
        isCurrent: boolean;
      }
    >();

    galleryImages.forEach((src, index) => {
      const { slug, name } = parseCollection(src);
      if (!collectionsMap.has(slug)) {
        collectionsMap.set(slug, {
          name,
          galleryImageIndex: index,
          previewImage: src,
          isCurrent: slug === expandedCollection.slug,
        });
      }
    });

    return Array.from(collectionsMap.values());
  };

  const allCollections = expandedImageIndex !== null ? getAllCollections() : [];

  useEffect(() => {
    expandedIndexRef.current = expandedImageIndex;
  }, [expandedImageIndex]);

  /* -------------------------------
     Disable vertical scrolling
  ------------------------------- */
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  /* -------------------------------
     Horizontal scroll + parallax
  ------------------------------- */
  useEffect(() => {
    const track = trackRef.current!;
    if (!track) return;

    let percentage = -50;
    let targetPercentage = percentage;
    let velocity = 60;
    let lastTime = performance.now();

    const images = track.getElementsByClassName("image");

    const calculateMaxScroll = () => {
      const trackRect = track.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const trackWidth = trackRect.width;
      const lastImage = images[images.length - 1] as HTMLElement;
      const imageWidth = lastImage.getBoundingClientRect().width;
      const distanceToMove = trackWidth - imageWidth / 2 - viewportWidth / 2;
      return -50 - (distanceToMove / trackWidth) * 100;
    };

    let maxScroll = calculateMaxScroll();
    window.addEventListener("resize", () => {
      maxScroll = calculateMaxScroll();
    });

    const clamp = (value: number) => Math.max(Math.min(value, 0), maxScroll);

    const scrollToImage = (imageIndex: number) => {
      if (imageIndex < 0 || imageIndex >= images.length) return;
      const targetImg = images[imageIndex] as HTMLElement;
      const rect = targetImg.getBoundingClientRect();
      const offsetX = window.innerWidth / 2 - (rect.left + rect.width / 2);
      const trackRect = track.getBoundingClientRect();
      const percentageAdjustment = (offsetX / trackRect.width) * 100;
      const newPercentage = clamp(targetPercentage + percentageAdjustment);
      percentage = newPercentage;
      targetPercentage = newPercentage;
      velocity = 0;
      track.style.transform = `translate(${percentage}%, -50%)`;
    };

    scrollToImageRef.current = scrollToImage;

    track.style.willChange = "transform";
    for (const img of images)
      (img as HTMLElement).style.willChange = "object-position";

    const handleWheel = (e: WheelEvent) => {
      if (expandedIndexRef.current !== null) return;
      e.preventDefault();
      const delta = e.deltaY * -0.02;
      targetPercentage = clamp(targetPercentage + delta);
      velocity = delta * 0.1;
    };
    window.addEventListener("wheel", handleWheel, { passive: false });

    const animate = (currentTime: number) => {
      const deltaTime = Math.min((currentTime - lastTime) / 16.67, 2);
      lastTime = currentTime;

      const isExpanded = expandedIndexRef.current !== null;

      if (isExpanded) {
        targetPercentage = percentage; // freeze track movement
        velocity = 0;
      } else if (Math.abs(velocity) > 0.01) {
        targetPercentage = clamp(targetPercentage + velocity);
        velocity *= 0.82;
      }

      const distance = targetPercentage - percentage;
      const lerpFactor = Math.abs(distance) > 1 ? 0.015 : 0.01;
      percentage += distance * lerpFactor;

      if (Math.abs(distance) < 0.01 && Math.abs(velocity) < 0.01)
        percentage = targetPercentage;

      // Update ref for external access
      currentScrollPercentageRef.current = percentage;

      track.style.transform = `translate(${percentage}%, -50%)`;

      // Parallax
      if (!isExpanded) {
        const totalImages = images.length;
        for (let i = 0; i < totalImages; i++) {
          const img = images[i] as HTMLElement;
          const relIndex = i / (totalImages - 1) - 0.5;
          const parallaxOffset = relIndex * 30;
          img.style.objectPosition = `${
            100 + percentage + parallaxOffset
          }% center`;
        }
      }

      requestAnimationFrame(animate);
    };

    animate(performance.now());

    return () => {
      window.removeEventListener("wheel", handleWheel);
      track.style.willChange = "auto";
      for (const img of images) (img as HTMLElement).style.willChange = "auto";
    };
  }, []);

  /* -------------------------------
     SHRINK EXPANDED IMAGE SEAMLESSLY
  ------------------------------- */
  const shrinkImage = () => {
    if (expandedImageIndex === null || isClosing) return;
    setShowCollectionTitle(false);
    const imageIndexToScroll = expandedImageIndex;
    const img = imageRefs.current[expandedImageIndex];
    if (!img) return;

    // Only translate the clicked image back to its current spot.
    // Delay briefly so the title can fade before shrink begins, then double-RAF to read layout.
    setTimeout(() => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const updatedImg = imageRefs.current[imageIndexToScroll];
          if (!updatedImg) return;

          // Force a reflow to ensure layout is updated
          updatedImg.offsetHeight;

          const rect = updatedImg.getBoundingClientRect();
          const currentObjectPosition =
            getComputedStyle(updatedImg).objectPosition;

          const targetRect = {
            top: rect.top + rect.height / 2,
            left: rect.left + rect.width / 2,
            width: rect.width,
            height: rect.height,
          };

          setIsClosing(true);
          setExpandedObjectPosition(currentObjectPosition);
          setExpandedImageStyle(targetRect);

          // Remove expanded image after animation
          setTimeout(() => {
            setExpandedImageIndex(null);
            setExpandedImageStyle(null);
            setExpandedImageSrc(null);
            setExpandedCollection(null);
            setShowCollectionTitle(true);
            setIsClosing(false);
            setIsOpening(false);
            setHoveredTitle(false);
          }, 1000);
        });
      });
    }, 120);
  };

  /* -------------------------------
     Close on Escape
  ------------------------------- */
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && expandedImageIndex !== null) shrinkImage();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [expandedImageIndex]);

  /* -------------------------------
     Shrink on wheel while expanded
  ------------------------------- */
  useEffect(() => {
    const handleExpandedWheel = (e: WheelEvent) => {
      if (expandedIndexRef.current === null || isClosing || isTransitioning)
        return;
      e.preventDefault();
      shrinkImage();
    };
    window.addEventListener("wheel", handleExpandedWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleExpandedWheel);
  }, [expandedImageIndex, isClosing, isTransitioning]);

  /* -------------------------------
     Handle collection transition animation
  ------------------------------- */
  useEffect(() => {
    if (!isTransitioning || !nextImageData || !transitionDirection) return;

    // Hide title during transition
    setShowCollectionTitle(false);
    setNextImageSlideIn(false);

    // Transition duration matches existing (1000ms)
    const transitionDuration = 1000;

    // Start the slide-in animation after a brief delay to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      // Trigger the slide-in animation
      setNextImageSlideIn(true);

      // After transition completes, swap the images
      setTimeout(() => {
        const newImg = imageRefs.current[nextImageData.index];
        if (!newImg) {
          setIsTransitioning(false);
          setTransitionDirection(null);
          setNextImageData(null);
          setNextImageSlideIn(false);
          setShowCollectionTitle(true);
          return;
        }

        // First, reset transition state to hide the transition image
        setIsTransitioning(false);
        setTransitionDirection(null);
        setNextImageSlideIn(false);
        setDisableCommitAnimation(true);
        // Then update to the new image state (this happens after transition is hidden)
        requestAnimationFrame(() => {
          setExpandedImageIndex(nextImageData.index);
          setExpandedImageSrc(nextImageData.src);
          setExpandedCollection(nextImageData.collection);
          setExpandedObjectPosition(nextImageData.objectPosition);
          setExpandedImageStyle({
            top: window.innerHeight / 2,
            left: window.innerWidth / 2,
            width: window.innerWidth,
            height: window.innerHeight,
          });

          // Clear next image data and show title
          setNextImageData(null);
          setShowCollectionTitle(true);
          requestAnimationFrame(() => {
            setDisableCommitAnimation(false);
          });
        });
      }, transitionDuration);
    }, 50);

    return () => clearTimeout(timeoutId);
  }, [isTransitioning, nextImageData, transitionDirection]);

  return (
    <div
      className="min-h-screen w-full relative overflow-hidden"
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      <Navbar isExpanded={expandedImageIndex !== null} isClosing={isClosing} />

      {/* IMAGE TRACK */}
      <div
        ref={trackRef}
        className="absolute top-3/5 left-1/2 flex gap-[4vmin] select-none"
        style={{ transform: "translate(-50%, -50%)" }}
      >
        {galleryImages.map((src, i) => (
          <img
            key={i}
            ref={(el) => {
              imageRefs.current[i] = el;
            }}
            src={src}
            className="image cursor-pointer transition-all duration-500 ease-out hover:scale-105"
            draggable={false}
            onClick={() => {
              const img = imageRefs.current[i];
              if (!img) return;
              const rect = img.getBoundingClientRect();
              setIsOpening(true);
              setIsClosing(false);
              setExpandedImageIndex(i);
              setExpandedImageSrc(src);
              setExpandedCollection(parseCollection(src));
              setShowCollectionTitle(true);
              const currentObjectPosition =
                getComputedStyle(img).objectPosition;

              setExpandedImageStyle({
                top: rect.top + rect.height / 2,
                left: rect.left + rect.width / 2,
                width: rect.width,
                height: rect.height,
              });
              setExpandedObjectPosition(currentObjectPosition);
              // Start fade in after a brief delay to ensure opacity starts at 0
              requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                  setExpandedImageStyle({
                    top: window.innerHeight / 2,
                    left: window.innerWidth / 2,
                    width: window.innerWidth,
                    height: window.innerHeight,
                  });
                  // Fade in the background
                  setTimeout(() => {
                    setIsOpening(false);
                  }, 10);
                });
              });
            }}
            style={{
              width: "40vmin",
              height: "56vmin",
              aspectRatio: "40 / 56",
              objectFit: "cover",
              objectPosition: "100% center",
              flexShrink: 0,
            }}
          />
        ))}
      </div>

      {/* EXPANDED IMAGE */}
      {expandedImageIndex !== null &&
        expandedImageStyle &&
        expandedImageSrc &&
        expandedCollection && (
          <>
            <div
              className="fixed inset-0 z-40 transition-opacity duration-1000"
              style={{
                backgroundColor: "#141414",
                opacity: isClosing || isOpening ? 0 : 1,
              }}
            />
            {hasCollectionLink ? (
              <Link
                href={`/gallery/collection/${expandedCollection.slug}`}
                className="fixed top-1/2 left-1/2 z-60 -translate-x-1/2 -translate-y-1/2 text-center text-4xl sm:text-5xl md:text-6xl tracking-tight transition-opacity duration-500 hover:opacity-80"
                style={{
                  color: textColor,
                  opacity: showCollectionTitle ? 1 : 0,
                  pointerEvents: showCollectionTitle ? "auto" : "none",
                }}
                onMouseEnter={() => setHoveredTitle(true)}
                onMouseLeave={() => setHoveredTitle(false)}
              >
                <span className="relative inline-block">
                  {expandedCollection.name}
                  {collectionInfo && (
                    <sup
                      className="absolute left-full text-2xl sm:text-3xl md:text-4xl ml-2 transition-opacity duration-300 whitespace-nowrap"
                      style={{
                        opacity: hoveredTitle ? 0.8 : 0,
                        pointerEvents: "none",
                      }}
                    >
                      {collectionInfo.total}
                    </sup>
                  )}
                </span>
              </Link>
            ) : (
              <div
                className="fixed top-1/2 left-1/2 z-60 -translate-x-1/2 -translate-y-1/2 text-center text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight transition-opacity duration-500"
                style={{
                  color: textColor,
                  opacity: showCollectionTitle ? 1 : 0,
                  pointerEvents: showCollectionTitle ? "auto" : "none",
                  fontFamily:
                    "'Juana', var(--font-display), 'Playfair Display', 'Times New Roman', serif",
                }}
                onMouseEnter={() => setHoveredTitle(true)}
                onMouseLeave={() => setHoveredTitle(false)}
              >
                <span className="relative inline-block">
                  {expandedCollection.name}
                  {collectionInfo && (
                    <sup
                      className="absolute left-full text-2xl sm:text-3xl md:text-4xl ml-2 transition-opacity duration-300 whitespace-nowrap"
                      style={{
                        opacity: hoveredTitle ? 0.8 : 0,
                        pointerEvents: "none",
                      }}
                    >
                      {collectionInfo.total}
                    </sup>
                  )}
                </span>
              </div>
            )}

            {/* Gallery position number at bottom middle */}
            {galleryPositionInfo && (
              <div
                className="fixed bottom-8 left-1/2 z-60 -translate-x-1/2 text-center text-lg sm:text-xl md:text-2xl transition-opacity duration-500"
                style={{
                  color: textColor,
                  opacity: showCollectionTitle ? 1 : 0,
                }}
              >
                {galleryPositionInfo.currentIndex} — {galleryPositionInfo.total}
              </div>
            )}

            {/* All collections preview in bottom right */}
            {allCollections.length > 0 && (
              <div
                className="fixed bottom-8 right-8 flex flex-row gap-3 max-w-[60vw] overflow-x-auto transition-opacity duration-500"
                style={{
                  opacity: showCollectionTitle ? 1 : 0,
                  zIndex: 60,
                  pointerEvents: showCollectionTitle ? "auto" : "none",
                }}
              >
                {allCollections.map((collection, idx) => {
                  const currentCollectionIndex = allCollections.findIndex(
                    (c) => c.isCurrent
                  );
                  const direction =
                    idx < currentCollectionIndex ? "left" : "right";

                  return (
                    <div
                      key={collection.galleryImageIndex}
                      className="cursor-pointer relative flex-shrink-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (
                          isTransitioning ||
                          isClosing ||
                          collection.isCurrent
                        )
                          return;

                        const img =
                          imageRefs.current[collection.galleryImageIndex];
                        if (!img) return;

                        const rect = img.getBoundingClientRect();
                        const currentObjectPosition =
                          getComputedStyle(img).objectPosition;

                        setIsTransitioning(true);
                        setTransitionDirection(direction);
                        setNextImageData({
                          src: collection.previewImage,
                          index: collection.galleryImageIndex,
                          collection: parseCollection(collection.previewImage),
                          objectPosition: currentObjectPosition,
                        });
                      }}
                    >
                      <img
                        src={collection.previewImage}
                        alt={collection.name}
                        className="relative z-10 w-20 h-28 sm:w-24 sm:h-32 object-cover rounded-sm"
                        style={{
                          border: collection.isCurrent
                            ? "2px solid rgba(250, 242, 230, 0.8)"
                            : "2px solid transparent",
                        }}
                        draggable={false}
                        loading="lazy"
                      />
                      <div className="absolute bottom-0 left-0 right-0 z-0 p-1 bg-black bg-opacity-60 rounded-b-sm">
                        <p className="text-xs text-white truncate">
                          {collection.name}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            {/* Current expanded image */}
            {expandedImageSrc && (
              <img
                src={expandedImageSrc}
                draggable={false}
                className={
                  disableCommitAnimation
                    ? "transition-none"
                    : "transition-all duration-1000 ease-out"
                }
                style={{
                  width: `${expandedImageStyle.width}px`,
                  height: `${expandedImageStyle.height}px`,
                  aspectRatio: "40 / 56",
                  objectFit: "cover",
                  objectPosition: expandedObjectPosition,
                  position: "fixed",
                  top: `${expandedImageStyle.top}px`,
                  left: `${expandedImageStyle.left}px`,
                  transform:
                    isTransitioning && transitionDirection
                      ? `translate(calc(-50% ${
                          transitionDirection === "left" ? "+" : "-"
                        } 100vw), -50%)`
                      : "translate(-50%, -50%)",
                  zIndex: isTransitioning ? 50 : 50,
                }}
              />
            )}

            {/* Next image sliding in */}
            {isTransitioning &&
              nextImageData &&
              transitionDirection &&
              expandedImageStyle && (
                <img
                  src={nextImageData.src}
                  draggable={false}
                  className="transition-all duration-1000 ease-out"
                  style={{
                    width: `${expandedImageStyle.width}px`,
                    height: `${expandedImageStyle.height}px`,
                    aspectRatio: "40 / 56",
                    objectFit: "cover",
                    objectPosition: nextImageData.objectPosition,
                    position: "fixed",
                    top: `${expandedImageStyle.top}px`,
                    left: `${expandedImageStyle.left}px`,
                    transform: nextImageSlideIn
                      ? "translate(-50%, -50%)"
                      : transitionDirection === "left"
                      ? "translate(calc(-50% - 100vw), -50%)"
                      : "translate(calc(-50% + 100vw), -50%)",
                    zIndex: 51,
                  }}
                />
              )}
          </>
        )}
    </div>
  );
}
