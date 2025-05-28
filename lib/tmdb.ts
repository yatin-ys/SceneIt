const API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean>;
}

async function fetchTMDB(endpoint: string, options: FetchOptions = {}) {
  const params = new URLSearchParams(options.params as Record<string, string>);
  const url = `${BASE_URL}/${endpoint}?api_key=${API_KEY}&${params.toString()}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        "Content-Type": "application/json",
      },
      // Recommended: Cache TMDB responses for a reasonable time
      next: { revalidate: 3600 }, // Revalidate every hour
    });

    if (!response.ok) {
      console.error(
        `TMDB API Error: ${response.status} ${response.statusText} for URL: ${url}`
      );
      const errorBody = await response
        .json()
        .catch(() => ({ message: "Failed to parse error response" }));
      console.error("Error details:", errorBody);
      throw new Error(
        `Failed to fetch data from TMDB: ${
          errorBody.message || response.statusText
        }`
      );
    }
    return response.json();
  } catch (error) {
    console.error(`Error in fetchTMDB for endpoint ${endpoint}:`, error);
    // Return a structure that won't break the UI, e.g., an empty results array
    return { results: [], page: 0, total_pages: 0, total_results: 0 };
  }
}

// Helper function to get current date in YYYY-MM-DD format
function getCurrentDateFormatted(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-indexed
  const day = today.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Helper function to get the end of the current year in YYYY-MM-DD format
function getEndOfCurrentYearFormatted(): string {
  const today = new Date();
  const year = today.getFullYear();
  return `${year}-12-31`; // December 31st of the current year
}

// Type definitions (can be expanded for more detail)
export interface MediaItem {
  id: number;
  poster_path: string | null;
  title?: string; // For movies
  name?: string; // For TV shows
  release_date?: string; // For movies
  first_air_date?: string; // For TV shows
  vote_average: number;
  overview: string;
  // Add other properties you might need
}

export interface TMDBResponse {
  page: number;
  results: MediaItem[];
  total_pages: number;
  total_results: number;
}

// --- Movies ---
// export async function getTrendingMovies(
//   timeWindow: "day" | "week" = "week"
// ): Promise<TMDBResponse> {
//   return fetchTMDB(`trending/movie/${timeWindow}`);
// }

export async function getNowPlayingMovies(
  page: number = 1
): Promise<TMDBResponse> {
  return fetchTMDB("movie/now_playing", { params: { page, region: "IN" } });
}

export async function getPopularMovies(
  page: number = 1
): Promise<TMDBResponse> {
  return fetchTMDB("movie/popular", { params: { page, region: "IN" } });
}

export async function getTopRatedMovies(
  page: number = 1
): Promise<TMDBResponse> {
  return fetchTMDB("movie/top_rated", { params: { page, region: "IN" } });
}

export async function getUpcomingMovies(
  page: number = 1
): Promise<TMDBResponse> {
  const currentDate = getCurrentDateFormatted();
  const endOfYear = getEndOfCurrentYearFormatted();
  return fetchTMDB("discover/movie", {
    params: {
      page,
      "primary_release_date.gte": currentDate, // Greater than or equal to today
      "primary_release_date.lte": endOfYear,
      sort_by: "popularity.desc", // Show upcoming movies first
      // You can add other discover parameters here as needed, e.g.:
      // with_release_type: '2|3', // 2: Theatrical (limited), 3: Theatrical (general)
      // 'vote_count.gte': 10, // Optional: filter out movies with very few votes
    },
  });
}

// --- TV Shows ---
// export async function getTrendingShows(
//   timeWindow: "day" | "week" = "week"
// ): Promise<TMDBResponse> {
//   return fetchTMDB(`trending/tv/${timeWindow}`);
// }

export async function getPopularShows(page: number = 1): Promise<TMDBResponse> {
  return fetchTMDB("tv/popular", { params: { page } });
}

export async function getTopRatedShows(
  page: number = 1
): Promise<TMDBResponse> {
  return fetchTMDB("tv/top_rated", { params: { page } });
}
