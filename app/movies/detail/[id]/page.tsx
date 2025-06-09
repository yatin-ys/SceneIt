// app/movies/detail/[id]/page.tsx
import Image from "next/image";
import {
  getMovieDetails,
  getMovieCredits,
  CastMember,
  CrewMember,
  MediaItem,
} from "@/lib/tmdb";
import { Badge } from "@/components/ui/badge";
import { PaginationLink } from "@/components/ui/pagination";
import { notFound } from "next/navigation";
import { WatchlistButton } from "@/components/watchlist-button";
import { SceneItButton } from "@/components/sceneit-button"; // New Import
import { createClient } from "@/lib/supabase/server";
import { isMovieInWatchlist } from "@/app/watchlist/actions"; // Import for server check
import { isMovieInWatched } from "@/app/watched/actions"; // New Import for server check
import type { Metadata } from "next";

const IMAGE_BASE_URL =
  process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE_URL ||
  "https://image.tmdb.org/t/p/original";

const findCrewMembers = (
  crew: CrewMember[],
  job: string,
  limit: number = 2
): string[] => {
  return crew
    .filter((member) => member.job === job)
    .slice(0, limit)
    .map((member) => member.name);
};

const getTopCast = (cast: CastMember[], limit: number = 5): string[] => {
  return cast
    .sort((a, b) => a.order - b.order)
    .slice(0, limit)
    .map((member) => member.name);
};

export async function generateMetadata({
  params: paramsPromise,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const params = await paramsPromise;
  const movieIdStr = params.id;

  try {
    const movie = await getMovieDetails(movieIdStr);
    if (!movie || !movie.title) {
      return {
        title: "Movie Details | SceneIt",
        description: "Detailed information about a movie.",
      };
    }
    return {
      title: `${movie.title} | SceneIt`,
      description: movie.overview || `Details for the movie ${movie.title}.`,
      openGraph: {
        title: `${movie.title} | SceneIt`,
        description: movie.overview || `Details for the movie ${movie.title}.`,
        images: movie.poster_path
          ? [`${IMAGE_BASE_URL}${movie.poster_path}`]
          : [],
      },
    };
  } catch (error) {
    console.error(
      "Failed to generate metadata for movie ID:",
      movieIdStr,
      error
    );
    return {
      title: "Movie Details | SceneIt",
      description: "Detailed information about a movie.",
    };
  }
}

export default async function MoviePage({
  params: paramsPromise,
}: {
  params: Promise<{ id: string }>;
}) {
  const params = await paramsPromise;
  const movieIdStr = params.id;
  const movieIdNum = parseInt(movieIdStr, 10);

  if (isNaN(movieIdNum)) {
    console.error("Invalid movie ID format:", movieIdStr);
    notFound();
  }

  let movie: MediaItem | null = null;
  let credits: { cast: CastMember[]; crew: CrewMember[] } | null = null;

  try {
    const [movieData, creditsData] = await Promise.all([
      getMovieDetails(movieIdStr),
      getMovieCredits(movieIdStr),
    ]);
    movie = movieData;
    credits = creditsData;
  } catch (error) {
    console.error(
      "Failed to fetch movie data or credits for ID:",
      movieIdStr,
      error
    );
  }

  if (!movie || !movie.id || !credits) {
    console.error(
      "Movie or credits data is missing or incomplete for ID:",
      movieIdStr
    );
    notFound();
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Pre-fetch button states on the server if the user is logged in
  let initialIsInWatchlist: boolean | undefined = undefined;
  let initialIsInWatched: boolean | undefined = undefined;

  if (user) {
    // Fetch statuses in parallel for better performance
    const [inWatchlist, inWatched] = await Promise.all([
      isMovieInWatchlist(movieIdNum),
      isMovieInWatched(movieIdNum),
    ]);
    initialIsInWatchlist = inWatchlist;
    initialIsInWatched = inWatched;
  } else {
    // If no user, they are not in either list
    initialIsInWatchlist = false;
    initialIsInWatched = false;
  }

  const releaseDate = movie.release_date
    ? new Date(movie.release_date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Release date unknown";

  const runtime = movie.runtime
    ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`
    : "Runtime unknown";

  const rating = movie.vote_average?.toFixed(1) || "N/A";

  const directors = findCrewMembers(credits.crew, "Director");
  const producers = findCrewMembers(credits.crew, "Producer", 3);
  const actors = getTopCast(credits.cast, 6);

  return (
    <main className="container mx-auto px-4 py-8 page-transition">
      <div className="flex flex-col gap-8">
        <div>
          <PaginationLink href="/" size="sm" className="text-sm">
            ← Back to Home
          </PaginationLink>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0">
            <div className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-lg">
              {movie.poster_path ? (
                <Image
                  src={`${IMAGE_BASE_URL}${movie.poster_path}`}
                  alt={movie.title || "Movie Poster"}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 100vw"
                  priority
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-200 dark:bg-slate-700">
                  <span className="text-slate-500 dark:text-slate-400">
                    No Poster Available
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-4">{movie.title}</h1>
            {movie.tagline && (
              <p className="text-lg text-muted-foreground italic mb-4">
                &quot;{movie.tagline}&quot;
              </p>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center gap-x-6 gap-y-6 mb-6">
              {/* Badges Section */}
              <div className="flex flex-wrap gap-3">
                <Badge variant="outline">{releaseDate}</Badge>
                <Badge variant="outline">{runtime}</Badge>
                <Badge
                  variant={
                    parseFloat(rating) >= 7
                      ? "default"
                      : parseFloat(rating) >= 5
                      ? "secondary"
                      : "destructive"
                  }
                >
                  ★ {rating}
                </Badge>
                {movie.status && (
                  <Badge variant="outline">{movie.status}</Badge>
                )}
              </div>

              {/* Combined Buttons Wrapper */}
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto sm:ml-auto">
                <WatchlistButton
                  movieId={movieIdNum}
                  user={user}
                  className="w-full sm:w-auto"
                  size="lg"
                  initialIsInWatchlist={initialIsInWatchlist}
                />
                <SceneItButton
                  movieId={movieIdNum}
                  user={user}
                  className="w-full sm:w-auto"
                  size="lg"
                  initialIsInWatched={initialIsInWatched}
                />
              </div>
            </div>

            {movie.genres && movie.genres.length > 0 && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">Genres</h2>
                <div className="flex flex-wrap gap-2">
                  {movie.genres.map((genre) => (
                    <Badge key={genre.id} variant="secondary">
                      {genre.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {movie.overview && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">Overview</h2>
                <p className="text-muted-foreground">{movie.overview}</p>
              </div>
            )}

            {actors.length > 0 && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">Starring</h2>
                <p className="text-muted-foreground">{actors.join(", ")}</p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
              {directors.length > 0 && (
                <div>
                  <h2 className="text-sm font-semibold">Directed by</h2>
                  <p className="text-muted-foreground">
                    {directors.join(", ")}
                  </p>
                </div>
              )}
              {producers.length > 0 && (
                <div>
                  <h2 className="text-sm font-semibold">Produced by</h2>
                  <p className="text-muted-foreground">
                    {producers.join(", ")}
                  </p>
                </div>
              )}
              {movie.original_language && (
                <div>
                  <h2 className="text-sm font-semibold">Language</h2>
                  <p className="text-muted-foreground">
                    {movie.original_language.toUpperCase()}
                  </p>
                </div>
              )}
              {movie.production_countries &&
                movie.production_countries.length > 0 && (
                  <div>
                    <h2 className="text-sm font-semibold">Country</h2>
                    <p className="text-muted-foreground">
                      {movie.production_countries
                        .map((country) => country.name)
                        .join(", ")}
                    </p>
                  </div>
                )}
              {movie.budget !== undefined && movie.budget > 0 && (
                <div>
                  <h2 className="text-sm font-semibold">Budget</h2>
                  <p className="text-muted-foreground">
                    ${movie.budget.toLocaleString("en-US")}
                  </p>
                </div>
              )}
              {movie.revenue !== undefined && movie.revenue > 0 && (
                <div>
                  <h2 className="text-sm font-semibold">Revenue</h2>
                  <p className="text-muted-foreground">
                    ${movie.revenue.toLocaleString("en-US")}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
