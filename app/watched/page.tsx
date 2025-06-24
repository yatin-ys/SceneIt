import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getWatchedItems } from "./actions";
import { getMovieDetails, MediaItem } from "@/lib/tmdb";
import { MediaCard } from "@/components/MediaCard";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";
import MediaGridSkeleton from "@/components/skeletons/MediaGridSkeleton";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "My Scene List | SceneIt",
  description: "Movies you've already seen.",
};

async function WatchedGrid() {
  const { data: watchedDbItems, error: watchedError } = await getWatchedItems();

  if (watchedError) {
    return <p className="text-red-500 text-center">{watchedError}</p>;
  }

  if (!watchedDbItems || watchedDbItems.length === 0) {
    return (
      <div className="text-center">
        <p className="text-muted-foreground text-lg">
          Your Scene It list is empty.
        </p>
        <p className="text-muted-foreground mt-2">
          Mark movies as &quot;Scene It&quot; from their detail pages.
        </p>
        <Button asChild className="mt-6">
          <Link href="/">Browse Movies</Link>
        </Button>
      </div>
    );
  }

  const movieDetailsPromises = watchedDbItems.map((item) =>
    getMovieDetails(item.movie_id.toString()).catch((err) => {
      console.error(
        `Failed to fetch details for movie ID ${item.movie_id}:`,
        err
      );
      return null;
    })
  );

  const moviesWithDetailsUnfiltered = await Promise.all(movieDetailsPromises);
  const moviesWithDetails = moviesWithDetailsUnfiltered.filter(
    (movie) => movie !== null
  ) as MediaItem[];

  if (moviesWithDetails.length === 0 && watchedDbItems.length > 0) {
    return (
      <p className="text-center text-muted-foreground">
        Could not load details for movies in your Scene It list. Please try
        again later.
      </p>
    );
  }

  if (moviesWithDetails.length === 0) {
    return (
      <p className="text-center text-muted-foreground text-lg">
        Your Scene It list is empty or movie details could not be loaded.
      </p>
    );
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

export default async function WatchedPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?message=Please log in to view your Scene It list.");
  }

  return (
    <main className="container mx-auto px-4 py-8 page-transition">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl sm:text-4xl font-bold text-center sm:text-left">
          My Scene List
        </h1>
        <Button asChild variant="outline" size="sm">
          <Link href="/">← Browse More Movies</Link>
        </Button>
      </div>
      <Suspense
        fallback={<MediaGridSkeleton itemCount={6} showTitle={false} />}
      >
        <WatchedGrid />
      </Suspense>
    </main>
  );
}
