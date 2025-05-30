// components/auth/search-param-error-display.tsx
"use client";

import { useEffect } from "react";
import { toast } from "sonner";

interface SearchParamErrorDisplayProps {
  searchParams?: { [key: string]: string | string[] | undefined };
}

export function SearchParamErrorDisplay({ searchParams }: SearchParamErrorDisplayProps) {
  useEffect(() => {
    const error = searchParams?.error;
    if (error && typeof error === "string") {
      toast.error(decodeURIComponent(error));
    }
  }, [searchParams]);

  return null; // This component does not render anything itself
}