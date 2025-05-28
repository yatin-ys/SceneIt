"use client"; // This component now needs client-side interactivity

import { MediaCard } from './MediaCard';
import { MediaItem } from '@/lib/tmdb';
import { useRef, useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button"; // Import Shadcn Button
import { cn } from "@/lib/utils"; // For conditional class names

interface MediaGridProps {
  items: MediaItem[];
  mediaType: 'movie' | 'tv';
  title: string;
}

export function MediaGrid({ items, mediaType, title }: MediaGridProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkForScrollability = useCallback(() => {
    const el = scrollContainerRef.current;
    if (el) {
      const hasOverflow = el.scrollWidth > el.clientWidth;
      setCanScrollLeft(el.scrollLeft > 0);
      setCanScrollRight(hasOverflow && el.scrollLeft < el.scrollWidth - el.clientWidth - 1); // -1 for subpixel precision
    }
  }, []);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (el) {
      checkForScrollability(); // Initial check
      el.addEventListener('scroll', checkForScrollability, { passive: true });
      // Also check on window resize and when items change
      const resizeObserver = new ResizeObserver(checkForScrollability);
      resizeObserver.observe(el);

      return () => {
        el.removeEventListener('scroll', checkForScrollability);
        resizeObserver.unobserve(el);
      };
    }
  }, [items, checkForScrollability]); // Re-check if items change or on component mount

  if (!items || items.length === 0) {
    return (
      <div className="py-4">
        <h2 className="text-2xl font-semibold mb-4">{title}</h2>
        <p className="text-muted-foreground">No items to display in this section.</p>
      </div>
    );
  }

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef;
      const scrollAmount = current.clientWidth * 0.75; // Scroll by 75% of visible width
      current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const showArrows = items.length > 3; // Heuristic: only show arrows if there's likely to be scrolling

  return (
    <section className="py-6 relative group"> {/* `group` for hover effects on arrows */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">{title}</h2>
        {/* Optional: "View All" link or other actions could go here */}
      </div>

      {/* Scroll Left Arrow */}
      {showArrows && (
        <Button
          variant="outline"
          size="icon"
          className={cn(
            "absolute left-0 top-1/2 transform -translate-y-1/2 z-10 p-2 rounded-full shadow-md",
            "opacity-0 group-hover:opacity-100 transition-opacity duration-300 focus:opacity-100",
            "-ml-2 sm:-ml-4", // Adjust margin based on screen size
            !canScrollLeft && "opacity-0 pointer-events-none" // Hide if cannot scroll left
          )}
          onClick={() => scroll('left')}
          disabled={!canScrollLeft}
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
      )}

      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto space-x-3 sm:space-x-4 pb-4 no-scrollbar"
        // `no-scrollbar` class to hide scrollbar (defined in globals.css)
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
            "-mr-2 sm:-mr-4", // Adjust margin based on screen size
            !canScrollRight && "opacity-0 pointer-events-none" // Hide if cannot scroll right
          )}
          onClick={() => scroll('right')}
          disabled={!canScrollRight}
          aria-label="Scroll right"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      )}
    </section>
  );
}