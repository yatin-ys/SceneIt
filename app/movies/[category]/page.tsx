// app/movies/[category]/page.tsx

import React from "react";
import {
  getPopularMovies,
  getTopRatedMovies,
  getUpcomingMovies,
  getNowPlayingMovies,
  TMDBResponse,
} from "@/lib/tmdb";
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

type CategorySlug = "now-playing" | "popular" | "top-rated" | "upcoming";

interface CategoryConfig {
  fetchFunction: (page: number) => Promise<TMDBResponse>;
  title: string;
  mediaType: "movie";
}

const categoryConfigurations: Record<CategorySlug, CategoryConfig> = {
  "now-playing": {
    fetchFunction: getNowPlayingMovies,
    title: "Now Playing Movies",
    mediaType: "movie",
  },
  popular: {
    fetchFunction: getPopularMovies,
    title: "Popular Movies",
    mediaType: "movie",
  },
  "top-rated": {
    fetchFunction: getTopRatedMovies,
    title: "Top Rated Movies",
    mediaType: "movie",
  },
  upcoming: {
    fetchFunction: getUpcomingMovies,
    title: "Upcoming Movies",
    mediaType: "movie",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const categoryParam = resolvedParams.category;

  if (!categoryConfigurations[categoryParam as CategorySlug]) {
    return { title: "Movies | CineLog", description: "Browse movies." };
  }

  const { title } = categoryConfigurations[categoryParam as CategorySlug];
  return {
    title: `${title} | CineLog`,
    description: `Browse all ${title.toLowerCase()}.`,
  };
}

export default async function MovieCategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = searchParams ? await searchParams : undefined;

  const categoryParam = resolvedParams.category;

  if (
    !categoryParam ||
    !Object.keys(categoryConfigurations).includes(categoryParam)
  ) {
    notFound();
  }

  const categorySlug = categoryParam as CategorySlug;
  const config = categoryConfigurations[categorySlug];
  if (!config) notFound();

  const pageQueryParam = resolvedSearchParams?.page;
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
  const movies = data?.results || [];
  const totalPages = Math.min(data?.total_pages || 1, 500);

  if (currentPage > totalPages && totalPages > 0) {
    notFound();
  }

  const renderPaginationItems = () => {
    const pageNumbers = [];
    const ellipsis = (
      <PaginationItem key="ellipsis">
        <PaginationEllipsis />
      </PaginationItem>
    );
    const pagesToShowAroundCurrent = 1;

    let startPage = Math.max(2, currentPage - pagesToShowAroundCurrent);
    let endPage = Math.min(
      totalPages - 1,
      currentPage + pagesToShowAroundCurrent
    );

    const displayedRangeLength = endPage - startPage + 1;
    const requiredDynamicPages = 2 * pagesToShowAroundCurrent + 1;

    if (displayedRangeLength < requiredDynamicPages && totalPages > 1) {
      if (currentPage < 1 + requiredDynamicPages - 1) {
        endPage = Math.min(
          totalPages - 1,
          startPage + requiredDynamicPages - displayedRangeLength
        );
      } else if (currentPage > totalPages - (requiredDynamicPages - 1)) {
        startPage = Math.max(
          2,
          endPage - requiredDynamicPages + displayedRangeLength
        );
      }
    }

    if (startPage > endPage && totalPages <= 1 + requiredDynamicPages) {
      startPage = 2;
      endPage = totalPages - 1;
    }

    pageNumbers.push(
      <PaginationItem key={1}>
        <PaginationLink
          href={`/movies/${categorySlug}?page=1`}
          isActive={1 === currentPage}
        >
          1
        </PaginationLink>
      </PaginationItem>
    );

    if (startPage > 2)
      pageNumbers.push(React.cloneElement(ellipsis, { key: "start-ellipsis" }));

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <PaginationItem key={i}>
          <PaginationLink
            href={`/movies/${categorySlug}?page=${i}`}
            isActive={i === currentPage}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    if (endPage < totalPages - 1)
      pageNumbers.push(React.cloneElement(ellipsis, { key: "end-ellipsis" }));

    if (totalPages > 1) {
      pageNumbers.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            href={`/movies/${categorySlug}?page=${totalPages}`}
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

      {movies.length > 0 ? (
        <div className="grid grid-cols-2 place-items-center sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
          {movies.map((movie) => (
            <MediaCard
              key={movie.id}
              item={movie}
              mediaType={config.mediaType}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground text-lg py-10">
          {currentPage > 1 && totalPages > 0
            ? `No movies found on page ${currentPage} for this category.`
            : "No movies found in this category at the moment."}
        </p>
      )}

      {totalPages > 1 && movies.length > 0 && (
        <div className="mt-12 flex justify-center">
          <Pagination>
            <PaginationContent>
              {currentPage > 1 && (
                <PaginationItem>
                  <PaginationPrevious
                    href={`/movies/${categorySlug}?page=${currentPage - 1}`}
                  />
                </PaginationItem>
              )}
              {renderPaginationItems()}
              {currentPage < totalPages && (
                <PaginationItem>
                  <PaginationNext
                    href={`/movies/${categorySlug}?page=${currentPage + 1}`}
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
