// components/watchlist-button.tsx
"use client";

import { useState, useEffect, useTransition, Suspense } from "react";
import { Button } from "@/components/ui/button";
import {
  addToWatchlist,
  removeFromWatchlist,
  isMovieInWatchlist, // Server action for client-side fetch
} from "@/app/watchlist/actions";
import { toast } from "sonner";
import { Heart, CheckCircle, Loader2 } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

interface WatchlistButtonProps {
  movieId: number;
  mediaType?: "movie";
  user: User | null;
  initialIsInWatchlist?: boolean; // This prop will now be undefined when called from MoviePage
  className?: string;
  variant?:
    | "default"
    | "outline"
    | "ghost"
    | "link"
    | "secondary"
    | "destructive"
    | null
    | undefined;
  size?: "default" | "sm" | "lg" | "icon" | null | undefined;
}

function WatchlistButtonContent({
  movieId,
  mediaType = "movie",
  user,
  initialIsInWatchlist,
  className,
  variant = "outline",
  size = "default",
}: WatchlistButtonProps) {
  // If initialIsInWatchlist is provided (e.g. from a page that CAN pre-fetch), use it. Otherwise, default to false.
  const [isInWatchlist, setIsInWatchlist] = useState(
    initialIsInWatchlist ?? false
  );

  // isLoadingClientCheck is true if the client needs to make an explicit check for the watchlist status
  // This happens if initialIsInWatchlist was NOT provided AND a user is logged in.
  const [isLoadingClientCheck, setIsLoadingClientCheck] = useState(
    initialIsInWatchlist === undefined && !!user
  );

  const [isPendingAction, startTransition] = useTransition();
  const router = useRouter();

  useEffect(() => {
    // This effect handles the client-side fetch if needed
    if (user) {
      // If initialIsInWatchlist was NOT provided (is undefined), the server didn't/couldn't determine it.
      // The client then fetches this status.
      if (initialIsInWatchlist === undefined) {
        // console.log(`[WatchlistButton] movieId: ${movieId}, initialIsInWatchlist is undefined. User exists. Fetching client-side.`);
        setIsLoadingClientCheck(true); // Ensure loading state is active
        isMovieInWatchlist(movieId, mediaType)
          .then((fetchedStatus) => {
            // console.log(`[WatchlistButton] movieId: ${movieId}, Client fetch result: ${fetchedStatus}`);
            setIsInWatchlist(fetchedStatus);
          })
          .catch((err) => {
            console.error(
              `[WatchlistButton] movieId: ${movieId}, Failed to check watchlist status on mount (client fetch):`,
              err
            );
            // Optionally set isInWatchlist to false or show an error state on the button itself
          })
          .finally(() => setIsLoadingClientCheck(false));
      } else {
        // Server provided initialIsInWatchlist (true or false), so use it.
        // This also handles cases where the prop might change due to parent re-render.
        // console.log(`[WatchlistButton] movieId: ${movieId}, initialIsInWatchlist provided: ${initialIsInWatchlist}. Using server value.`);
        setIsInWatchlist(initialIsInWatchlist);
        setIsLoadingClientCheck(false); // Not loading if server provided data
      }
    } else {
      // No user, so not in watchlist and not loading a client check.
      // console.log(`[WatchlistButton] movieId: ${movieId}, No user. Setting isInWatchlist to false.`);
      setIsInWatchlist(false);
      setIsLoadingClientCheck(false);
    }
  }, [movieId, mediaType, user, initialIsInWatchlist]); // Dependencies are correct

  const handleToggleWatchlist = () => {
    if (!user) {
      toast.error("Please log in to manage your watchlist.", {
        action: {
          label: "Login",
          onClick: () => router.push("/login"),
        },
      });
      return;
    }

    startTransition(async () => {
      const previousState = isInWatchlist;
      setIsInWatchlist(!previousState); // Optimistic update

      try {
        if (previousState) {
          // Was in watchlist, try to remove
          const result = await removeFromWatchlist(movieId, mediaType);
          if (!result.success)
            throw new Error(result.error || "Failed to remove.");
          toast.success("Removed from watchlist.");
        } else {
          // Was not in watchlist, try to add
          const result = await addToWatchlist(movieId, mediaType);
          if (!result.success)
            throw new Error(result.error || "Failed to add.");
          if (result.alreadyExists) {
            toast.info("Already in your watchlist.");
            setIsInWatchlist(true); // Correct state if server says it's already there
          } else {
            toast.success("Added to watchlist!");
          }
        }
      } catch (e: unknown) {
        let errorMessage = "An error occurred.";
        if (e instanceof Error) {
          errorMessage = e.message;
        }
        toast.error(errorMessage);
        setIsInWatchlist(previousState); // Revert on error
      }
    });
  };

  // Show a loading state for the button itself if the client is fetching its initial status
  if (isLoadingClientCheck) {
    return (
      <Button variant={variant} size={size} className={className} disabled>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Loading Watchlist...
      </Button>
    );
  }

  return (
    <Button
      onClick={handleToggleWatchlist}
      disabled={isPendingAction} // Disable only during add/remove action, not initial client check
      variant={isInWatchlist ? "secondary" : variant}
      size={size}
      className={className}
      aria-pressed={isInWatchlist}
      aria-label={isInWatchlist ? "Remove from watchlist" : "Add to watchlist"}
    >
      {isPendingAction ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : isInWatchlist ? (
        <CheckCircle className="mr-2 h-4 w-4 text-primary" />
      ) : (
        <Heart className="mr-2 h-4 w-4" />
      )}
      {isPendingAction
        ? "Updating..."
        : isInWatchlist
        ? "In Watchlist"
        : "Add to Watchlist"}
    </Button>
  );
}

// The Suspense wrapper around WatchlistButtonContent might not be strictly needed
// if isMovieInWatchlist (server action) doesn't use hooks like useSearchParams internally.
// However, keeping it provides a boundary if future changes introduce such dependencies.
export function WatchlistButton(props: WatchlistButtonProps) {
  return (
    <Suspense
      fallback={
        <Button
          variant={props.variant || "outline"}
          size={props.size || "default"}
          className={props.className}
          disabled
        >
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Loading...
        </Button>
      }
    >
      <WatchlistButtonContent {...props} />
    </Suspense>
  );
}
