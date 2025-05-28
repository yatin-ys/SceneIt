export default function MovieDetailSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 animate-pulse">
      <div className="flex flex-col gap-8">
        {/* Back Button Placeholder */}
        <div>
          <div className="bg-gray-300 dark:bg-gray-700 h-8 w-32 rounded-md"></div>
        </div>

        {/* Movie Header */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster Placeholder */}
          <div className="w-full md:w-1/3 lg:w-1/4">
            <div className="bg-gray-300 dark:bg-gray-700 aspect-[2/3] rounded-lg"></div>
          </div>

          {/* Movie Info Placeholder */}
          <div className="flex-1 space-y-6">
            {/* Title Placeholder */}
            <div className="bg-gray-300 dark:bg-gray-700 h-10 w-3/4 rounded"></div>
            {/* Tagline Placeholder */}
            <div className="bg-gray-300 dark:bg-gray-700 h-6 w-1/2 rounded"></div>

            {/* Quick Info Badges Placeholder */}
            <div className="flex flex-wrap gap-3 mb-3">
              <div className="bg-gray-300 dark:bg-gray-700 h-7 w-28 rounded-full"></div>
              <div className="bg-gray-300 dark:bg-gray-700 h-7 w-24 rounded-full"></div>
              <div className="bg-gray-300 dark:bg-gray-700 h-7 w-20 rounded-full"></div>
              <div className="bg-gray-300 dark:bg-gray-700 h-7 w-24 rounded-full"></div>
            </div>

            {/* Genres Placeholder */}
            <div className="mb-3">
              <div className="bg-gray-300 dark:bg-gray-700 h-6 w-1/4 mb-2 rounded"></div> {/* Genres Title */}
              <div className="flex flex-wrap gap-2">
                <div className="bg-gray-300 dark:bg-gray-700 h-6 w-20 rounded-full"></div>
                <div className="bg-gray-300 dark:bg-gray-700 h-6 w-24 rounded-full"></div>
                <div className="bg-gray-300 dark:bg-gray-700 h-6 w-16 rounded-full"></div>
              </div>
            </div>

            {/* Overview Placeholder */}
            <div className="mb-3">
              <div className="bg-gray-300 dark:bg-gray-700 h-6 w-1/5 mb-2 rounded"></div> {/* Overview Title */}
              <div className="space-y-2">
                <div className="bg-gray-300 dark:bg-gray-700 h-4 w-full rounded"></div>
                <div className="bg-gray-300 dark:bg-gray-700 h-4 w-full rounded"></div>
                <div className="bg-gray-300 dark:bg-gray-700 h-4 w-5/6 rounded"></div>
              </div>
            </div>

            {/* Starring (Actors) Placeholder */}
            <div className="mb-3">
              <div className="bg-gray-300 dark:bg-gray-700 h-6 w-1/4 mb-2 rounded"></div> {/* Starring Title */}
              <div className="bg-gray-300 dark:bg-gray-700 h-4 w-full rounded"></div>
              <div className="bg-gray-300 dark:bg-gray-700 h-4 w-5/6 rounded"></div>
            </div>

            {/* Additional Details Placeholder */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
              {/* Director Placeholder */}
              <div>
                <div className="bg-gray-300 dark:bg-gray-700 h-5 w-1/3 mb-1 rounded"></div> {/* Detail Title: Directed by */}
                <div className="bg-gray-300 dark:bg-gray-700 h-4 w-3/4 rounded"></div>   {/* Detail Value */}
              </div>
              {/* Producer Placeholder */}
              <div>
                <div className="bg-gray-300 dark:bg-gray-700 h-5 w-1/3 mb-1 rounded"></div> {/* Detail Title: Produced by */}
                <div className="bg-gray-300 dark:bg-gray-700 h-4 w-3/4 rounded"></div>   {/* Detail Value */}
              </div>
              {/* Language Placeholder (existing) */}
              <div>
                <div className="bg-gray-300 dark:bg-gray-700 h-5 w-1/3 mb-1 rounded"></div>
                <div className="bg-gray-300 dark:bg-gray-700 h-4 w-1/2 rounded"></div>
              </div>
              {/* Country Placeholder (existing) */}
              <div>
                <div className="bg-gray-300 dark:bg-gray-700 h-5 w-1/3 mb-1 rounded"></div>
                <div className="bg-gray-300 dark:bg-gray-700 h-4 w-1/2 rounded"></div>
              </div>
              {/* Budget Placeholder (existing) */}
              <div>
                <div className="bg-gray-300 dark:bg-gray-700 h-5 w-1/3 mb-1 rounded"></div>
                <div className="bg-gray-300 dark:bg-gray-700 h-4 w-1/2 rounded"></div>
              </div>
              {/* Revenue Placeholder (existing) */}
              <div>
                <div className="bg-gray-300 dark:bg-gray-700 h-5 w-1/3 mb-1 rounded"></div>
                <div className="bg-gray-300 dark:bg-gray-700 h-4 w-1/2 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}