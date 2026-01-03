"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { galleryImages, parseCollection, allImages } from "./data";
import Navbar from "../components/Navbar";

function ScrollingDigit({ value }: { value: number }) {
  const [current, setCurrent] = useState(value);

  useEffect(() => {
    setCurrent(value);
  }, [value]);

  return (
    <div
      style={{
        height: "1.2em",
        width: "0.6em",
        overflow: "hidden",
        display: "inline-block",
        verticalAlign: "top",
      }}
    >
      <div
        style={{
          transform: `translateY(${-current * 1.2}em)`,
          transition: "transform 0.4s ease-out",
        }}
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => (
          <div
            key={d}
            style={{
              height: "1.2em",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {d}
          </div>
        ))}
      </div>
    </div>
  );
}

function ScrollingNumber({ value = 0 }: { value: number }) {
  const [prevLength, setPrevLength] = useState(1);
  const digits = value
    .toString()
    .split("")
    .map((d) => parseInt(d, 10));

  useEffect(() => {
    setPrevLength(digits.length);
  }, [digits.length]);

  // Pad with empty slots to maintain positions
  const maxLength = Math.max(prevLength, digits.length);
  const paddedDigits = new Array(maxLength - digits.length)
    .fill(null)
    .concat(digits);

  return (
    <span style={{ display: "inline-flex", alignItems: "center" }}>
      {paddedDigits.map((digit, i) =>
        digit !== null ? (
          <ScrollingDigit key={i} value={digit} />
        ) : (
          <span key={i} style={{ width: "0.6em", display: "inline-block" }} />
        )
      )}
    </span>
  );
}

export default function GalleryPage() {
  const bgColor = "#FAF2E6";
  const textColor = "#2C2C2C"; // Dark text for light background (keep consistent)
  const mobileTextColor = "#2C2C2C"; // Dark text for light background
  const expandedTextColor = bgColor; // Same as background for enlarged image
  const router = useRouter();

  const trackRef = useRef<HTMLDivElement | null>(null);
  const imageRefs = useRef<(HTMLImageElement | null)[]>([]);
  const scrollToImageRef = useRef<((index: number) => void) | null>(null);
  const currentScrollPercentageRef = useRef<number>(-50);
  const expandedIndexRef = useRef<number | null>(null);
  const previousCollectionSlugRef = useRef<string | null>(null);

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
  const [isSuperscriptExiting, setIsSuperscriptExiting] = useState(false);
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
  const [collectionNameAnimate, setCollectionNameAnimate] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isNavigatingToCollection, setIsNavigatingToCollection] =
    useState(false);
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(
    null
  );
  const expandedTouchStartRef = useRef<{
    x: number;
    y: number;
    time: number;
  } | null>(null);
  const hasCollectionLink = !!expandedCollection?.slug;

  // Handle collection link click with fade-out
  const handleCollectionClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    slug: string
  ) => {
    e.preventDefault();
    setIsNavigatingToCollection(true);

    // Signal to template that we're navigating to collection
    sessionStorage.setItem("navigatingToCollection", "true");

    // Preload collection images
    const collectionImages = allImages.filter(
      (src) => parseCollection(src).slug === slug
    );

    // Preload images
    collectionImages.forEach((src) => {
      const img = document.createElement("img");
      img.src = src;
    });

    // Fade out, then navigate
    setTimeout(() => {
      router.push(`/gallery/collection/${slug}`);
    }, 400); // Match fade-out duration
  };

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

    // Use next image index during transition to start animation earlier
    const displayIndex =
      isTransitioning && nextImageData
        ? nextImageData.index
        : expandedImageIndex;

    return {
      currentIndex: displayIndex + 1,
      total: galleryImages.length,
    };
  };

  const galleryPositionInfo = getGalleryPositionInfo();

  // Superscript hover animation handlers
  const handleSuperscriptMouseEnter = () => {
    setHoveredTitle(true);
    setIsSuperscriptExiting(false);
  };

  const handleSuperscriptMouseLeave = () => {
    setHoveredTitle(false);
    setIsSuperscriptExiting(true);
  };

  const handleSuperscriptTransitionEnd = () => {
    if (isSuperscriptExiting) {
      setIsSuperscriptExiting(false);
    }
  };

  const getSuperscriptTransform = () => {
    if (hoveredTitle) return "translateY(0)"; // Visible
    if (isSuperscriptExiting) return "translateY(-100%)"; // Exit upward
    return "translateY(100%)"; // Hidden below (reset position)
  };

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
     Mobile detection
  ------------------------------- */
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  /* -------------------------------
     Disable vertical scrolling (desktop only)
  ------------------------------- */
  useEffect(() => {
    if (isMobile) return; // Allow scrolling on mobile
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isMobile]);

  /* -------------------------------
     Horizontal scroll + parallax (Desktop only)
  ------------------------------- */
  useEffect(() => {
    if (isMobile) return; // Skip on mobile
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

    // Touch handlers for mobile horizontal scrolling
    let touchStartX = 0;
    let touchStartY = 0;
    let isScrolling = false;

    const handleTouchStart = (e: TouchEvent) => {
      if (expandedIndexRef.current !== null) return;
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      isScrolling = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (expandedIndexRef.current !== null) return;
      const touchX = e.touches[0].clientX;
      const touchY = e.touches[0].clientY;
      const deltaX = touchX - touchStartX;
      const deltaY = touchY - touchStartY;

      // Determine if horizontal or vertical scroll
      if (!isScrolling) {
        isScrolling = Math.abs(deltaX) > Math.abs(deltaY);
      }

      if (isScrolling) {
        e.preventDefault();
        const delta = deltaX * -0.5; // Adjust sensitivity
        targetPercentage = clamp(targetPercentage + delta);
        velocity = delta * 0.05;
        touchStartX = touchX;
      }
    };

    const handleTouchEnd = () => {
      isScrolling = false;
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

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
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      track.style.willChange = "auto";
      for (const img of images) (img as HTMLElement).style.willChange = "auto";
    };
  }, [isMobile]);

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
          setShowPreview(false);
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
            setIsSuperscriptExiting(false);
            setCollectionNameAnimate(false);
            setShowPreview(false);
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
     Swipe gestures for expanded view (desktop only)
  ------------------------------- */
  useEffect(() => {
    if (isMobile || expandedImageIndex === null || isClosing || isTransitioning)
      return;

    const handleTouchStart = (e: TouchEvent) => {
      expandedTouchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        time: Date.now(),
      };
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!expandedTouchStartRef.current) return;

      const touchEnd = {
        x: e.changedTouches[0].clientX,
        y: e.changedTouches[0].clientY,
        time: Date.now(),
      };

      const deltaX = touchEnd.x - expandedTouchStartRef.current.x;
      const deltaY = touchEnd.y - expandedTouchStartRef.current.y;
      const deltaTime = touchEnd.time - expandedTouchStartRef.current.time;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const isHorizontalSwipe = Math.abs(deltaX) > Math.abs(deltaY);

      // Swipe down to close (vertical swipe down)
      if (!isHorizontalSwipe && deltaY > 100 && distance > 50) {
        shrinkImage();
        expandedTouchStartRef.current = null;
        return;
      }

      // Horizontal swipe to navigate between collections
      if (isHorizontalSwipe && Math.abs(deltaX) > 50 && deltaTime < 300) {
        const collections = getAllCollections();
        if (collections.length === 0) return;
        const currentCollectionIndex = collections.findIndex(
          (c) => c.isCurrent
        );

        if (deltaX > 0 && currentCollectionIndex > 0) {
          // Swipe right - go to previous collection
          const prevCollection = collections[currentCollectionIndex - 1];
          const img = imageRefs.current[prevCollection.galleryImageIndex];
          if (img) {
            const currentObjectPosition = getComputedStyle(img).objectPosition;
            setIsTransitioning(true);
            setTransitionDirection("left");
            setCollectionNameAnimate(false);
            setNextImageData({
              src: prevCollection.previewImage,
              index: prevCollection.galleryImageIndex,
              collection: parseCollection(prevCollection.previewImage),
              objectPosition: currentObjectPosition,
            });
          }
        } else if (
          deltaX < 0 &&
          currentCollectionIndex < collections.length - 1
        ) {
          // Swipe left - go to next collection
          const nextCollection = collections[currentCollectionIndex + 1];
          const img = imageRefs.current[nextCollection.galleryImageIndex];
          if (img) {
            const currentObjectPosition = getComputedStyle(img).objectPosition;
            setIsTransitioning(true);
            setTransitionDirection("right");
            setCollectionNameAnimate(false);
            setNextImageData({
              src: nextCollection.previewImage,
              index: nextCollection.galleryImageIndex,
              collection: parseCollection(nextCollection.previewImage),
              objectPosition: currentObjectPosition,
            });
          }
        }
      }

      expandedTouchStartRef.current = null;
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [
    isMobile,
    expandedImageIndex,
    isClosing,
    isTransitioning,
    expandedCollection,
  ]);

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
        //  Commit the expanded image FIRST (no animation)
        setDisableCommitAnimation(true);

        requestAnimationFrame(() => {
          const newCollection = nextImageData.collection;
          setExpandedImageIndex(nextImageData.index);
          setExpandedImageSrc(nextImageData.src);
          setExpandedCollection(newCollection);
          setExpandedObjectPosition(nextImageData.objectPosition);
          setExpandedImageStyle({
            top: window.innerHeight / 2,
            left: window.innerWidth / 2,
            width: window.innerWidth,
            height: window.innerHeight,
          });

          // NEXT frame: remove transition image
          requestAnimationFrame(() => {
            setIsTransitioning(false);
            setTransitionDirection(null);
            setNextImageSlideIn(false);
            setNextImageData(null);

            // Re-enable animations
            requestAnimationFrame(() => {
              setDisableCommitAnimation(false);
              setShowCollectionTitle(true);
              // Trigger collection name animation after transition completes
              // Always animate when switching via preview (since we're switching to a different collection)
              // Use double RAF to ensure DOM has updated with new collection name
              requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                  setCollectionNameAnimate(true);
                  previousCollectionSlugRef.current = newCollection.slug;
                });
              });
            });
          });
        });
      }, transitionDuration);
    }, 50);

    return () => clearTimeout(timeoutId);
  }, [isTransitioning, nextImageData, transitionDirection]);

  // Get unique collections for mobile simple view
  const getUniqueCollections = () => {
    const collectionsMap = new Map<
      string,
      {
        name: string;
        slug: string;
        previewImage: string;
      }
    >();

    galleryImages.forEach((src) => {
      const { slug, name } = parseCollection(src);
      if (!collectionsMap.has(slug)) {
        collectionsMap.set(slug, {
          name,
          slug,
          previewImage: src,
        });
      }
    });

    return Array.from(collectionsMap.values());
  };

  const uniqueCollections = getUniqueCollections();

  return (
    <div
      className={`min-h-screen w-full relative ${
        isMobile ? "overflow-y-auto" : "overflow-hidden"
      }`}
      style={{
        backgroundColor: bgColor,
        color: textColor,
        opacity: isNavigatingToCollection ? 0 : 1,
        transition: isNavigatingToCollection ? "opacity 0.4s ease-out" : "none",
      }}
    >
      <Navbar />

      {/* MOBILE SIMPLE VIEW */}
      {isMobile ? (
        <div className="pt-24 pb-12 px-4 sm:px-6">
          <h1
            className="text-3xl font-bold mb-8"
            style={{
              color: mobileTextColor,
              fontFamily:
                "'Juana', var(--font-display), 'Playfair Display', 'Times New Roman', serif",
            }}
          >
            Gallery
          </h1>
          <div className="grid grid-cols-1 gap-6">
            {uniqueCollections.map((collection) => (
              <Link
                key={collection.slug}
                href={`/gallery/collection/${collection.slug}`}
                className="block"
              >
                <div className="relative w-full">
                  <Image
                    src={collection.previewImage}
                    alt={collection.name}
                    width={800}
                    height={1120}
                    className="w-full h-auto object-cover"
                    style={{ aspectRatio: "40 / 56" }}
                    quality={85}
                    sizes="(max-width: 768px) 100vw, 90vw"
                    loading="lazy"
                  />
                  <div className="mt-2">
                    <h2
                      className="text-lg font-semibold"
                      style={{
                        color: mobileTextColor,
                        fontFamily:
                          "'Juana', var(--font-display), 'Playfair Display', 'Times New Roman', serif",
                      }}
                    >
                      {collection.name}
                    </h2>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* DESKTOP IMAGE TRACK */}
          <div
            ref={trackRef}
            className="absolute left-1/2 top-3/5 flex gap-[4vmin] select-none"
            style={{
              transform: "translate(-50%, -50%)",
              opacity: isNavigatingToCollection ? 0 : 1,
              transition: isNavigatingToCollection
                ? "opacity 0.15s ease-out"
                : "none",
            }}
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
                loading={i < 2 ? "eager" : "lazy"}
                decoding="async"
                onClick={() => {
                  const img = imageRefs.current[i];
                  if (!img) return;
                  const rect = img.getBoundingClientRect();
                  setIsOpening(true);
                  setIsClosing(false);
                  const newCollection = parseCollection(src);
                  setExpandedImageIndex(i);
                  setExpandedImageSrc(src);
                  setExpandedCollection(newCollection);
                  setShowCollectionTitle(true);
                  setShowPreview(false); // Reset preview visibility
                  // Reset and trigger collection name animation on initial open
                  setCollectionNameAnimate(false);
                  previousCollectionSlugRef.current = newCollection.slug;
                  requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                      setCollectionNameAnimate(true);
                    });
                  });
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
                      // Fade in preview after a short delay
                      setTimeout(() => {
                        setShowPreview(true);
                      }, 300);
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
        </>
      )}

      {/* EXPANDED IMAGE - Desktop only */}
      {!isMobile &&
        expandedImageIndex !== null &&
        expandedImageStyle &&
        expandedImageSrc &&
        expandedCollection && (
          <>
            <div
              className="fixed inset-0 z-40 transition-opacity duration-500"
              style={{
                backgroundColor: bgColor,
                opacity:
                  isClosing || isOpening || isNavigatingToCollection ? 0 : 1,
              }}
            />
            {hasCollectionLink ? (
              <Link
                href={`/gallery/collection/${expandedCollection.slug}`}
                onClick={(e) =>
                  handleCollectionClick(e, expandedCollection.slug)
                }
                className={`fixed top-1/2 left-1/2 z-60 -translate-x-1/2 -translate-y-1/2 text-center tracking-tight transition-opacity duration-500 ${
                  isMobile
                    ? "text-2xl px-4"
                    : "text-4xl sm:text-5xl md:text-5xl hover:opacity-80"
                }`}
                style={{
                  color: expandedTextColor,
                  opacity:
                    showCollectionTitle && !isNavigatingToCollection ? 1 : 0,
                  pointerEvents:
                    showCollectionTitle && !isNavigatingToCollection
                      ? "auto"
                      : "none",
                }}
                onMouseEnter={handleSuperscriptMouseEnter}
                onMouseLeave={handleSuperscriptMouseLeave}
              >
                <span className="relative inline-block">
                  <span className="inline-block overflow-hidden">
                    <span
                      className={`block transition-transform duration-1000 ease-in-out ${
                        collectionNameAnimate
                          ? "translate-y-0"
                          : "translate-y-full"
                      }`}
                    >
                      {expandedCollection.name}
                    </span>
                  </span>
                  {collectionInfo && (
                    <sup
                      className="absolute left-full text-xl sm:text-1xl md:text-1xl ml-2 whitespace-nowrap overflow-hidden"
                      style={{
                        pointerEvents: "none",
                      }}
                    >
                      <span
                        className="block"
                        style={{
                          transform: getSuperscriptTransform(),
                          transition:
                            isSuperscriptExiting || hoveredTitle
                              ? "transform 0.3s ease-in-out"
                              : "none",
                        }}
                        onTransitionEnd={handleSuperscriptTransitionEnd}
                      >
                        {collectionInfo.total}
                      </span>
                    </sup>
                  )}
                </span>
              </Link>
            ) : (
              <div
                className={`fixed top-1/2 left-1/2 z-60 -translate-x-1/2 -translate-y-1/2 text-center font-bold tracking-tight transition-opacity duration-500 ${
                  isMobile
                    ? "text-2xl px-4"
                    : "text-4xl sm:text-5xl md:text-6xl"
                }`}
                style={{
                  color: textColor,
                  opacity:
                    showCollectionTitle && !isNavigatingToCollection ? 1 : 0,
                  pointerEvents:
                    showCollectionTitle && !isNavigatingToCollection
                      ? "auto"
                      : "none",
                  fontFamily:
                    "'Juana', var(--font-display), 'Playfair Display', 'Times New Roman', serif",
                }}
                onMouseEnter={handleSuperscriptMouseEnter}
                onMouseLeave={handleSuperscriptMouseLeave}
              >
                <span className="relative inline-block">
                  <span className="inline-block overflow-hidden">
                    <span
                      className={`block transition-transform duration-1000 ease-in-out ${
                        collectionNameAnimate
                          ? "translate-y-0"
                          : "translate-y-full"
                      }`}
                    >
                      {expandedCollection.name}
                    </span>
                  </span>
                  {collectionInfo && (
                    <sup
                      className="absolute left-full text-xl sm:text-1xl md:text-1xl ml-2 whitespace-nowrap overflow-hidden"
                      style={{
                        pointerEvents: "none",
                      }}
                    >
                      <span
                        className="block"
                        style={{
                          transform: getSuperscriptTransform(),
                          transition:
                            isSuperscriptExiting || hoveredTitle
                              ? "transform 0.3s ease-in-out"
                              : "none",
                        }}
                        onTransitionEnd={handleSuperscriptTransitionEnd}
                      >
                        {collectionInfo.total}
                      </span>
                    </sup>
                  )}
                </span>
              </div>
            )}

            {/* Gallery position number at bottom middle */}
            {galleryPositionInfo && (
              <div
                className={`fixed left-1/2 z-60 -translate-x-1/2 text-center transition-opacity duration-500 ${
                  isMobile
                    ? "bottom-20 text-base"
                    : "bottom-8 text-lg sm:text-xl md:text-2xl"
                }`}
                style={{
                  color: expandedTextColor,
                  opacity: isClosing || isNavigatingToCollection ? 0 : 1,
                  fontVariantNumeric: "tabular-nums",
                  minWidth: isMobile ? "100px" : "150px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.2em",
                }}
              >
                <ScrollingNumber value={galleryPositionInfo.currentIndex} />
                <span>—</span>
                <span>{galleryPositionInfo.total}</span>
              </div>
            )}

            {/* All collections preview in bottom right */}
            {allCollections.length > 0 && (
              <div
                className={`fixed flex flex-row gap-2 sm:gap-3 transition-opacity duration-700 ease-out ${
                  isMobile
                    ? "bottom-4 left-4 right-4 max-w-full overflow-x-auto pb-2"
                    : "bottom-8 right-8 max-w-[60vw] overflow-x-auto"
                }`}
                style={{
                  opacity:
                    (showPreview || isTransitioning) &&
                    !isClosing &&
                    !isNavigatingToCollection
                      ? 1
                      : 0,
                  zIndex: 60,
                  pointerEvents:
                    (showPreview || isTransitioning) &&
                    !isClosing &&
                    !isNavigatingToCollection
                      ? "auto"
                      : "none",
                  WebkitOverflowScrolling: "touch",
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
                        // Reset animation state when starting transition
                        setCollectionNameAnimate(false);
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
                        className={`relative z-10 object-cover rounded-sm ${
                          isMobile ? "w-16 h-22" : "w-20 h-28 sm:w-24 sm:h-32"
                        }`}
                        style={{
                          border: collection.isCurrent
                            ? "2px solid rgba(250, 242, 230, 0.8)"
                            : "2px solid transparent",
                        }}
                        draggable={false}
                        loading="lazy"
                        decoding="async"
                      />
                      <div className="absolute bottom-0 left-0 right-0 z-0 p-1 bg-black bg-opacity-60 rounded-b-sm">
                        <p
                          className={`text-white truncate ${
                            isMobile ? "text-[10px]" : "text-xs"
                          }`}
                        >
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
                  opacity: isNavigatingToCollection ? 0 : 1,
                  transition: isNavigatingToCollection
                    ? "opacity 0.4s ease-out"
                    : undefined,
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
