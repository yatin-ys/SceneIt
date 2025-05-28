// app/page.tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MediaGrid } from "@/components/MediaGrid";
import {
  getPopularMovies,
  getPopularShows,
  getTopRatedMovies,
  getUpcomingMovies,
  getNowPlayingMovies,
  getTopRatedShows,
} from "@/lib/tmdb";

export default async function HomePage() {
  const [
    popularMoviesData,
    popularShowsData,
    topRatedMoviesData,
    upcomingMoviesData,
    nowPlayingMoviesData,
    topRatedShowsData,
  ] = await Promise.all([
    getPopularMovies(),
    getPopularShows(),
    getTopRatedMovies(),
    getUpcomingMovies(),
    getNowPlayingMovies(),
    getTopRatedShows(),
  ]);

  const popularMovies = popularMoviesData?.results || [];
  const popularShows = popularShowsData?.results || [];
  const topRatedMovies = topRatedMoviesData?.results || [];
  const upcomingMovies = upcomingMoviesData?.results || [];
  const nowPlayingMovies = nowPlayingMoviesData?.results || [];
  const topRatedShows = topRatedShowsData?.results || [];

  return (
    <main className="container mx-auto px-4 py-8 page-transition">
      <Tabs defaultValue="movies" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="movies">Movies</TabsTrigger>
          <TabsTrigger value="shows">TV Shows</TabsTrigger>
        </TabsList>

        <TabsContent value="movies" className="animate-scale-in">
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

        <TabsContent value="shows" className="animate-scale-in">
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