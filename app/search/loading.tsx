// app/search/loading.tsx
import MediaGridSkeleton from "@/components/skeletons/MediaGridSkeleton";

export default function SearchLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Placeholder for the title "Showing results for..." */}
      <div className="animate-pulse mb-8">
        <div className="h-8 bg-muted rounded w-3/4 sm:w-1/2"></div>
      </div>
      {/* Use the existing MediaGridSkeleton */}
      <MediaGridSkeleton itemCount={12} showTitle={false} />
    </div>
  );
}