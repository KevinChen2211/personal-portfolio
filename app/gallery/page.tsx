"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { galleryImages, parseCollection, allImages } from "./data";
import Navbar from "../components/Navbar";
import { usePrefersReducedMotion } from "../utils/motion";

function ScrollingDigit({ value }: { value: number }) {
  const [current, setCurrent] = useState(value);
  const prefersReducedMotion = usePrefersReducedMotion();

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
          transition: prefersReducedMotion
            ? "none"
            : "transform 0.4s ease-out",
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
        ),
      )}
    </span>
  );
}

// `vmin` isn't reliably honoured by browsers in srcset selection, so the track
// thumbnails use vw-based hints that err on the side of a higher-resolution
// variant for crispness on retina.
const THUMB_SIZES =
  "(max-width: 768px) 80vw, (max-width: 1280px) 45vw, 35vw";
const FULLSCREEN_SIZES = "100vw";
// One quality for every full-size render of a gallery photo. The thumbnail,
// the fullscreen zoom and the collection viewer must agree, otherwise each
// surface requests a different `/_next/image` URL and pays for a cold encode
// of the same source file. (The filmstrip keeps its own lower quality — at
// 128px wide it is a genuinely different asset.)
const PHOTO_QUALITY = 85;
const CAROUSEL_WHEEL_SENSITIVITY = 0.025;
const CAROUSEL_WHEEL_MOMENTUM = 0.1;
const CAROUSEL_LERP_FAST = 0.02;
const CAROUSEL_LERP_FINE = 0.015;

/* -------------------------------
   Two image layers so the zoom always has pixels to animate.

   The base layer reuses the exact variant the track thumbnail already
   loaded — same `sizes`, same `quality`, so it is guaranteed warm in the
   browser cache and paints on the first frame. The fullscreen variant is a
   cold fetch on first open (Next has to encode a fresh AVIF from a source
   photo up to 2400px), so it cross-fades in on top once it decodes.

   Without the base layer the wrapper animates an empty box for the whole
   1300ms zoom and the photo only appears once the animation has finished.
------------------------------- */
function ExpandedPhoto({
  src,
  alt,
  objectPosition,
  prefersReducedMotion,
}: {
  src: string;
  alt: string;
  objectPosition: string;
  prefersReducedMotion: boolean;
}) {
  const [hiResReady, setHiResReady] = useState(false);

  // next/image fires onLoad for cached images, but check `complete` from the
  // ref too so a hit that resolves before hydration can't leave the hi-res
  // layer stuck at zero opacity.
  const markReadyIfComplete = useCallback((el: HTMLImageElement | null) => {
    if (el?.complete && el.naturalWidth > 0) setHiResReady(true);
  }, []);

  const layerStyle = {
    objectFit: "cover" as const,
    objectPosition,
    // Slightly overscale so sub-pixel rounding during the size animation
    // never exposes the background as thin seam lines. ("fill" images can't
    // have width/height overridden, so we bleed via scale.)
    transform: "scale(1.01)",
  };

  return (
    <>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={THUMB_SIZES}
        quality={PHOTO_QUALITY}
        priority
        draggable={false}
        style={layerStyle}
      />
      <Image
        src={src}
        alt=""
        aria-hidden="true"
        fill
        sizes={FULLSCREEN_SIZES}
        quality={PHOTO_QUALITY}
        priority
        draggable={false}
        ref={markReadyIfComplete}
        onLoad={() => setHiResReady(true)}
        style={{
          ...layerStyle,
          opacity: hiResReady ? 1 : 0,
          transition: prefersReducedMotion ? "none" : "opacity 400ms ease-out",
        }}
      />
    </>
  );
}

export default function GalleryPage() {
  const bgColor = "#FAF2E6";
  const textColor = "#2C2C2C"; // Dark text for light background (keep consistent)
  const mobileTextColor = "#2C2C2C"; // Dark text for light background
  const expandedTextColor = bgColor; // Same as background for enlarged image
  const router = useRouter();
  const prefersReducedMotion = usePrefersReducedMotion();

  const trackRef = useRef<HTMLDivElement | null>(null);
  const imageRefs = useRef<(HTMLImageElement | null)[]>([]);
  const scrollToImageRef = useRef<((index: number) => void) | null>(null);
  const currentScrollPercentageRef = useRef<number>(-50);
  const expandedIndexRef = useRef<number | null>(null);
  const previousCollectionSlugRef = useRef<string | null>(null);
  const expandedDialogRef = useRef<HTMLDivElement | null>(null);
  const lastFocusedElementRef = useRef<HTMLElement | null>(null);
  const wasExpandedRef = useRef(false);

  const [expandedImageIndex, setExpandedImageIndex] = useState<number | null>(
    null,
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
  const [pendingExpand, setPendingExpand] = useState(false);
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
  const [warmedIndices, setWarmedIndices] = useState<number[]>([]);
  const expandedTouchStartRef = useRef<{
    x: number;
    y: number;
    time: number;
  } | null>(null);
  const hasCollectionLink = !!expandedCollection?.slug;
  const zoomTransitionMs = prefersReducedMotion ? 0 : 1300;

  // Handle collection link click with fade-out
  const handleCollectionClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    slug: string,
  ) => {
    e.preventDefault();
    setIsNavigatingToCollection(true);

    // Signal to template that we're navigating to collection
    sessionStorage.setItem("navigatingToCollection", "true");

    // Fade out, then navigate. Next.js <Image priority> on the destination
    // page will trigger the optimized first-image fetch automatically.
    setTimeout(() => {
      router.push(`/gallery/collection/${slug}`);
    }, prefersReducedMotion ? 0 : 400);
  };

  // Calculate collection info
  const getCollectionInfo = () => {
    if (!expandedImageSrc || !expandedCollection) return null;

    const collectionImages = allImages.filter(
      (src) => parseCollection(src).slug === expandedCollection.slug,
    );

    const currentIndex = collectionImages.findIndex(
      (src) => src === expandedImageSrc,
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
  const getAllCollections = useCallback(() => {
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
  }, [expandedCollection]);

  const allCollections = expandedImageIndex !== null ? getAllCollections() : [];

  useEffect(() => {
    expandedIndexRef.current = expandedImageIndex;
  }, [expandedImageIndex]);

  useEffect(() => {
    const expanded =
      expandedImageIndex !== null && expandedImageStyle !== null;
    let frameId: number | null = null;

    if (expanded && !wasExpandedRef.current) {
      wasExpandedRef.current = true;
      frameId = requestAnimationFrame(() => {
        expandedDialogRef.current?.focus({ preventScroll: true });
      });
    } else if (!expanded && wasExpandedRef.current) {
      wasExpandedRef.current = false;
      frameId = requestAnimationFrame(() => {
        lastFocusedElementRef.current?.focus({ preventScroll: true });
        lastFocusedElementRef.current = null;
      });
    }

    return () => {
      if (frameId !== null) cancelAnimationFrame(frameId);
    };
  }, [expandedImageIndex, expandedImageStyle]);

  /* -------------------------------
     Expand-to-fullscreen after the start frame is committed.
     Running this from an effect (rather than inline in onClick) guarantees
     the browser has painted the thumbnail-sized starting frame before we
     change to fullscreen, so the zoom transition always plays.
  ------------------------------- */
  useEffect(() => {
    if (!pendingExpand) return;
    const rafId = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setExpandedImageStyle({
          top: window.innerHeight / 2,
          left: window.innerWidth / 2,
          width: window.innerWidth,
          height: window.innerHeight,
        });
        if (prefersReducedMotion) {
          setIsOpening(false);
          setShowPreview(true);
        } else {
          // Fade in the background.
          setTimeout(() => {
            setIsOpening(false);
          }, 10);
          // Fade in preview after a short delay.
          setTimeout(() => {
            setShowPreview(true);
          }, 300);
        }
        setPendingExpand(false);
      });
    });
    return () => cancelAnimationFrame(rafId);
  }, [pendingExpand, prefersReducedMotion]);

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
     Warm the fullscreen variants off the input path.

     The expanded view requests a different `/_next/image` variant than the
     thumbnail, so on a cold cache a click has to wait on a fresh AVIF encode
     before there is anything to zoom. Mounting that variant ahead of time
     moves the cost off the click: on hover/focus for the photo the user is
     reaching for, and on idle for the rest of the track.
  ------------------------------- */
  const warmImage = useCallback((index: number) => {
    setWarmedIndices((prev) =>
      prev.includes(index) ? prev : [...prev, index],
    );
  }, []);

  useEffect(() => {
    if (isMobile) return; // the expanded view is desktop-only

    const connection = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection;
    if (connection?.saveData) return;

    const warmAll = () => setWarmedIndices(galleryImages.map((_, i) => i));

    if (typeof window.requestIdleCallback === "function") {
      const handle = window.requestIdleCallback(warmAll, { timeout: 3000 });
      return () => window.cancelIdleCallback(handle);
    }
    const timeoutId = setTimeout(warmAll, 1500);
    return () => clearTimeout(timeoutId);
  }, [isMobile]);

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
    let velocity = prefersReducedMotion ? 0 : 60;
    let animationFrameId: number | null = null;
    let isPageVisible = document.visibilityState === "visible";
    let lastRenderedPercentage = Number.NaN;
    let lastParallaxPercentage = Number.NaN;
    let frameCounter = 0;

    const images = Array.from(
      track.getElementsByClassName("image"),
    ) as HTMLElement[];
    if (images.length === 0) return;

    const calculateMaxScroll = () => {
      const trackRect = track.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const trackWidth = trackRect.width;
      const lastImage = images[images.length - 1];
      const imageWidth = lastImage.getBoundingClientRect().width;
      const distanceToMove = trackWidth - imageWidth / 2 - viewportWidth / 2;
      return -50 - (distanceToMove / trackWidth) * 100;
    };

    let maxScroll = calculateMaxScroll();
    const handleResize = () => {
      maxScroll = calculateMaxScroll();
      ensureAnimation();
    };
    window.addEventListener("resize", handleResize);

    const clamp = (value: number) => Math.max(Math.min(value, 0), maxScroll);

    const scrollToImage = (imageIndex: number) => {
      if (imageIndex < 0 || imageIndex >= images.length) return;
      const targetImg = images[imageIndex];
      const rect = targetImg.getBoundingClientRect();
      const offsetX = window.innerWidth / 2 - (rect.left + rect.width / 2);
      const trackRect = track.getBoundingClientRect();
      const percentageAdjustment = (offsetX / trackRect.width) * 100;
      const newPercentage = clamp(targetPercentage + percentageAdjustment);
      percentage = newPercentage;
      targetPercentage = newPercentage;
      velocity = 0;
      track.style.transform = `translate3d(${percentage}%, -50%, 0)`;
      lastRenderedPercentage = percentage;
    };

    scrollToImageRef.current = scrollToImage;

    track.style.willChange = "transform";
    for (const img of images) {
      img.style.willChange = "object-position";
    }

    const handleWheel = (e: WheelEvent) => {
      if (expandedIndexRef.current !== null) return;
      e.preventDefault();
      const delta = e.deltaY * -CAROUSEL_WHEEL_SENSITIVITY;
      targetPercentage = clamp(targetPercentage + delta);
      velocity = prefersReducedMotion ? 0 : delta * CAROUSEL_WHEEL_MOMENTUM;
      ensureAnimation();
    };
    window.addEventListener("wheel", handleWheel, { passive: false });
    const handleVisibilityChange = () => {
      isPageVisible = document.visibilityState === "visible";
      if (isPageVisible) {
        ensureAnimation();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

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
        velocity = prefersReducedMotion ? 0 : delta * 0.05;
        touchStartX = touchX;
        ensureAnimation();
      }
    };

    const handleTouchEnd = () => {
      isScrolling = false;
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    function ensureAnimation() {
      if (animationFrameId === null && isPageVisible) {
        animationFrameId = requestAnimationFrame(animate);
      }
    }

    function animate() {
      animationFrameId = null;
      if (!isPageVisible) return;
      const isExpanded = expandedIndexRef.current !== null;

      if (isExpanded) {
        targetPercentage = percentage; // freeze track movement
        velocity = 0;
      } else if (prefersReducedMotion) {
        percentage = targetPercentage;
        velocity = 0;
      } else if (Math.abs(velocity) > 0.01) {
        targetPercentage = clamp(targetPercentage + velocity);
        velocity *= 0.82;
      }

      const distance = targetPercentage - percentage;
      const lerpFactor = prefersReducedMotion
        ? 1
        : Math.abs(distance) > 1
          ? CAROUSEL_LERP_FAST
          : CAROUSEL_LERP_FINE;
      percentage += distance * lerpFactor;

      if (Math.abs(distance) < 0.01 && Math.abs(velocity) < 0.01)
        percentage = targetPercentage;

      const shouldUpdateTrack =
        !Number.isFinite(lastRenderedPercentage) ||
        Math.abs(percentage - lastRenderedPercentage) >= 0.05 ||
        Math.abs(distance) > 0.2 ||
        Math.abs(velocity) > 0.2;

      if (shouldUpdateTrack) {
        currentScrollPercentageRef.current = percentage;
        track.style.transform = `translate3d(${percentage}%, -50%, 0)`;
        lastRenderedPercentage = percentage;
      }

      // Parallax
      if (!isExpanded && !prefersReducedMotion) {
        frameCounter = (frameCounter + 1) % 2;
        const shouldUpdateParallax =
          frameCounter === 0 &&
          (!Number.isFinite(lastParallaxPercentage) ||
            Math.abs(percentage - lastParallaxPercentage) >= 0.35);

        if (shouldUpdateParallax) {
          const totalImages = images.length;
          const denominator = Math.max(totalImages - 1, 1);
          for (let i = 0; i < totalImages; i++) {
            const img = images[i];
            const relIndex = i / denominator - 0.5;
            const parallaxOffset = relIndex * 30;
            img.style.objectPosition = `${
              100 + percentage + parallaxOffset
            }% center`;
          }
          lastParallaxPercentage = percentage;
        }
      }

      const stillMoving =
        !isExpanded &&
        (Math.abs(targetPercentage - percentage) >= 0.01 ||
          Math.abs(velocity) >= 0.01);
      if (stillMoving) ensureAnimation();
    }

    ensureAnimation();

    return () => {
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      track.style.willChange = "auto";
      for (const img of images) {
        img.style.willChange = "auto";
      }
    };
  }, [isMobile, prefersReducedMotion]);

  /* -------------------------------
     SHRINK EXPANDED IMAGE SEAMLESSLY
  ------------------------------- */
  const shrinkImage = useCallback(() => {
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
          void updatedImg.offsetHeight;

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
          }, zoomTransitionMs);
        });
      });
    }, prefersReducedMotion ? 0 : 120);
  }, [
    expandedImageIndex,
    isClosing,
    prefersReducedMotion,
    zoomTransitionMs,
  ]);

  /* -------------------------------
     Close on Escape
  ------------------------------- */
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && expandedImageIndex !== null) shrinkImage();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [expandedImageIndex, shrinkImage]);

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
  }, [isClosing, isTransitioning, shrinkImage]);

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
          (c) => c.isCurrent,
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
    getAllCollections,
    shrinkImage,
  ]);

  /* -------------------------------
     Handle collection transition animation
  ------------------------------- */
  useEffect(() => {
    if (!isTransitioning || !nextImageData || !transitionDirection) return;

    // Hide title during transition
    setShowCollectionTitle(false);
    setNextImageSlideIn(false);

    // Transition duration matches existing motion unless the user opts out.
    const transitionDuration = prefersReducedMotion ? 0 : 1000;

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
    }, prefersReducedMotion ? 0 : 50);

    return () => clearTimeout(timeoutId);
  }, [
    isTransitioning,
    nextImageData,
    transitionDirection,
    prefersReducedMotion,
  ]);

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

  // Open a gallery image into the fullscreen expanded view. Extracted from the
  // thumbnail's onClick so it can also be triggered by keyboard (Enter/Space).
  const openImageAt = (i: number) => {
    // Ignore while a previous open/close/transition is still settling,
    // otherwise the expand can be committed in the same paint as the start
    // frame and skip the zoom.
    if (
      isClosing ||
      isTransitioning ||
      expandedImageIndex !== null ||
      pendingExpand
    )
      return;
    lastFocusedElementRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const src = galleryImages[i];
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
    setShowPreview(false);
    setCollectionNameAnimate(false);
    previousCollectionSlugRef.current = newCollection.slug;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setCollectionNameAnimate(true);
      });
    });
    const currentObjectPosition = getComputedStyle(img).objectPosition;
    // Start at the thumbnail's exact position/size. The expand to fullscreen
    // is triggered from an effect once this starting frame is committed,
    // guaranteeing the transition plays.
    setExpandedImageStyle({
      top: rect.top + rect.height / 2,
      left: rect.left + rect.width / 2,
      width: rect.width,
      height: rect.height,
    });
    setExpandedObjectPosition(currentObjectPosition);
    setPendingExpand(true);
  };

  return (
    <div
      className={`min-h-screen w-full relative ${
        isMobile ? "overflow-y-auto" : "overflow-hidden"
      }`}
      style={{
        backgroundColor: bgColor,
        color: textColor,
        opacity: isNavigatingToCollection ? 0 : 1,
        transition:
          isNavigatingToCollection && !prefersReducedMotion
            ? "opacity 0.4s ease-out"
            : "none",
      }}
    >
      <Navbar />
      <h1 className="sr-only">Photography gallery</h1>

      {/* MOBILE SIMPLE VIEW */}
      {isMobile ? (
        <div className="pt-24 pb-12 px-4 sm:px-6">
          <div
            aria-hidden="true"
            className="text-3xl font-bold mb-8"
            style={{
              color: mobileTextColor,
              fontFamily:
                "var(--font-serif)",
            }}
          >
            Gallery
          </div>
          <div className="grid grid-cols-1 gap-6">
            {uniqueCollections.map((collection) => (
              <Link
                key={collection.slug}
                href={`/gallery/collection/${collection.slug}`}
                prefetch={false}
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
                    quality={PHOTO_QUALITY}
                    sizes="(max-width: 768px) 100vw, 90vw"
                    loading="lazy"
                  />
                  <div className="mt-2">
                    <h2
                      className="text-lg font-semibold"
                      style={{
                        color: mobileTextColor,
                        fontFamily:
                          "var(--font-serif)",
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
            {galleryImages.map((src, i) => {
              const collectionName = parseCollection(src).name;
              return (
                <div
                  key={i}
                  role="button"
                  tabIndex={0}
                  aria-label={`Open the ${collectionName} collection`}
                  onClick={() => openImageAt(i)}
                  onPointerEnter={() => warmImage(i)}
                  onFocus={() => warmImage(i)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      openImageAt(i);
                    }
                  }}
                  style={{
                    position: "relative",
                    width: "40vmin",
                    height: "56vmin",
                    flexShrink: 0,
                  }}
                >
                  <Image
                    ref={(el: HTMLImageElement | null) => {
                      imageRefs.current[i] = el;
                    }}
                    src={src}
                    alt={collectionName}
                    fill
                    sizes={THUMB_SIZES}
                    quality={PHOTO_QUALITY}
                    priority={i === 0}
                    loading={i === 0 ? "eager" : "lazy"}
                    className="image cursor-pointer transition-all duration-500 ease-out hover:scale-[1.02] hover:opacity-95"
                    draggable={false}
                    style={{
                      objectFit: "cover",
                      objectPosition: "100% center",
                    }}
                  />
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Off-screen warmers. Mounting the fullscreen variant lets next/image
          issue exactly the request the expanded view will make, so the zoom
          opens on a decoded photo instead of an empty box. */}
      {!isMobile && warmedIndices.length > 0 && (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed top-0 left-0 overflow-hidden opacity-0"
          style={{ width: 1, height: 1, zIndex: -1 }}
        >
          {warmedIndices.map((i) => (
            <Image
              key={galleryImages[i]}
              src={galleryImages[i]}
              alt=""
              width={1}
              height={1}
              sizes={FULLSCREEN_SIZES}
              quality={PHOTO_QUALITY}
              loading="eager"
            />
          ))}
        </div>
      )}

      {/* EXPANDED IMAGE - Desktop only */}
      {!isMobile &&
        expandedImageIndex !== null &&
        expandedImageStyle &&
        expandedImageSrc &&
        expandedCollection && (
          <div
            ref={expandedDialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={`${expandedCollection.name} collection preview`}
            tabIndex={-1}
            className="fixed inset-0 z-[55] outline-none"
          >
            <div
              className={`fixed inset-0 z-40 ${
                prefersReducedMotion
                  ? "transition-none"
                  : "transition-opacity duration-[900ms]"
              }`}
              style={{
                backgroundColor: bgColor,
                opacity:
                  isClosing || isOpening || isNavigatingToCollection ? 0 : 1,
              }}
            />
            <div
              className={`fixed inset-0 z-[45] pointer-events-none ${
                prefersReducedMotion
                  ? "transition-none"
                  : "transition-opacity duration-[900ms]"
              }`}
              style={{
                background:
                  "radial-gradient(ellipse at center, transparent 42%, rgba(44, 44, 44, 0.12) 100%)",
                opacity:
                  isClosing || isOpening || isNavigatingToCollection ? 0 : 1,
              }}
              aria-hidden="true"
            />
            {hasCollectionLink ? (
              <Link
                href={`/gallery/collection/${expandedCollection.slug}`}
                prefetch={false}
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
                  // Match the editorial serif used by the non-link title variant
                  // and the rest of the gallery; without this the linked title
                  // fell back to the inherited sans-serif body font.
                  fontFamily: "var(--font-serif)",
                  opacity:
                    showCollectionTitle && !isNavigatingToCollection ? 1 : 0,
                  pointerEvents:
                    showCollectionTitle && !isNavigatingToCollection
                      ? "auto"
                      : "none",
                  transitionDuration: prefersReducedMotion ? "0ms" : undefined,
                }}
                onMouseEnter={handleSuperscriptMouseEnter}
                onMouseLeave={handleSuperscriptMouseLeave}
              >
                <span className="relative inline-block">
                  <span className="inline-block overflow-hidden">
                    <span
                      className={`block ${
                        prefersReducedMotion
                          ? "transition-none"
                          : "transition-transform duration-1000 ease-in-out"
                      } ${
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
                      className="absolute left-full text-xl sm:text-1xl md:text-1xl ml-2 pr-2 whitespace-nowrap overflow-hidden"
                      style={{
                        pointerEvents: "none",
                      }}
                    >
                      <span
                        className="block"
                        style={{
                          transform: getSuperscriptTransform(),
                          transition:
                            !prefersReducedMotion &&
                            (isSuperscriptExiting || hoveredTitle)
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
                    "var(--font-serif)",
                  transitionDuration: prefersReducedMotion ? "0ms" : undefined,
                }}
                onMouseEnter={handleSuperscriptMouseEnter}
                onMouseLeave={handleSuperscriptMouseLeave}
              >
                <span className="relative inline-block">
                  <span className="inline-block overflow-hidden">
                    <span
                      className={`block ${
                        prefersReducedMotion
                          ? "transition-none"
                          : "transition-transform duration-1000 ease-in-out"
                      } ${
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
                      className="absolute left-full text-xl sm:text-1xl md:text-1xl ml-2 pr-2 whitespace-nowrap overflow-hidden"
                      style={{
                        pointerEvents: "none",
                      }}
                    >
                      <span
                        className="block"
                        style={{
                          transform: getSuperscriptTransform(),
                          transition:
                            !prefersReducedMotion &&
                            (isSuperscriptExiting || hoveredTitle)
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
                  transitionDuration: prefersReducedMotion ? "0ms" : undefined,
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
                  transitionDuration: prefersReducedMotion ? "0ms" : undefined,
                }}
              >
                {allCollections.map((collection, idx) => {
                  const currentCollectionIndex = allCollections.findIndex(
                    (c) => c.isCurrent,
                  );
                  const direction =
                    idx < currentCollectionIndex ? "left" : "right";

                  return (
                    <button
                      type="button"
                      key={collection.galleryImageIndex}
                      aria-label={`Preview the ${collection.name} collection`}
                      aria-pressed={collection.isCurrent}
                      disabled={collection.isCurrent || isTransitioning || isClosing}
                      className="cursor-pointer relative flex-shrink-0 border-0 bg-transparent p-0 text-left disabled:cursor-default"
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
                      <div
                        className={`relative z-10 rounded-sm overflow-hidden ${
                          isMobile ? "w-16 h-22" : "w-20 h-28 sm:w-24 sm:h-32"
                        }`}
                        style={{
                          border: collection.isCurrent
                            ? "2px solid rgba(250, 242, 230, 0.8)"
                            : "2px solid transparent",
                        }}
                      >
                        <Image
                          src={collection.previewImage}
                          alt={collection.name}
                          fill
                          sizes="128px"
                          quality={60}
                          loading="lazy"
                          className="object-cover"
                          draggable={false}
                        />
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 z-0 p-1 bg-black bg-opacity-60 rounded-b-sm">
                        <p
                          className={`text-white truncate ${
                            isMobile ? "text-[10px]" : "text-xs"
                          }`}
                        >
                          {collection.name}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
            {/* Current expanded image — wrapper handles the fixed-position
                size/transform animation, <Image fill> handles the optimized
                image itself. */}
            {expandedImageSrc && (
              <div
                className={
                  disableCommitAnimation || prefersReducedMotion
                    ? "transition-none"
                    : "transition-all duration-[1300ms] ease-out"
                }
                style={{
                  width: `${expandedImageStyle.width}px`,
                  height: `${expandedImageStyle.height}px`,
                  position: "fixed",
                  top: `${expandedImageStyle.top}px`,
                  left: `${expandedImageStyle.left}px`,
                  transform:
                    isTransitioning && transitionDirection
                      ? `translate(calc(-50% ${
                          transitionDirection === "left" ? "+" : "-"
                        } 100vw), -50%)`
                      : "translate(-50%, -50%)",
                  zIndex: 50,
                  opacity: isNavigatingToCollection ? 0 : 1,
                  transition:
                    isNavigatingToCollection && !prefersReducedMotion
                    ? "opacity 0.4s ease-out"
                    : undefined,
                  overflow: "hidden",
                }}
              >
                <ExpandedPhoto
                  key={expandedImageSrc}
                  src={expandedImageSrc}
                  alt={expandedCollection.name}
                  objectPosition={expandedObjectPosition}
                  prefersReducedMotion={prefersReducedMotion}
                />
              </div>
            )}

            {/* Next image sliding in */}
            {isTransitioning &&
              nextImageData &&
              transitionDirection &&
              expandedImageStyle && (
                <div
                  className={
                    prefersReducedMotion
                      ? "transition-none"
                      : "transition-all duration-1000 ease-out"
                  }
                  style={{
                    width: `${expandedImageStyle.width}px`,
                    height: `${expandedImageStyle.height}px`,
                    position: "fixed",
                    top: `${expandedImageStyle.top}px`,
                    left: `${expandedImageStyle.left}px`,
                    transform: nextImageSlideIn
                      ? "translate(-50%, -50%)"
                      : transitionDirection === "left"
                        ? "translate(calc(-50% - 100vw), -50%)"
                        : "translate(calc(-50% + 100vw), -50%)",
                    zIndex: 51,
                    overflow: "hidden",
                  }}
                >
                  <ExpandedPhoto
                    key={nextImageData.src}
                    src={nextImageData.src}
                    alt={nextImageData.collection.name}
                    objectPosition={nextImageData.objectPosition}
                    prefersReducedMotion={prefersReducedMotion}
                  />
                </div>
              )}
          </div>
        )}
    </div>
  );
}
