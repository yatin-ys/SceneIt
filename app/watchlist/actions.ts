// app/watchlist/actions.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export interface WatchlistDbItem {
  id: number; // primary key from DB
  user_id: string;
  movie_id: number;
  media_type: string;
  added_at: string;
}

// Action to add a movie to the watchlist
export async function addToWatchlist(
  movieId: number,
  mediaType: "movie" = "movie"
): Promise<{ success: boolean; error?: string; alreadyExists?: boolean }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "User not authenticated." };
  }

  // Check if already in watchlist to prevent duplicate attempts or provide specific feedback
  const { data: existingItem, error: selectError } = await supabase
    .from("user_watchlists")
    .select("id")
    .eq("user_id", user.id)
    .eq("movie_id", movieId)
    .eq("media_type", mediaType)
    .maybeSingle();

  if (selectError) {
    console.error("Error checking watchlist:", selectError);
    return { success: false, error: "Could not check watchlist status." };
  }

  if (existingItem) {
    return { success: true, alreadyExists: true };
  }

  const { error: insertError } = await supabase.from("user_watchlists").insert({
    user_id: user.id,
    movie_id: movieId,
    media_type: mediaType,
  });

  if (insertError) {
    console.error("Error adding to watchlist:", insertError);
    // The unique_user_movie constraint handles race conditions if this check fails
    if (insertError.code === "23505") {
      // unique_violation
      return { success: true, alreadyExists: true };
    }
    return { success: false, error: "Could not add movie to watchlist." };
  }

  revalidatePath("/watchlist");
  revalidatePath(`/movies/detail/${movieId}`); // Revalidate specific movie detail page
  revalidatePath("/", "layout"); // Revalidate layout if watchlist count is shown somewhere
  return { success: true };
}

// Action to remove a movie from the watchlist
export async function removeFromWatchlist(
  movieId: number,
  mediaType: "movie" = "movie"
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "User not authenticated." };
  }

  const { error } = await supabase
    .from("user_watchlists")
    .delete()
    .eq("user_id", user.id)
    .eq("movie_id", movieId)
    .eq("media_type", mediaType);

  if (error) {
    console.error("Error removing from watchlist:", error);
    return { success: false, error: "Could not remove movie from watchlist." };
  }

  revalidatePath("/watchlist");
  revalidatePath(`/movies/detail/${movieId}`);
  revalidatePath("/", "layout");
  return { success: true };
}

// Action to get all watchlist items for the current user
export async function getWatchlistItems(): Promise<{
  data?: WatchlistDbItem[];
  error?: string;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "User not authenticated." };
  }

  const { data, error } = await supabase
    .from("user_watchlists")
    .select("*")
    .eq("user_id", user.id)
    .order("added_at", { ascending: false });

  if (error) {
    console.error("Error fetching watchlist items:", error);
    return { error: "Could not fetch watchlist." };
  }

  return { data: data as WatchlistDbItem[] };
}

// Action to check if a specific movie is in the user's watchlist
export async function isMovieInWatchlist(
  movieId: number,
  mediaType: "movie" = "movie"
): Promise<boolean> {
  // console.log(`[isMovieInWatchlist ACTION] Checking: movieId=${movieId}, mediaType=${mediaType}`);
  const supabase = await createClient();
  const {
    data: { user }, // This 'data' here refers to the auth.getUser() result, which is fine.
  } = await supabase.auth.getUser();

  if (!user) {
    // console.log(`[isMovieInWatchlist ACTION] No user. Returning false.`);
    return false;
  }
  // console.log(`[isMovieInWatchlist ACTION] User ID: ${user.id}. Querying DB.`);

  // The ESLint error was for the 'data' variable from THIS query:
  const { error, count } = await supabase // Removed 'data' from here
    .from("user_watchlists")
    .select("id", { count: "exact", head: true }) // Efficiently check existence
    .eq("user_id", user.id)
    .eq("movie_id", movieId)
    .eq("media_type", mediaType);

  if (error) {
    console.error(
      "[isMovieInWatchlist ACTION] Error checking watchlist:",
      error
    );
    return false;
  }

  const isIn = (count ?? 0) > 0;
  // console.log(`[isMovieInWatchlist ACTION] Movie in watchlist for user ${user.id}? ${isIn}. Count: ${count}`);
  return isIn;
}
