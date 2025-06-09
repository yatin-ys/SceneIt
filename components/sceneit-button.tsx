// components/sceneit-button.tsx
"use client";

import { useState, useEffect, useTransition, Suspense } from "react";
import { Button } from "@/components/ui/button";
import {
  addToWatched,
  removeFromWatched,
  isMovieInWatched, // Server action for client-side fetch
} from "@/app/watched/actions";
import { toast } from "sonner";
import { Clapperboard, CheckCircle, Loader2 } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

interface SceneItButtonProps {
  movieId: number;
  mediaType?: "movie";
  user: User | null;
  // This prop is optional. If not provided, the component will fetch the status itself.
  initialIsInWatched?: boolean;
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

function SceneItButtonContent({
  movieId,
  mediaType = "movie",
  user,
  initialIsInWatched,
  className,
  variant = "outline",
  size = "default",
}: SceneItButtonProps) {
  const [isInWatched, setIsInWatched] = useState(initialIsInWatched ?? false);
  const [isLoadingClientCheck, setIsLoadingClientCheck] = useState(
    initialIsInWatched === undefined && !!user
  );
  const [isPendingAction, startTransition] = useTransition();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      if (initialIsInWatched === undefined) {
        setIsLoadingClientCheck(true);
        isMovieInWatched(movieId, mediaType)
          .then(setIsInWatched)
          .catch((err) => {
            console.error("Failed to check watched status on mount:", err);
          })
          .finally(() => setIsLoadingClientCheck(false));
      } else {
        setIsInWatched(initialIsInWatched);
        setIsLoadingClientCheck(false);
      }
    } else {
      setIsInWatched(false);
      setIsLoadingClientCheck(false);
    }
  }, [movieId, mediaType, user, initialIsInWatched]);

  const handleToggleWatched = () => {
    if (!user) {
      toast.error("Please log in to mark movies as watched.", {
        action: {
          label: "Login",
          onClick: () => router.push("/login"),
        },
      });
      return;
    }

    startTransition(async () => {
      const previousState = isInWatched;
      setIsInWatched(!previousState); // Optimistic update

      try {
        if (previousState) {
          const result = await removeFromWatched(movieId, mediaType);
          if (!result.success)
            throw new Error(result.error || "Failed to remove.");
          toast.success("Removed from your Scene'd list.");
        } else {
          const result = await addToWatched(movieId, mediaType);
          if (!result.success)
            throw new Error(result.error || "Failed to add.");
          if (result.alreadyExists) {
            toast.info("Already in your Scene'd list.");
            setIsInWatched(true);
          } else {
            toast.success("Added to your Scene'd list!");
          }
        }
      } catch (e: unknown) {
        let errorMessage = "An error occurred.";
        if (e instanceof Error) {
          errorMessage = e.message;
        }
        toast.error(errorMessage);
        setIsInWatched(previousState); // Revert on error
      }
    });
  };

  if (isLoadingClientCheck) {
    return (
      <Button variant={variant} size={size} className={className} disabled>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Loading...
      </Button>
    );
  }

  return (
    <Button
      onClick={handleToggleWatched}
      disabled={isPendingAction}
      variant={isInWatched ? "secondary" : variant}
      size={size}
      className={className}
      aria-pressed={isInWatched}
      aria-label={isInWatched ? "Remove from watched" : "Add to watched"}
    >
      {isPendingAction ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : isInWatched ? (
        <CheckCircle className="mr-2 h-4 w-4 text-primary" />
      ) : (
        <Clapperboard className="mr-2 h-4 w-4" />
      )}
      {isPendingAction
        ? "Updating..."
        : isInWatched
        ? "Scene'd It"
        : "Scene It"}
    </Button>
  );
}

export function SceneItButton(props: SceneItButtonProps) {
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
      <SceneItButtonContent {...props} />
    </Suspense>
  );
}
