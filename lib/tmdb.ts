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
      next: { revalidate: 3600 },
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
    return { results: [], page: 0, total_pages: 0, total_results: 0 };
  }
}

function getCurrentDateFormatted(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, "0");
  const day = today.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getEndOfCurrentYearFormatted(): string {
  const today = new Date();
  const year = today.getFullYear();
  return `${year}-12-31`;
}

export interface MediaItem {
  id: number;
  poster_path: string | null;
  backdrop_path: string | null;
  title?: string;
  name?: string;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  overview: string;
  runtime?: number;
  status?: string;
  genres?: { id: number; name: string }[];
  original_language?: string;
  production_countries?: { iso_3166_1: string; name: string }[];
  budget?: number;
  revenue?: number;
  tagline?: string;
}

export interface TMDBResponse {
  page: number;
  results: MediaItem[];
  total_pages: number;
  total_results: number;
}

export async function getMovieDetails(movieId: string): Promise<MediaItem> {
  return fetchTMDB(`movie/${movieId}`);
}

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
      "primary_release_date.gte": currentDate,
      "primary_release_date.lte": endOfYear,
      sort_by: "popularity.desc",
    },
  });
}


export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number; // The order of the cast member in the credits
}

export interface CrewMember {
  id: number;
  name: string;
  job: string; // e.g., "Director", "Producer"
  department: string;
}

export interface CreditsResponse {
  id: number; // Movie ID
  cast: CastMember[];
  crew: CrewMember[];
}

export async function getMovieCredits(movieId: string): Promise<CreditsResponse> {
  return fetchTMDB(`movie/${movieId}/credits`);
}