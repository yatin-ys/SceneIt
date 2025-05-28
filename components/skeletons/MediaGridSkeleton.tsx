// components/skeletons/MediaGridSkeleton.tsx
const SkeletonCard = () => (
  <div className="animate-pulse space-y-3">
    <div className="bg-gray-300 dark:bg-gray-700 h-60 md:h-72 rounded-md"></div> {/* Poster placeholder */}
    <div className="space-y-2">
      <div className="bg-gray-300 dark:bg-gray-700 h-4 w-3/4 rounded"></div> {/* Title placeholder */}
      <div className="bg-gray-300 dark:bg-gray-700 h-4 w-1/2 rounded"></div> {/* Subtitle/date placeholder */}
    </div>
  </div>
);

export default function MediaGridSkeleton({ itemCount = 6, showTitle = true }) {
  return (
    <div className="py-8">
      {showTitle && (
        <div className="animate-pulse mb-6">
          <div className="bg-gray-300 dark:bg-gray-700 h-7 w-1/3 md:w-1/4 rounded"></div> {/* Section Title placeholder */}
        </div>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
        {Array.from({ length: itemCount }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    </div>
  );
}