// components/MediaGrid.tsx
"use client";

import { MediaCard } from "./MediaCard";
import { MediaItem } from "@/lib/tmdb";
import { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link"; // Import Next.js Link

interface MediaGridProps {
  items: MediaItem[];
  mediaType: "movie" | "tv";
  title: string;
  moreLinkHref?: string; // New optional prop for "View More" link
}

export function MediaGrid({
  items,
  mediaType,
  title,
  moreLinkHref,
}: MediaGridProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkForScrollability = useCallback(() => {
    const el = scrollContainerRef.current;
    if (el) {
      const hasOverflow = el.scrollWidth > el.clientWidth;
      setCanScrollLeft(el.scrollLeft > 0);
      setCanScrollRight(
        hasOverflow && el.scrollLeft < el.scrollWidth - el.clientWidth - 1
      );
    }
  }, []);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (el) {
      checkForScrollability();
      el.addEventListener("scroll", checkForScrollability, { passive: true });
      const resizeObserver = new ResizeObserver(checkForScrollability);
      resizeObserver.observe(el);

      return () => {
        el.removeEventListener("scroll", checkForScrollability);
        resizeObserver.unobserve(el);
      };
    }
  }, [items, checkForScrollability]);

  if (!items || items.length === 0) {
    return (
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">{title}</h2>
        {/* This is where "View More" should appear */}
        {moreLinkHref && (
          <Link
            href={moreLinkHref}
            className="text-sm text-primary hover:underline whitespace-nowrap ml-4"
          >
            View More
          </Link>
        )}
      </div>
    );
  }

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef;
      const scrollAmount = current.clientWidth * 0.75;
      current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Only show arrows if there are enough items to potentially scroll
  // Adjust this number based on average card width and typical container sizes
  const averageCardWidth = 176; // Corresponds to md:w-44 in MediaCard
  const containerWidth = scrollContainerRef.current?.clientWidth || 0;
  const showArrows =
    items.length * averageCardWidth > containerWidth && items.length > 1;

  return (
    <section className="py-6 relative group">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">{title}</h2>
        {moreLinkHref && (
          <Link
            href={moreLinkHref}
            className="text-sm text-primary hover:underline whitespace-nowrap ml-4"
          >
            View More
          </Link>
        )}
      </div>

      {/* Scroll Left Arrow */}
      {showArrows && (
        <Button
          variant="outline"
          size="icon"
          className={cn(
            "absolute left-0 top-1/2 transform -translate-y-1/2 z-10 p-2 rounded-full shadow-md",
            "opacity-0 group-hover:opacity-100 transition-opacity duration-300 focus:opacity-100",
            "-ml-2 sm:-ml-4",
            !canScrollLeft && "opacity-0 pointer-events-none"
          )}
          onClick={() => scroll("left")}
          disabled={!canScrollLeft}
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
      )}

      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto space-x-3 sm:space-x-4 pb-4 no-scrollbar"
      >
        {items.map((item) => (
          <MediaCard key={item.id} item={item} mediaType={mediaType} />
        ))}
      </div>

      {/* Scroll Right Arrow */}
      {showArrows && (
        <Button
          variant="outline"
          size="icon"
          className={cn(
            "absolute right-0 top-1/2 transform -translate-y-1/2 z-10 p-2 rounded-full shadow-md",
            "opacity-0 group-hover:opacity-100 transition-opacity duration-300 focus:opacity-100",
            "-mr-2 sm:-mr-4",
            !canScrollRight && "opacity-0 pointer-events-none"
          )}
          onClick={() => scroll("right")}
          disabled={!canScrollRight}
          aria-label="Scroll right"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      )}
    </section>
  );
}
