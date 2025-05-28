// app/search/page.tsx
import { searchMovies, MediaItem, TMDBResponse } from "@/lib/tmdb";
import { MediaCard } from "@/components/MediaCard";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    page?: string;
  }>;
}

export async function generateMetadata({ searchParams }: SearchPageProps) {
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams.q || "";
  if (query) {
    return {
      title: `Search: "${query}" - SceneIt`,
    };
  }
  return {
    title: "Search - SceneIt",
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams.q?.trim() || "";
  const currentPage = parseInt(resolvedSearchParams.page || "1", 10);

  if (!query) {
    return (
      <div className="container mx-auto px-4 py-8 text-center min-h-[50vh] flex flex-col justify-center items-center">
        <h1 className="text-3xl font-semibold mb-4">Search Movies</h1>
        <p className="text-muted-foreground">
          Please enter a search term in the bar above to find movies.
        </p>
      </div>
    );
  }

  const searchResponse: TMDBResponse = await searchMovies(query, currentPage);
  const movies: MediaItem[] = searchResponse.results;

  if (movies.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center min-h-[50vh] flex flex-col justify-center items-center">
        <h1 className="text-3xl font-semibold mb-4">
          No results found for &quot;{query}&quot;
        </h1>
        <p className="text-muted-foreground">
          Try a different search term or check your spelling.
        </p>
        <Button asChild variant="link" className="mt-6">
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 page-transition">
      <h1 className="text-3xl font-semibold mb-8">
        Showing results for &quot;{query}&quot;
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
        {movies.map((movie) => (
          <MediaCard key={movie.id} item={movie} mediaType="movie" />
        ))}
      </div>

      {/* Pagination */}
      {searchResponse.total_pages > 1 && (
        <div className="flex justify-between items-center mt-12">
          <Button asChild variant="outline" disabled={currentPage <= 1}>
            <Link
              href={`/search?q=${encodeURIComponent(query)}&page=${
                currentPage - 1
              }`}
              scroll={false}
            >
              Previous
            </Link>
          </Button>
          <p className="text-sm text-muted-foreground">
            Page {currentPage} of {searchResponse.total_pages} ({searchResponse.total_results} results)
          </p>
          <Button
            asChild
            variant="outline"
            disabled={currentPage >= searchResponse.total_pages}
          >
            <Link
              href={`/search?q=${encodeURIComponent(query)}&page=${
                currentPage + 1
              }`}
              scroll={false}
            >
              Next
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
