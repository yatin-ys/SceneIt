// app/page.tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MediaGrid } from "@/components/MediaGrid";
import {
  // TMDBResponse import removed from here
  // getTrendingMovies,
  getPopularMovies,
  // getTrendingShows,
  getPopularShows,
  getTopRatedMovies,
  getUpcomingMovies,
  getNowPlayingMovies,
  getTopRatedShows,
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
    // trendingShowsData, // Type is inferred as TMDBResponse
    popularShowsData, // Type is inferred as TMDBResponse
    topRatedMoviesData,
    upcomingMoviesData,
    nowPlayingMoviesData,
    topRatedShowsData,
  ] = await Promise.all([
    // getTrendingMovies("week"),
    getPopularMovies(),
    // getTrendingShows("week"),
    getPopularShows(),
    getTopRatedMovies(),
    getUpcomingMovies(),
    getNowPlayingMovies(),
    getTopRatedShows(),
  ]);

  // Accessing .results (which is MediaItem[]) is fine due to type inference
  // const trendingMovies = trendingMoviesData?.results || [];
  const popularMovies = popularMoviesData?.results || [];
  // const trendingShows = trendingShowsData?.results || [];
  const popularShows = popularShowsData?.results || [];
  const topRatedMovies = topRatedMoviesData?.results || [];
  const upcomingMovies = upcomingMoviesData?.results || [];
  const nowPlayingMovies = nowPlayingMoviesData?.results || [];
  const topRatedShows = topRatedShowsData?.results || [];

  return (
    <main className="container mx-auto px-4 py-8">
      {/* The CineLog h1 that was here is now removed */}

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
            moreLinkHref="/movies/now-playing"
          />
          <MediaGrid
            items={popularMovies}
            mediaType="movie"
            title="Popular Movies"
            moreLinkHref="/movies/popular"
          />
          <MediaGrid
            items={upcomingMovies}
            mediaType="movie"
            title="Upcoming Movies"
            moreLinkHref="/movies/upcoming"
          />
          <MediaGrid
            items={topRatedMovies}
            mediaType="movie"
            title="Top Rated Movies"
            moreLinkHref="/movies/top-rated"
          />
        </TabsContent>

        <TabsContent value="shows">
          {/* <MediaGrid
            items={trendingShows}
            mediaType="tv"
            title="Trending Shows This Week"
          /> */}
          <MediaGrid
            items={popularShows}
            mediaType="tv"
            title="Popular Shows"
            moreLinkHref="/shows/popular"
          />
          <MediaGrid
            items={topRatedShows}
            mediaType="tv"
            title="Top Rated Shows"
            moreLinkHref="/shows/top-rated"
          />
        </TabsContent>
      </Tabs>
    </main>
  );
}
