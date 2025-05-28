// app/page.tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MediaGrid } from "@/components/MediaGrid";
import {
  // TMDBResponse import removed from here
  // getTrendingMovies,
  getPopularMovies,
  getTrendingShows,
  getPopularShows,
  getTopRatedMovies,
  getUpcomingMovies,
  getNowPlayingMovies,
} from "@/lib/tmdb";
// import { get } from "http";
// MediaItem might still be needed if you were to type the .results arrays explicitly,
// but it's also inferred correctly in the current setup.
// If MediaItem also shows as unused, you can remove it too from page.tsx
// as MediaGrid itself imports it.

export default async function HomePage() {
  // Fetch data in parallel
  const [
    // trendingMoviesData, // Type is inferred as TMDBResponse
    popularMoviesData, // Type is inferred as TMDBResponse
    trendingShowsData, // Type is inferred as TMDBResponse
    popularShowsData, // Type is inferred as TMDBResponse
    topRatedMoviesData,
    upcomingMoviesData,
    nowPlayingMoviesData,
  ] = await Promise.all([
    // getTrendingMovies("week"),
    getPopularMovies(),
    getTrendingShows("week"),
    getPopularShows(),
    getTopRatedMovies(),
    getUpcomingMovies(),
    getNowPlayingMovies(),
  ]);

  // Accessing .results (which is MediaItem[]) is fine due to type inference
  // const trendingMovies = trendingMoviesData?.results || [];
  const popularMovies = popularMoviesData?.results || [];
  const trendingShows = trendingShowsData?.results || [];
  const popularShows = popularShowsData?.results || [];
  const topRatedMovies = topRatedMoviesData?.results || [];
  const upcomingMovies = upcomingMoviesData?.results || [];
  const nowPlayingMovies = nowPlayingMoviesData?.results || [];

  return (
    <main className="container mx-auto px-4 py-8">
      <h1
        className="text-5xl font-bold text-center mb-10 tracking-tight bg-clip-text text-transparent leading-tight pb-2"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--primary), var(--sidebar-primary), var(--accent))",
        }}
      >
        CineLog
      </h1>

      <Tabs defaultValue="movies" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="movies">Movies</TabsTrigger>
          <TabsTrigger value="shows">TV Shows</TabsTrigger>
        </TabsList>

        <TabsContent value="movies">
          <MediaGrid
            items={nowPlayingMovies}
            mediaType="movie"
            title="Now Playing Movies"
          />
          <MediaGrid
            items={popularMovies}
            mediaType="movie"
            title="Popular Movies"
          />
          <MediaGrid
            items={upcomingMovies}
            mediaType="movie"
            title="Upcoming Movies"
          />
          <MediaGrid
            items={topRatedMovies}
            mediaType="movie"
            title="Top Rated Movies"
          />
        </TabsContent>

        <TabsContent value="shows">
          <MediaGrid
            items={trendingShows}
            mediaType="tv"
            title="Trending Shows This Week"
          />
          <MediaGrid
            items={popularShows}
            mediaType="tv"
            title="Popular Shows"
          />
        </TabsContent>
      </Tabs>
    </main>
  );
}
