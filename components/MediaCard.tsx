import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { MediaItem } from "@/lib/tmdb";
import Link from "next/link";

interface MediaCardProps {
  item: MediaItem;
  mediaType: "movie" | "tv";
}

const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE_URL || "https://image.tmdb.org/t/p/w500";

export function MediaCard({ item, mediaType }: MediaCardProps) {
  const title = mediaType === "movie" ? item.title : item.name;
  const releaseDate = mediaType === "movie" ? item.release_date : item.first_air_date;
  const year = releaseDate ? new Date(releaseDate).getFullYear() : "N/A";
  const rating = item.vote_average ? item.vote_average.toFixed(1) : "N/A";

  const href = mediaType === "movie" 
    ? `/movies/detail/${item.id}` 
    : `/shows/${item.id}`;

  return (
    <Link href={href} className="block" prefetch={false}>
      <div className="w-36 sm:w-40 md:w-44 flex flex-col flex-shrink-0 rounded-lg shadow-md overflow-hidden bg-card hover-lift animate-fade-in">
        <div
          className="relative w-full overflow-hidden rounded-t-lg"
          style={{ paddingBottom: "150%" }}
        >
          {item.poster_path ? (
            <Image
              src={`${IMAGE_BASE_URL}${item.poster_path}`}
              alt={title || "Media Poster"}
              fill
              className="object-cover transition-transform duration-300 hover:scale-105"
              sizes="(min-width: 768px) 176px, (min-width: 640px) 160px, 144px"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-200 dark:bg-slate-700">
              <span className="text-xs text-slate-500 dark:text-slate-400 text-center p-1">
                No Poster
              </span>
            </div>
          )}
        </div>
        <div className="p-2 flex flex-col flex-grow bg-card-foreground/5 dark:bg-card-foreground/10">
          <div
            className="text-sm font-semibold leading-tight mb-0.5 truncate text-card-foreground transition-colors duration-200"
            title={title || "Untitled"}
          >
            {title || "Untitled"}
          </div>
          <div className="text-xs text-muted-foreground mb-1.5 transition-colors duration-200">{year}</div>
          <div className="mt-auto">
            <Badge
              variant={
                parseFloat(rating) >= 7
                  ? "default"
                  : parseFloat(rating) >= 5
                  ? "secondary"
                  : "destructive"
              }
              className="text-[10px] px-1.5 py-0.5 transition-all duration-200 hover:scale-105"
            >
              ★ {rating}
            </Badge>
          </div>
        </div>
      </div>
    </Link>
  );
}