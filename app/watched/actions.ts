// app/watched/actions.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export interface WatchedDbItem {
  id: number; // primary key from DB
  user_id: string;
  movie_id: number;
  media_type: string;
  watched_at: string;
}

// Action to add a movie to the watched list
export async function addToWatched(
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

  // Check if already in watched list to prevent duplicate attempts
  const { data: existingItem, error: selectError } = await supabase
    .from("user_watched_movies")
    .select("id")
    .eq("user_id", user.id)
    .eq("movie_id", movieId)
    .eq("media_type", mediaType)
    .maybeSingle();

  if (selectError) {
    console.error("Error checking watched list:", selectError);
    return { success: false, error: "Could not check watched status." };
  }

  if (existingItem) {
    return { success: true, alreadyExists: true };
  }

  const { error: insertError } = await supabase
    .from("user_watched_movies")
    .insert({
      user_id: user.id,
      movie_id: movieId,
      media_type: mediaType,
    });

  if (insertError) {
    console.error("Error adding to watched list:", insertError);
    // The unique_user_watched_movie constraint handles race conditions
    if (insertError.code === "23505") {
      // unique_violation
      return { success: true, alreadyExists: true };
    }
    return { success: false, error: "Could not add movie to watched list." };
  }

  // Revalidate paths that might display this info
  revalidatePath(`/movies/detail/${movieId}`);
  // You might want to create a `/watched` page in the future
  // revalidatePath("/watched");
  return { success: true };
}

// Action to remove a movie from the watched list
export async function removeFromWatched(
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
    .from("user_watched_movies")
    .delete()
    .eq("user_id", user.id)
    .eq("movie_id", movieId)
    .eq("media_type", mediaType);

  if (error) {
    console.error("Error removing from watched list:", error);
    return {
      success: false,
      error: "Could not remove movie from watched list.",
    };
  }

  revalidatePath(`/movies/detail/${movieId}`);
  // revalidatePath("/watched");
  return { success: true };
}

// Action to check if a specific movie is in the user's watched list
export async function isMovieInWatched(
  movieId: number,
  mediaType: "movie" = "movie"
): Promise<boolean> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return false;
  }

  const { error, count } = await supabase
    .from("user_watched_movies")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("movie_id", movieId)
    .eq("media_type", mediaType);

  if (error) {
    console.error("Error checking watched list:", error);
    return false;
  }

  return (count ?? 0) > 0;
}
