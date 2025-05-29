// app/watchlist/page.tsx
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getWatchlistItems } from "./actions";
import { getMovieDetails, MediaItem } from "@/lib/tmdb";
import { MediaCard } from "@/components/MediaCard"; // Re-using MediaCard
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";
import MediaGridSkeleton from "@/components/skeletons/MediaGridSkeleton"; // For loading state
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "My Watchlist | SceneIt",
  description: "Movies you've saved to watch later.",
};

async function WatchlistGrid() {
  const { data: watchlistDbItems, error: watchlistError } = await getWatchlistItems();

  if (watchlistError) {
    return <p className="text-red-500 text-center">{watchlistError}</p>;
  }

  if (!watchlistDbItems || watchlistDbItems.length === 0) {
    return (
      <div className="text-center">
        <p className="text-muted-foreground text-lg">Your watchlist is empty.</p>
        <p className="text-muted-foreground mt-2">
          Add movies to your watchlist from their detail pages.
        </p>
        <Button asChild className="mt-6">
          <Link href="/">Browse Movies</Link>
        </Button>
      </div>
    );
  }

  const movieDetailsPromises = watchlistDbItems.map(item =>
    getMovieDetails(item.movie_id.toString()).catch(err => {
      console.error(`Failed to fetch details for movie ID ${item.movie_id}:`, err);
      return null; // Handle individual fetch errors gracefully
    })
  );
  
  const moviesWithDetailsUnfiltered = await Promise.all(movieDetailsPromises);
  const moviesWithDetails = moviesWithDetailsUnfiltered.filter(movie => movie !== null) as MediaItem[];

  if (moviesWithDetails.length === 0 && watchlistDbItems.length > 0) {
     return <p className="text-center text-muted-foreground">Could not load details for movies in your watchlist. Please try again later.</p>;
  }
  
  if (moviesWithDetails.length === 0) { // Should be caught by the earlier check, but as a safeguard
    return <p className="text-center text-muted-foreground text-lg">Your watchlist is empty or movie details could not be loaded.</p>;
  }

  return (
    <div className="grid grid-cols-2 place-items-center sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
      {moviesWithDetails.map((movie) => (
        <div key={movie.id} className="w-full">
          <MediaCard item={movie} mediaType="movie" />
        </div>
      ))}
    </div>
  );
}


export default async function WatchlistPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?message=Please log in to view your watchlist.");
  }

  return (
    <main className="container mx-auto px-4 py-8 page-transition">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl sm:text-4xl font-bold text-center sm:text-left">My Watchlist</h1>
        <Button asChild variant="outline" size="sm">
          <Link href="/">← Browse More Movies</Link>
        </Button>
      </div>
      <Suspense fallback={<MediaGridSkeleton itemCount={6} showTitle={false} />}>
        <WatchlistGrid />
      </Suspense>
    </main>
  );
}