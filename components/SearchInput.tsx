// app/components/SearchInput.tsx
"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search as SearchIcon } from "lucide-react"; // Renamed to avoid conflict if you have a Search component
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function SearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");

  // Update query in input if URL changes (e.g., back/forward button or direct navigation)
  useEffect(() => {
    setQuery(searchParams.get("q") || "");
  }, [searchParams]);

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedQuery = query.trim();
    if (trimmedQuery) {
      router.push(`/search?q=${encodeURIComponent(trimmedQuery)}`);
    } else {
      // If the query is empty, navigate to the base search page
      // which will prompt the user to enter a term.
      router.push("/search");
    }
  };

  return (
    <form
      onSubmit={handleSearch}
      className="flex w-full items-center space-x-2"
      role="search"
    >
      <Input
        type="search"
        placeholder="Search movies..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex-grow"
        aria-label="Search movies"
      />
      <Button
        type="submit"
        variant="outline"
        size="icon"
        aria-label="Perform search"
      >
        <SearchIcon className="h-5 w-5" />
      </Button>
    </form>
  );
}