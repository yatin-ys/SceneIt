// app/shows/[category]/page.tsx
import React from "react";
import {
  getPopularShows,
  getTopRatedShows,
  //   getUpcomingShows, // Make sure this is imported
  TMDBResponse,
} from "@/lib/tmdb"; // Removed getTrendingShows from here
import { MediaCard } from "@/components/MediaCard";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

// Updated slugs: "trending" is removed
type TVCategorySlug = "popular" | "top-rated" /*| "upcoming"*/;

interface TVCategoryConfig {
  fetchFunction: (page: number) => Promise<TMDBResponse>;
  title: string;
  mediaType: "tv";
}

// Updated configurations: "trending" is removed
const tvCategoryConfigurations: Record<TVCategorySlug, TVCategoryConfig> = {
  popular: {
    fetchFunction: getPopularShows,
    title: "Popular TV Shows",
    mediaType: "tv",
  },
  "top-rated": {
    fetchFunction: getTopRatedShows,
    title: "Top Rated TV Shows",
    mediaType: "tv",
  },
  //   upcoming: {
  //     fetchFunction: getUpcomingShows,
  //     title: "Upcoming TV Shows",
  //     mediaType: "tv",
  //   },
};

export async function generateMetadata(props: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await props.params;

  if (!category || !Object.keys(tvCategoryConfigurations).includes(category)) {
    return { title: "TV Shows | CineLog", description: "Browse TV shows." };
  }

  const config = tvCategoryConfigurations[category as TVCategorySlug];
  return {
    title: `${config.title} | CineLog`,
    description: `Browse all ${config.title.toLowerCase()}.`,
  };
}

export default async function TVShowCategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { category: categoryParam } = await params;
  const search = searchParams ? await searchParams : {};

  if (
    !categoryParam ||
    !Object.keys(tvCategoryConfigurations).includes(categoryParam)
  ) {
    notFound();
  }

  const categorySlug = categoryParam as TVCategorySlug;
  const config = tvCategoryConfigurations[categorySlug];
  if (!config) notFound();

  const pageQueryParam = search.page;
  let currentPage = 1;
  if (pageQueryParam) {
    const parsedPage = parseInt(
      Array.isArray(pageQueryParam) ? pageQueryParam[0] : pageQueryParam,
      10
    );
    if (!isNaN(parsedPage) && parsedPage > 0) {
      currentPage = parsedPage;
    } else {
      notFound();
    }
  }

  const data = await config.fetchFunction(currentPage);
  const items = data?.results || [];
  // totalPages directly from API, capped at 500 by TMDB for these endpoints usually
  const totalPages = Math.min(data?.total_pages || 1, 500);

  // If requested page is beyond actual total pages (and not page 1 for an empty category)
  if (currentPage > totalPages && totalPages > 0 && currentPage !== 1) {
    notFound();
  }
  // If a category legitimately has 0 total pages (e.g. upcoming with no results yet)
  // and user tries to access page > 1 for it.
  if (currentPage > 1 && totalPages === 0) {
    notFound();
  }

  const renderPaginationItems = () => {
    const pageNumbers = [];
    const ellipsis = (
      <PaginationItem key="ellipsis">
        <PaginationEllipsis />
      </PaginationItem>
    );
    const pagesToShowAroundCurrent = 1; // Number of pages on each side of current

    // Determine the range of pages to display
    let startPage = Math.max(2, currentPage - pagesToShowAroundCurrent);
    let endPage = Math.min(
      totalPages - 1, // Use totalPages directly
      currentPage + pagesToShowAroundCurrent
    );

    const displayedRangeLength = endPage - startPage + 1;
    const requiredDynamicPages = 2 * pagesToShowAroundCurrent + 1;

    // Adjust range if it's too small due to being near the beginning or end
    if (displayedRangeLength < requiredDynamicPages && totalPages > 1) {
      if (currentPage < 1 + requiredDynamicPages - 1) {
        // near beginning
        endPage = Math.min(
          totalPages - 1,
          startPage + requiredDynamicPages - displayedRangeLength
        );
      } else if (currentPage > totalPages - (requiredDynamicPages - 1)) {
        // near end
        startPage = Math.max(
          2,
          endPage - requiredDynamicPages + displayedRangeLength
        );
      }
    }
    // Ensure startPage is not greater than endPage if totalPages is small
    if (
      startPage > endPage &&
      totalPages > 1 &&
      totalPages <= 1 + requiredDynamicPages
    ) {
      startPage = 2;
      endPage = totalPages - 1;
    }

    // Page 1
    pageNumbers.push(
      <PaginationItem key={1}>
        <PaginationLink
          href={`/shows/${categorySlug}?page=1`}
          isActive={1 === currentPage}
        >
          1
        </PaginationLink>
      </PaginationItem>
    );

    // Ellipsis after page 1
    if (startPage > 2)
      pageNumbers.push(React.cloneElement(ellipsis, { key: "start-ellipsis" }));

    // Middle pages
    for (let i = startPage; i <= endPage; i++) {
      if (i === 0) continue; // Should not happen
      pageNumbers.push(
        <PaginationItem key={i}>
          <PaginationLink
            href={`/shows/${categorySlug}?page=${i}`}
            isActive={i === currentPage}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Ellipsis before last page
    if (endPage < totalPages - 1)
      // Use totalPages directly
      pageNumbers.push(React.cloneElement(ellipsis, { key: "end-ellipsis" }));

    // Last Page (if totalPages > 1)
    if (totalPages > 1) {
      pageNumbers.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            href={`/shows/${categorySlug}?page=${totalPages}`} // Use totalPages directly
            isActive={totalPages === currentPage}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }
    return pageNumbers;
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl sm:text-4xl font-bold text-center sm:text-left">
          {config.title}
        </h1>
        <PaginationLink href="/" size="sm" className="text-sm">
          ← Back to Home
        </PaginationLink>
      </div>

      {items.length > 0 ? (
        <div className="grid grid-cols-2 place-items-center sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
          {items.map((item) => (
            <MediaCard key={item.id} item={item} mediaType={config.mediaType} />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground text-lg py-10">
          {currentPage > 1 && totalPages >= 0 // Allow totalPages to be 0 for categories with no items
            ? `No TV shows found on page ${currentPage} for this category.`
            : "No TV shows found in this category at the moment."}
        </p>
      )}

      {/* Show pagination only if there's more than one page and items exist */}
      {totalPages > 1 && items.length > 0 && (
        <div className="mt-12 flex justify-center">
          <Pagination>
            <PaginationContent>
              {currentPage > 1 && (
                <PaginationItem>
                  <PaginationPrevious
                    href={`/shows/${categorySlug}?page=${currentPage - 1}`}
                  />
                </PaginationItem>
              )}
              {/* Removed conditional rendering based on isTrendingCategory */}
              {renderPaginationItems()}
              {currentPage < totalPages && ( // Use totalPages directly
                <PaginationItem>
                  <PaginationNext
                    href={`/shows/${categorySlug}?page=${currentPage + 1}`}
                  />
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </main>
  );
}
