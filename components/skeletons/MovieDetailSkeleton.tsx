// components/skeletons/MovieDetailSkeleton.tsx
export default function MovieDetailSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 animate-pulse">
      <div className="flex flex-col gap-8">
        {/* Back Button Placeholder */}
        <div>
          <div className="bg-muted h-8 w-32 rounded-md"></div>
        </div>

        {/* Movie Header */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster Placeholder */}
          <div className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0">
            <div className="bg-muted aspect-[2/3] rounded-lg"></div>
          </div>

          {/* Movie Info Placeholder */}
          <div className="flex-1 space-y-6">
            {/* Title Placeholder */}
            <div className="bg-muted h-10 w-3/4 rounded"></div>
            {/* Tagline Placeholder */}
            <div className="bg-muted h-6 w-1/2 rounded"></div>

            {/* Combined Badges and Watchlist Button Placeholder */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-x-6 gap-y-6 mb-6">
              {/* Badges Placeholder Group */}
              <div className="flex flex-wrap gap-3">
                <div className="bg-muted h-7 w-28 rounded-full"></div>
                <div className="bg-muted h-7 w-24 rounded-full"></div>
                <div className="bg-muted h-7 w-20 rounded-full"></div>
                <div className="bg-muted h-7 w-24 rounded-full"></div>
              </div>
              {/* Watchlist Button Placeholder Wrapper */}
              <div className="w-full sm:w-auto sm:ml-auto">
                <div className="bg-muted h-12 w-full sm:w-48 rounded-md"></div>
              </div>
            </div>

            {/* Genres Placeholder */}
            <div className="space-y-2">
              <div className="bg-muted h-6 w-1/4 rounded"></div>{" "}
              {/* Genres Title */}
              <div className="flex flex-wrap gap-2">
                <div className="bg-muted h-6 w-20 rounded-full"></div>
                <div className="bg-muted h-6 w-24 rounded-full"></div>
                <div className="bg-muted h-6 w-16 rounded-full"></div>
              </div>
            </div>

            {/* Overview Placeholder */}
            <div className="space-y-2">
              <div className="bg-muted h-6 w-1/5 rounded"></div>{" "}
              {/* Overview Title */}
              <div className="space-y-2">
                <div className="bg-muted h-4 w-full rounded"></div>
                <div className="bg-muted h-4 w-full rounded"></div>
                <div className="bg-muted h-4 w-5/6 rounded"></div>
              </div>
            </div>

            {/* Starring (Actors) Placeholder */}
            <div className="space-y-2">
              <div className="bg-muted h-6 w-1/4 rounded"></div>{" "}
              {/* Starring Title */}
              <div className="space-y-2">
                <div className="bg-muted h-4 w-full rounded"></div>
                <div className="bg-muted h-4 w-5/6 rounded"></div>
              </div>
            </div>

            {/* Additional Details Placeholder */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
              {/* Detail Item */}
              <div className="space-y-1">
                <div className="bg-muted h-5 w-1/3 rounded"></div>{" "}
                {/* Detail Title */}
                <div className="bg-muted h-4 w-3/4 rounded"></div>{" "}
                {/* Detail Value */}
              </div>
              {/* Detail Item */}
              <div className="space-y-1">
                <div className="bg-muted h-5 w-1/3 rounded"></div>
                <div className="bg-muted h-4 w-3/4 rounded"></div>
              </div>
              {/* Detail Item */}
              <div className="space-y-1">
                <div className="bg-muted h-5 w-1/3 rounded"></div>
                <div className="bg-muted h-4 w-1/2 rounded"></div>
              </div>
              {/* Detail Item */}
              <div className="space-y-1">
                <div className="bg-muted h-5 w-1/3 rounded"></div>
                <div className="bg-muted h-4 w-1/2 rounded"></div>
              </div>
              {/* Detail Item */}
              <div className="space-y-1">
                <div className="bg-muted h-5 w-1/3 rounded"></div>
                <div className="bg-muted h-4 w-1/2 rounded"></div>
              </div>
              {/* Detail Item */}
              <div className="space-y-1">
                <div className="bg-muted h-5 w-1/3 rounded"></div>
                <div className="bg-muted h-4 w-1/2 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
