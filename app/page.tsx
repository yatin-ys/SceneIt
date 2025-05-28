// app/page.tsx
import { MediaGrid } from "@/components/MediaGrid";
import {
  getPopularMovies,
  getTopRatedMovies,
  getUpcomingMovies,
  getNowPlayingMovies,
} from "@/lib/tmdb";

export default async function HomePage() {
  const [
    popularMoviesData,
    topRatedMoviesData,
    upcomingMoviesData,
    nowPlayingMoviesData,
  ] = await Promise.all([
    getPopularMovies(),
    getTopRatedMovies(),
    getUpcomingMovies(),
    getNowPlayingMovies(),
  ]);

  const popularMovies = popularMoviesData?.results || [];
  const topRatedMovies = topRatedMoviesData?.results || [];
  const upcomingMovies = upcomingMoviesData?.results || [];
  const nowPlayingMovies = nowPlayingMoviesData?.results || [];

  return (
    <main className="container mx-auto px-4 py-8 page-transition">
      {/* Movies Section */}
      <div className="animate-scale-in">
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
      </div>
    </main>
  );
}