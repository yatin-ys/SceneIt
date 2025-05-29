// components/auth/search-param-error-display.tsx
"use client";

import { useEffect } from "react";
import { toast } from "sonner";

export function SearchParamErrorDisplay({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  useEffect(() => {
    const error = searchParams?.error;
    if (error && typeof error === "string") {
      toast.error(decodeURIComponent(error));
    }
  }, [searchParams]);

  return null; // This component does not render anything itself
}
